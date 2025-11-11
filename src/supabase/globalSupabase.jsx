import { supabase } from "../index";

export const ObtenerIdAuthSupabase = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    console.log("🔐 ObtenerIdAuthSupabase - Sesión:", session);
    
    if (session && session.user) {
      const idAuthSupabase = session.user.id;
      console.log("🔐 ID Auth obtenido:", idAuthSupabase);
      return idAuthSupabase;
    }
    
    console.log("🔐 No hay sesión activa");
    return null; // ✅ IMPORTANTE: Retornar null en lugar de undefined
    
  } catch (error) {
    console.error("❌ Error en ObtenerIdAuthSupabase:", error);
    return null;
  }
};

export const ObtenerUsuarioCompleto = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    console.log("🔐 Usuario completo:", user);
    return user;
  } catch (error) {
    console.error("❌ Error obteniendo usuario:", error);
    return null;
  }
};

export const MostrarModulosTodos = async (p) => {
  try {
    const { error, data } = await supabase
      .from("modulos")
      .select();
    
    if (error) {
      console.error("❌ Error mostrando módulos:", error);
      throw error;
    }
    
    if (data) {
      return data;
    }
    
    return [];
    
  } catch (error) {
    console.error("❌ Error en MostrarModulosTodos:", error);
    throw error;
  }
};