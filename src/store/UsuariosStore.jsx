import { create } from "zustand";
import {
  EditarTemaMonedaUser,
  MostrarUsuarios,
  supabase,
  InsertarUsuarios,
  InsertarPermisos,
  MostrarUsuariosTodos,
  InsertarAsignaciones,
  Editarusuarios,
  EliminarPermisos,
} from "../index";

// Store de usuarios con gestión de autenticación, CRUD y permisos de módulos
export const useUsuariosStore = create((set, get) => ({
  // Array de módulos marcados como seleccionados
  datamoduloscheck: [],
  setdatamodulosCheck: (p) => {
    set({ datamoduloscheck: p });
  },
  // ID del usuario actualmente en sesión
  idusuario: 0,
  // Resetea el ID de usuario a 0
  setiduser: () => {
    set({ idusuario: 0 });
  },
  // Datos del usuario actual
  datausuarios: [],
  // Lista de todos los usuarios del sistema
  datausuariosTodos: [],

  // Obtiene los datos del usuario actual con manejo de errores mejorado
  mostrarUsuarios: async () => {
    try {
      const response = await MostrarUsuarios();
      console.log("🟡 mostrarUsuarios - Respuesta:", response);

      set({ datausuarios: response || [] });

      if (response) {
        set({ idusuario: response.id });
        return response;
      } else {
        // ✅ Si no hay usuario, limpiar el estado
        set({ idusuario: 0 });
        return null;
      }
    } catch (error) {
      console.error("❌ Error en mostrarUsuarios:", error);
      set({ datausuarios: [], idusuario: 0 });
      return null;
    }
  },

  // Obtiene la lista completa de usuarios
  mostrarUsuariosTodos: async (p) => {
    const response = await MostrarUsuariosTodos(p);
    set({ datausuariosTodos: response });
    return response;
  },

  // Actualiza el tema y moneda del usuario, luego refresca sus datos
  editartemamonedauser: async (p) => {
    await EditarTemaMonedaUser(p);
    const { mostrarUsuarios } = get();
    await mostrarUsuarios(); // ✅ Agregar await
  },

  // Edita un usuario y actualiza sus permisos (elimina antiguos e inserta nuevos)
  editarusuario: async (p, datacheckpermisos, idempresa) => {
    try {
      await Editarusuarios(p);
      const { mostrarUsuariosTodos } = get();
      await EliminarPermisos({ id_usuario: p.id });

      //  CORREGIDO: Usar Promise.all para permisos
      const permisosPromises = datacheckpermisos
        .filter((item) => item.check)
        .map(async (item) => {
          const parametrospermisos = {
            id_usuario: p.id,
            idmodulo: item.id,
          };
          await InsertarPermisos(parametrospermisos);
        });

      await Promise.all(permisosPromises);
      await mostrarUsuariosTodos({ _id_empresa: idempresa });
    } catch (error) {
      console.error("❌ Error en editarusuario:", error);
      throw error;
    }
  },

 // Registra un usuario administrador: primero en Auth, luego en la tabla usuarios
  insertarUsuarioAdmin: async (p) => {
  try {
    console.log('🔵 [1/3] Iniciando registro para:', p.correo);
    
    //  1. Registrar en Auth de Supabase
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: p.correo.toLowerCase().trim(),
      password: p.pass,
      options: {
        data: {
          tipouser: p.tipouser,
        }
      }
    });

    if (signUpError) throw new Error(`Error en Auth: ${signUpError.message}`);
    if (!signUpData.user) throw new Error('No se pudo crear el usuario en Auth');

    console.log('✅ [1/3] Usuario creado en Auth:', signUpData.user.id);

    //  2. Insertar en tabla usuarios - SOLO campos necesarios, SIN id
    console.log('🔵 [2/3] Insertando en tabla usuarios...');
    
    const datosUsuario = {
      idauth: signUpData.user.id,
      correo: p.correo,
      fecharegistro: new Date().toISOString(),
      tipouser: p.tipouser,
      estado: "activo"
      //  NO incluir campo 'id' - se generará automáticamente
    };
    
    console.log('🔵 Datos para insertar (SIN ID):', datosUsuario);
    
    const userData = await InsertarUsuarios(datosUsuario);
    console.log('✅ [2/3] Usuario insertado en tabla:', userData);

    console.log('✅ [3/3] Registro completo exitoso');
    return signUpData.user;

  } catch (error) {
    console.error('❌ Error completo en insertarUsuarioAdmin:', error);
    throw error;
  }
},

  // Inserta un usuario en la tabla (el ID se genera automáticamente por la BD)
  insertarUsuarios: async (p) => {
  try {
    console.log("🟡 InsertarUsuarios - Parametros recibidos:", p);
    
    //  CREAR un nuevo objeto SIN el campo id
    const datosParaInsertar = {
      idauth: p.idauth,
      correo: p.correo,
      fecharegistro: p.fecharegistro,
      tipouser: p.tipouser,
      estado: p.estado,
      nombres: p.nombres || null,
      nro_doc: p.nro_doc || null,
      telefono: p.telefono || null,
      direccion: p.direccion || null,
      tipodoc: p.tipodoc || null
      //  NO incluir el campo 'id' - se generará automáticamente
    };
    
    console.log("🟡 Datos para insertar (SIN ID):", datosParaInsertar);
    
    const { data, error } = await supabase
      .from("usuarios")
      .insert([datosParaInsertar])
      .select()
      .single();

    console.log("🟡 InsertarUsuarios - Respuesta:", { data, error });

    if (error) {
      console.error("❌ Error insertando usuario:", {
        code: error.code,
        message: error.message,
        details: error.details
      });
      throw error;
    }

    if (data) {
      console.log("✅ Usuario insertado correctamente:", data);
      return data;
    }

    throw new Error('No se recibió data del usuario insertado');

  } catch (error) {
    console.error("❌ Error en InsertarUsuarios:", error);
    throw error;
  }
},

  // Prueba la conexión con Supabase (Auth y tabla usuarios)
  testSupabaseConnection: async () => {
    try {
      console.log("🧪 Testeando conexión Supabase...");

      // Test Auth
      const { data: authData, error: authError } =
        await supabase.auth.getSession();
      console.log("🧪 Auth test:", {
        tieneSesion: !!authData?.session,
        usuario: authData?.session?.user?.email,
        error: authError,
      });

      // Test tabla usuarios
      const { data: tableData, error: tableError } = await supabase
        .from("usuarios")
        .select("count")
        .limit(1);
      console.log("🧪 Table test:", {
        cuenta: tableData?.[0]?.count,
        error: tableError,
      });

      return {
        auth: { data: authData, error: authError },
        table: { data: tableData, error: tableError },
      };
    } catch (error) {
      console.error("🧪 Test error:", error);
      throw error;
    }
  },

  // Limpia todos los datos de usuario del store
  limpiarUsuario: () => {
    set({
      datausuarios: [],
      idusuario: 0,
      datausuariosTodos: [],
    });
  },
}));