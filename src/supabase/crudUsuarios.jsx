import Swal from "sweetalert2";
import { ObtenerIdAuthSupabase, supabase } from "../index";

// ✅ FUNCIÓN AUXILIAR: Obtener id_empresa del usuario autenticado
const obtenerIdEmpresaUsuario = async () => {
  try {
    const idAuth = await ObtenerIdAuthSupabase();
    console.log("🔍 Obteniendo id_empresa para usuario auth:", idAuth);
    
    if (!idAuth) {
      console.warn("⚠️ No hay usuario autenticado");
      return null;
    }

    // Primero obtener el id del usuario en la tabla usuarios
    const { data: usuarioData, error: usuarioError } = await supabase
      .from("usuarios")
      .select("id")
      .eq("idauth", idAuth)
      .single();

    if (usuarioError) {
      console.error("❌ Error obteniendo usuario:", usuarioError);
      return null;
    }

    if (!usuarioData) {
      console.warn("⚠️ Usuario no encontrado en tabla usuarios");
      return null;
    }

    console.log("🔍 ID usuario encontrado:", usuarioData.id);

    // Luego obtener la empresa asignada
    const { data: asignacionData, error: asignacionError } = await supabase
      .from("asignarempresa")
      .select("id_empresa")
      .eq("id_usuario", usuarioData.id)
      .single();

    if (asignacionError) {
      console.error("❌ Error obteniendo asignación:", asignacionError);
      return null;
    }

    if (!asignacionData) {
      console.warn("⚠️ No se encontró empresa asignada al usuario");
      return null;
    }

    console.log("✅ ID Empresa obtenido:", asignacionData.id_empresa);
    return asignacionData.id_empresa;

  } catch (error) {
    console.error("❌ Error en obtenerIdEmpresaUsuario:", error);
    return null;
  }
};

// función InsertarUsuarios
export async function InsertarUsuarios(p) {
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
      estado: p.estado || 'activo'
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
      
      // ✅ Manejar error de duplicado
      if (error.code === '23505') {
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
    console.error("❌ Error en InsertarUsuarios:", error);
    throw error;
  }
}

export const probarRPCUsuario = async () => {
  try {
    console.log("🧪 Probando RPC insertar_usuario_seguro...");
    
    const testData = {
      p_idauth: 'test-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
      p_correo: 'test-' + Date.now() + '@ejemplo.com',
      p_fecharegistro: new Date().toISOString(),
      p_tipouser: 'usuario',
      p_estado: 'activo'
    };
    
    console.log("🧪 Datos de prueba:", testData);
    
    const { data, error } = await supabase.rpc('insertar_usuario_seguro', testData);
    
    console.log("🧪 Resultado RPC:", { data, error });
    
    if (error) {
      console.error("❌ Error en prueba RPC:", {
        message: error.message,
        details: error.details,
        code: error.code
      });
      return { success: false, error };
    }
    
    console.log("✅ RPC funcionó correctamente:", data);
    return { success: true, data };
    
  } catch (error) {
    console.error("❌ Error en probarRPCUsuario:", error);
    return { success: false, error };
  }
};

// Ejecutar en consola: await probarRPCUsuario()
export const InsertarAsignaciones = async (p) => {
  try {
    console.log("🟡 InsertarAsignaciones - Parametros:", p);
    
    const { data, error } = await supabase.from("asignarempresa").insert([p]).select();

    if (error) {
      console.error("❌ Error insertando asignación:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Error al insertar asignación: " + error.message,
      });
      throw error;
    }

    console.log("✅ Asignación insertada correctamente:", data);
    return data;

  } catch (error) {
    console.error("❌ Error en InsertarAsignaciones:", error);
    throw error;
  }
};

export const MostrarUsuarios = async () => {
  try {
    const idAuthSupabase = await ObtenerIdAuthSupabase();
    console.log("🟡 MostrarUsuarios - ID Auth:", idAuthSupabase);
    
    if (!idAuthSupabase) {
      console.log("⚠️ No hay usuario autenticado - retornando null");
      return null;
    }
    
    const { error, data } = await supabase
      .from("usuarios")
      .select()
      .eq("idauth", idAuthSupabase)
      .single();

    if (error) {
      if (error.code === '406' || error.message.includes('406')) {
        console.log("⚠️ Usuario no encontrado en tabla - puede ser nuevo registro");
        return null;
      }
      
      console.error("❌ Error mostrando usuario:", error);
      return null;
    }

    if (data) {
      console.log("✅ Usuario encontrado:", data);
      return data;
    }

    console.log("⚠️ No se encontró usuario con idauth:", idAuthSupabase);
    return null;

  } catch (error) {
    console.error("❌ Error en MostrarUsuarios:", error);
    return null;
  }
};

// En crudUsuarios.jsx - agrega esta función de diagnóstico
export const diagnosticarFuncionesRPC = async () => {
  try {
    console.log("🔍 Diagnosticando funciones RPC...");
    
    // Verificar funciones existentes
    const { data: funciones, error } = await supabase
      .from('information_schema.routines')
      .select('routine_name, data_type')
      .eq('routine_name', 'insertar_usuario_seguro')
      .eq('specific_schema', 'public');

    console.log("🔍 Funciones RPC encontradas:", funciones);
    
    if (funciones && funciones.length > 1) {
      console.warn("⚠️ Se encontraron múltiples funciones con el mismo nombre");
      return { tieneDuplicados: true, funciones };
    }
    
    return { tieneDuplicados: false, funciones };
    
  } catch (error) {
    console.error("❌ Error en diagnóstico RPC:", error);
    return { error: error.message };
  }
};

// MUESTRA TODOS LOS USUARIOS
export const MostrarUsuariosTodos = async (p = {}) => {
  try {
    console.log("=== MOSTRAR TODOS LOS USUARIOS ===");
    
    // ✅ OPCIÓN 1: Si se proporciona _id_empresa, filtrar por empresa
    if (p._id_empresa) {
      console.log("🔍 Filtrando por empresa:", p._id_empresa);
      
      const { data, error } = await supabase.rpc("mostrarpersonal", {
        _id_empresa: p._id_empresa
      });

      if (error) {
        console.error("❌ Error en RPC mostrarpersonal:", error);
        return await consultaDirectaUsuarios(p._id_empresa);
      }

      console.log("✅ Usuarios encontrados (filtrados por empresa):", data?.length || 0);
      return data || [];
    }
    
    // ✅ OPCIÓN 2: Si NO se proporciona empresa, mostrar TODOS los usuarios
    console.log("🌍 Mostrando TODOS los usuarios (sin filtro de empresa)");
    
    const { data, error } = await supabase
      .from("usuarios")
      .select("id, nombres, tipouser, estado, correo, nro_doc, telefono, direccion, tipodoc")
      .order("nombres");

    if (error) {
      console.error("❌ Error cargando todos los usuarios:", error);
      throw error;
    }

    console.log("✅ TODOS los usuarios cargados:", data?.length || 0);
    return data || [];

  } catch (error) {
    console.error("❌ Error en MostrarUsuariosTodos:", error);
    
    // Fallback: intentar cargar todos los usuarios de otra manera
    try {
      const { data, error } = await supabase
        .from("usuarios")
        .select("*")
        .limit(100);
      
      if (!error) return data || [];
    } catch (fallbackError) {
      console.error("❌ Error en fallback:", fallbackError);
    }
    
    return [];
  }
};

// ✅ NUEVA FUNCIÓN: Buscar usuarios con id_empresa automático
export const BuscarUsuarios = async (buscador) => {
  try {
    console.log("🔍 BuscarUsuarios - Término de búsqueda:", buscador);
    
    const idEmpresa = await obtenerIdEmpresaUsuario();
    
    if (!idEmpresa) {
      console.warn("⚠️ No se pudo obtener id_empresa para búsqueda");
      return [];
    }
    
    console.log("🔄 Llamando RPC buscarpersonal con:", {
      buscador,
      _id_empresa: idEmpresa
    });
    
    const { data, error } = await supabase.rpc("buscarpersonal", {
      buscador: buscador,
      _id_empresa: idEmpresa
    });

    if (error) {
      console.error("❌ Error en RPC buscarpersonal:", error);
      throw error;
    }

    console.log("✅ Resultados de búsqueda:", data?.length || 0);
    return data || [];

  } catch (error) {
    console.error("❌ Error en BuscarUsuarios:", error);
    throw error;
  }
};

// ✅ NUEVA FUNCIÓN: Eliminar usuario
export const EliminarUsuario = async (p) => {
  try {
    console.log("🟡 EliminarUsuario - Parámetros:", p);
    
    const { error } = await supabase
      .from("usuarios")
      .delete()
      .eq("id", p.id);

    if (error) {
      console.error("❌ Error eliminando usuario:", error);
      throw error;
    }

    console.log("✅ Usuario eliminado correctamente");
    return { success: true };

  } catch (error) {
    console.error("❌ Error en EliminarUsuario:", error);
    throw error;
  }
};

// ✅ NUEVA FUNCIÓN: Eliminar asignación de usuario
export const EliminarAsignacionUsuario = async (p) => {
  try {
    console.log("🟡 EliminarAsignacionUsuario - Parámetros:", p);
    
    const { error } = await supabase
      .from("asignarempresa")
      .delete()
      .eq("id_usuario", p.id_usuario);

    if (error) {
      console.error("❌ Error eliminando asignación:", error);
      throw error;
    }

    console.log("✅ Asignación eliminada correctamente");
    return { success: true };

  } catch (error) {
    console.error("❌ Error en EliminarAsignacionUsuario:", error);
    throw error;
  }
};

// ✅ FUNCIÓN PRIVADA: Consulta directa como fallback
const consultaDirectaUsuarios = async (idEmpresa) => {
  try {
    console.log("🔄 Ejecutando consulta directa para empresa:", idEmpresa);
    
    const { data, error } = await supabase
      .from('asignarempresa')
      .select(`
        id,
        usuarios!inner(
          id,
          nombres,
          tipouser,
          estado,
          correo,
          nro_doc,
          telefono,
          direccion,
          tipodoc
        )
      `)
      .eq('id_empresa', idEmpresa);

    if (error) {
      console.error("❌ Error en consulta directa:", error);
      throw error;
    }

    const usuarios = data?.map(item => item.usuarios).filter(Boolean) || [];
    console.log("✅ Usuarios encontrados via consulta directa:", usuarios.length);
    
    return usuarios;
    
  } catch (error) {
    console.error("❌ Error en consultaDirectaUsuarios:", error);
    return [];
  }
};

export async function EditarTemaMonedaUser(p) {
  try {
    console.log("🟡 EditarTemaMonedaUser - Parametros:", p);
    
    const { data, error } = await supabase.from("usuarios").update(p).eq("id", p.id).select();

    if (error) {
      console.error("❌ Error editando tema/moneda:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al editar configuración: " + error.message,
      });
      throw error;
    }

    if (data) {
      Swal.fire({
        icon: "success",
        title: "Datos modificados",
        showConfirmButton: false,
        timer: 1500,
      });
      console.log("✅ Configuración actualizada:", data);
      return data;
    }

  } catch (error) {
    console.error("❌ Error en EditarTemaMonedaUser:", error);
    throw error;
  }
}

export async function Editarusuarios(p) {
  try {
    console.log("🟡 Editarusuarios - Parametros:", p);
    
    const { data, error } = await supabase
      .from("usuarios")
      .update(p)
      .eq("id", p.id)
      .select();

    console.log("🟡 Editarusuarios - Respuesta:", { data, error });

    if (error) {
      console.error("❌ Error editando usuario:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al editar usuario: " + error.message,
      });
      throw error;
    }

    if (data) {
      Swal.fire({
        icon: "success",
        title: "Datos modificados",
        showConfirmButton: false,
        timer: 1500,
      });
      console.log("✅ Usuario actualizado:", data);
      return data;
    }

  } catch (error) {
    console.error("❌ Error en Editarusuarios:", error);
    throw error;
  }
}

export const verificarEstructuraTabla = async () => {
  try {
    console.log("🔍 Verificando estructura de tabla usuarios...");
    
    const { data, error } = await supabase
      .from("usuarios")
      .select("id, idauth, correo, fecharegistro, tipouser, estado")
      .limit(1);

    if (error) {
      console.error("❌ Error verificando estructura:", error);
      return false;
    }

    console.log("✅ Estructura de tabla verificada");
    return true;
    
  } catch (error) {
    console.error("❌ Error en verificarEstructuraTabla:", error);
    return false;
  }
};

// ✅ FUNCIÓN AUXILIAR: Obtener información completa del usuario autenticado
export const obtenerUsuarioCompleto = async () => {
  try {
    const idAuth = await ObtenerIdAuthSupabase();
    
    if (!idAuth) {
      return null;
    }

    // Obtener usuario con su empresa
    const { data, error } = await supabase
      .from("usuarios")
      .select(`
        *,
        asignarempresa!inner(
          id_empresa,
          empresa!inner(*)
        )
      `)
      .eq("idauth", idAuth)
      .single();

    if (error) {
      console.error("❌ Error obteniendo usuario completo:", error);
      return null;
    }

    return data;
    
  } catch (error) {
    console.error("❌ Error en obtenerUsuarioCompleto:", error);
    return null;
  }
};