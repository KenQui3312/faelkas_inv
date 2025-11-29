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

export const useUsuariosStore = create((set, get) => ({
  datamoduloscheck: [],
  setdatamodulosCheck: (p) => {
    set({ datamoduloscheck: p });
  },
  idusuario: 0,
  setiduser: () => {
    set({ idusuario: 0 });
  },
  datausuarios: [],
  datausuariosTodos: [],

  // ✅ CORREGIDO: mostrarUsuarios con mejor manejo de null
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

  mostrarUsuariosTodos: async (p) => {
    const response = await MostrarUsuariosTodos(p);
    set({ datausuariosTodos: response });
    return response;
  },

  editartemamonedauser: async (p) => {
    await EditarTemaMonedaUser(p);
    const { mostrarUsuarios } = get();
    await mostrarUsuarios(); // ✅ Agregar await
  },

  // ✅ CORREGIDO: editarusuario con mejor manejo de async
  editarusuario: async (p, datacheckpermisos, idempresa) => {
    try {
      await Editarusuarios(p);
      const { mostrarUsuariosTodos } = get();
      await EliminarPermisos({ id_usuario: p.id });

      // ✅ CORREGIDO: Usar Promise.all para permisos
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
// En UsuariosStore.jsx - MEJORA la función insertarUsuarioAdmin
insertarUsuarioAdmin: async (p) => {
  try {
    console.log('🔵 [1/3] Iniciando registro para:', p.correo);
    
    // ✅ Validaciones
    if (!p.correo) throw new Error('El correo es requerido');
    if (!p.pass) throw new Error('La contraseña es requerida');

    // ✅ 1. Registrar en Auth de Supabase
    console.log('🔵 [1/3] Registrando en Auth...');
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: p.correo.toLowerCase().trim(),
      password: p.pass,
      options: {
        data: {
          tipouser: p.tipouser || 'usuario',
        }
      }
    });

    // ✅ MEJORADO: Manejar específicamente el error de duplicado
    if (signUpError) {
      console.error('❌ Error en Auth:', signUpError);
      
      // ✅ Si es error de duplicado, verificar si el usuario ya existe
      if (signUpError.message.includes('duplicate key') || signUpError.message.includes('already registered')) {
        console.log('🔄 Usuario ya existe en Auth, verificando en BD...');
        
        // Buscar el usuario por correo en la tabla usuarios
        const { data: usuarioExistente } = await supabase
          .from("usuarios")
          .select("*")
          .eq("correo", p.correo)
          .single();
          
        if (usuarioExistente) {
          console.log('✅ Usuario encontrado en BD:', usuarioExistente);
          return usuarioExistente;
        } else {
          // Si no existe en BD pero sí en Auth, crear en BD
          console.log('🔄 Usuario existe en Auth pero no en BD, creando en BD...');
          return await crearUsuarioEnBD(p, signUpError);
        }
      }
      
      throw new Error(`Error de autenticación: ${signUpError.message}`);
    }

    if (!signUpData.user) {
      throw new Error('No se pudo crear el usuario en el sistema de autenticación');
    }

    console.log('✅ [1/3] Usuario creado en Auth:', signUpData.user.id);

    // ✅ 2. Insertar en tabla usuarios
    console.log('🔵 [2/3] Insertando en tabla usuarios...');
    
    const datosUsuario = {
      idauth: signUpData.user.id,
      correo: p.correo,
      fecharegistro: new Date().toISOString(),
      tipouser: p.tipouser || 'usuario',
      estado: "activo",
      nombres: p.nombres || null,
      nro_doc: p.nrodoc || null,
      telefono: p.telefono || null,
      direccion: p.direccion || null,
      tipodoc: p.tipodoc || null
    };
    
    console.log('🔵 Datos para BD:', datosUsuario);
    
    const userData = await InsertarUsuarios(datosUsuario);
    console.log('✅ [2/3] Usuario insertado en tabla:', userData);

    // ✅ 3. Retornar datos combinados
    const resultado = {
      ...userData,
      authUser: signUpData.user
    };

    console.log('✅ [3/3] Registro completo exitoso:', resultado);
    return resultado;

  } catch (error) {
    console.error('❌ Error completo en insertarUsuarioAdmin:', error);
    throw error;
  }
},

// ✅ AGREGAR esta función auxiliar para manejar usuarios existentes en Auth
crearUsuarioEnBD: async (p, authError) => {
  try {
    console.log('🔄 Creando usuario en BD (existente en Auth)...');
    
    // Obtener el usuario de Auth por correo
    const { data: authUsers } = await supabase.auth.admin.listUsers();
    const usuarioAuth = authUsers?.users.find(user => user.email === p.correo);
    
    if (!usuarioAuth) {
      throw new Error('No se pudo encontrar el usuario en Auth');
    }

    const datosUsuario = {
      idauth: usuarioAuth.id,
      correo: p.correo,
      fecharegistro: new Date().toISOString(),
      tipouser: p.tipouser || 'usuario',
      estado: "activo",
      nombres: p.nombres || null,
      nro_doc: p.nrodoc || null,
      telefono: p.telefono || null,
      direccion: p.direccion || null,
      tipodoc: p.tipodoc || null
    };
    
    const userData = await InsertarUsuarios(datosUsuario);
    console.log('✅ Usuario creado en BD (existente en Auth):', userData);
    return userData;
    
  } catch (error) {
    console.error('❌ Error creando usuario en BD:', error);
    throw error;
  }
},


  insertarUsuario: async (parametrosAuth, datosUsuario, permisos) => {
    try {
    console.log("🟡 InsertarUsuarios - Usando INSERCIÓN DIRECTA");
    console.log("🟡 Datos recibidos:", p);
    
    // ✅ Validar datos requeridos
    if (!p.idauth) throw new Error('idauth es requerido');
    if (!p.correo) throw new Error('correo es requerido');

    // ✅ Inserción DIRECTA en lugar de RPC
    const datosInserción = {
      idauth: p.idauth,
      correo: p.correo,
      fecharegistro: p.fecharegistro || new Date().toISOString(),
      tipouser: p.tipouser || 'usuario',
      estado: p.estado || 'activo',
      nombres: p.nombres || null,
      nro_doc: p.nrodoc || null,
      telefono: p.telefono || null,
      direccion: p.direccion || null,
      tipodoc: p.tipodoc || null
    };
    
    console.log("🟡 Insertando directamente:", datosInserción);

    const { data, error } = await supabase
      .from("usuarios")
      .insert([datosInserción])
      .select()
      .single();

    console.log("🟡 Respuesta inserción directa:", { data, error });

    if (error) {
      console.error("❌ Error inserción directa:", {
        code: error.code,
        message: error.message,
        details: error.details
      });
      
      // ✅ MEJORADO: Manejar diferentes tipos de errores de duplicado
      if (error.code === '23505') {
        console.log("🔄 Usuario ya existe en BD, buscando...");
        
        // Buscar por idauth O por correo
        const { data: usuarioExistente } = await supabase
          .from("usuarios")
          .select("*")
          .or(`idauth.eq.${p.idauth},correo.eq.${p.correo}`)
          .single();
          
        if (usuarioExistente) {
          console.log("✅ Usuario existente encontrado:", usuarioExistente);
          return usuarioExistente;
        }
        
        throw new Error('El usuario ya está registrado en el sistema');
      }
      
      throw new Error(`Error al crear usuario: ${error.message}`);
    }

    if (!data) {
      throw new Error('No se recibieron datos del usuario creado');
    }

    console.log("✅ Usuario insertado correctamente (directo):", data);
    return data;

    } catch (error) {
      console.error("❌ Error en insertarUsuario:", error);
      throw error;
    }
  },
  // ✅ FUNCIÓN MEJORADA: testSupabaseConnection
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

  // ✅ NUEVA FUNCIÓN: Limpiar estado de usuario
  limpiarUsuario: () => {
    set({
      datausuarios: [],
      idusuario: 0,
      datausuariosTodos: [],
    });
  },
}));