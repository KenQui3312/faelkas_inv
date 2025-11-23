import Swal from "sweetalert2";
import { supabase } from "../index";

export const MostrarEmpresa = async (p) => {
  const { data } = await supabase.rpc("mostrarempresaasignaciones", {
    _id_usuario: p.idusuario,
  }).maybeSingle();
  if (data) {
    return data;
  }
};/*
export const ContarUsuariosXempresa = async (p) => {
  const { data,error } = await supabase.rpc("contar_usuarios_por_empresa", {
    _id_empresa: p.id_empresa,
  }).maybeSingle();
 
  if (data) {
    return data;
  }
};*/
// En crudEmpresa.jsx - VERSIÓN CORREGIDA
export const ContarUsuariosXempresa = async (p) => {
  try {
    console.log("🔢 Contando usuarios para empresa:", p.id_empresa);
    
    if (!p.id_empresa) {
      console.warn("⚠️ No se proporcionó id_empresa");
      return 0;
    }
    
    const { data, error } = await supabase.rpc('contar_usuarios_por_empresa', {
      _id_empresa: p.id_empresa
    });

    if (error) {
      console.error("❌ Error en RPC contar_usuarios_por_empresa:", error);
      return 0; // ✅ Retornar 0 en caso de error
    }

    console.log("✅ Cantidad de usuarios:", data);
    return data || 0; // ✅ Asegurar que nunca sea undefined

  } catch (error) {
    console.error("❌ Error en ContarUsuariosXempresa:", error);
    return 0; // ✅ Retornar 0 en caso de error
  }
};