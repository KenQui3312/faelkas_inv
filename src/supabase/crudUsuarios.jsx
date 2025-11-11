import Swal from "sweetalert2";
import { ObtenerIdAuthSupabase, supabase, usePermisosStore } from "../index";

export const InsertarUsuarios = async (p) => {
  try {
    console.log("🟡 InsertarUsuarios - Usando RPC seguro");
    console.log("🟡 Datos para RPC:", p);
    
    const { data, error } = await supabase.rpc('insertar_usuario_seguro', {
      p_idauth: p.idauth,
      p_correo: p.correo,
      p_fecharegistro: p.fecharegistro,
      p_tipouser: p.tipouser,
      p_estado: p.estado || 'activo'
    });

    console.log("🟡 Respuesta RPC:", { data, error });

    if (error) {
      console.error("❌ Error en RPC insertar_usuario_seguro:", {
        code: error.code,
        message: error.message,
        details: error.details
      });
      throw error;
    }

    if (data) {
      console.log("✅ Usuario insertado via RPC:", data);
      return data;
    }

    throw new Error('No se recibió data del RPC');

  } catch (error) {
    console.error("❌ Error en InsertarUsuarios (RPC):", error);
    throw error;
  }
};


export const InsertarAsignaciones = async (p) => {
  try {
    console.log("🟡 InsertarAsignaciones - Parametros:", p);
    
    const { data, error } = await supabase.from("asignarempresa").insert([p]).select(); // ✅ Agregado select()

    if (error) {
      console.error("❌ Error insertando asignación:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Error al insertar asignación: " + error.message,
      });
      throw error; // ✅ CORREGIDO: Lanzar el error
    }

    console.log("✅ Asignación insertada correctamente:", data);
    return data;

  } catch (error) {
    console.error("❌ Error en InsertarAsignaciones:", error);
    throw error; // ✅ CORREGIDO: Propagar el error
  }
};

export const MostrarUsuarios = async () => {
  try {
    const idAuthSupabase = await ObtenerIdAuthSupabase();
    console.log("🟡 MostrarUsuarios - ID Auth:", idAuthSupabase);
    
    // ✅ Manejar explícitamente el caso de no autenticación
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
      // ✅ Manejar específicamente el error 406 (Not Acceptable)
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

export const MostrarUsuariosTodos = async (p) => {
  try {
    console.log("🟡 MostrarUsuariosTodos - Parametros:", p);
    
    const { error, data } = await supabase.rpc("mostrarpersonal", {
      _id_empresa: p._id_empresa,
    });

    if (error) {
      console.error("❌ Error en RPC mostrarpersonal:", error);
      throw error; // ✅ CORREGIDO: Lanzar el error
    }

    if (data) {
      console.log("✅ Usuarios encontrados:", data.length);
      return data;
    }

    return [];

  } catch (error) {
    console.error("❌ Error en MostrarUsuariosTodos:", error);
    throw error; // ✅ CORREGIDO: Propagar el error
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
      throw error; // ✅ CORREGIDO: Lanzar el error
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
    throw error; // ✅ CORREGIDO: Propagar el error
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
      throw error; // ✅ CORREGIDO: Lanzar el error
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
    throw error; // ✅ CORREGIDO: Propagar el error
  }
}

// ✅ FUNCIÓN ADICIONAL: Verificar estructura de tabla
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