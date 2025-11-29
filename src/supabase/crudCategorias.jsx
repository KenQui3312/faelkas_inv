import { supabase } from "../index";
import Swal from "sweetalert2";

export async function InsertarCategorias(p) {
  try {
     const { error } = await supabase.rpc("insertarcategorias", p);
     if (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Ya existe un registro con " + p._descripcion,
        footer: '<a href="">Agregue una nueva descripcion</a>',
      });
    }
  } catch (error) {
    console.error("❌ Error en InsertarCategorias:", error);
  }
}

export async function MostrarCategorias(p = {}) {
  try {
    console.log('🔍 Mostrando categorías con parámetros:', p);
    
    let query = supabase
      .from('categorias')
      .select('*');
    
    // ✅ Filtrar por empresa si se proporciona
    if (p.id_empresa) {
      query = query.eq('id_empresa', p.id_empresa);
      console.log(`🏢 Filtrando categorías por empresa: ${p.id_empresa}`);
    }
    
    query = query.order('descripcion');
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    console.log('✅ Categorías encontradas:', data?.length || 0);
    return data || [];
  } catch (error) {
    console.error('❌ Error en MostrarCategorias:', error);
    return [];
  }
}

export async function EliminarCategorias(p) {
  try {
    const { error } = await supabase
      .from("categorias")
      .delete()
      .eq("id", p.id);
    if (error) {
      alert("Error al eliminar", error);
    }
  } catch (error) {
    alert(error.error_description || error.message + " eliminar categorias");
  }
}

export async function EditarCategorias(p) {
  try {
    const { error } = await supabase
      .from("categorias")
      .update(p)
      .eq("id", p.id);
    if (error) {
      alert("Error al editar categoria", error);
    }
  } catch (error) {
    alert(error.error_description || error.message + " editar categorias");
  }
}

export async function EliminarCategoriasTodas(p) {
  try {
    const { error } = await supabase
      .from("categorias")
      .delete()
      .eq("idusuario", p.idusuario);
    if (error) {
      alert("Error al eliminar", error);
    }
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Datos reseteados",
      showConfirmButton: false,
      timer: 1000,
    });
  } catch (error) {
    alert(error.error_description || error.message + " eliminar categorias");
  }
}

export async function BuscarCategorias(p) {
  try {
    const { data } = await supabase
      .from("categorias")
      .select()
      .eq("id_empresa", p.id_empresa)
      .ilike("descripcion","%"+ p.descripcion+"%")
      
    return data;
  } catch (error) {
    console.error("❌ Error en BuscarCategorias:", error);
    return [];
  }
}