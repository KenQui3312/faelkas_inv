import { supabase } from "../index";
import Swal from "sweetalert2";

// Inserta categoria usando la funcion RPC de Supabase
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

// Obtiene categorias, con filtro opcional por empresa
export async function MostrarCategorias(p = {}) {
  try {
    let query = supabase.from('categorias').select('*');

    if (p.id_empresa) {
      query = query.eq('id_empresa', p.id_empresa); 
    }

    query = query.order('descripcion'); 

    const { data, error } = await query;
    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('❌ Error en MostrarCategorias:', error);
    return [];
  }
}

// Elimina una categoria por ID
export async function EliminarCategorias(p) {
  try {
    const { error } = await supabase
      .from("categorias")
      .delete()
      .eq("id", p.id); 

    if (error) alert("Error al eliminar", error);
  } catch (error) {
    alert(error.error_description || error.message + " eliminar categorias");
  }
}

// Edita una categoria por ID
export async function EditarCategorias(p) {
  try {
    const { error } = await supabase
      .from("categorias")
      .update(p)
      .eq("id", p.id); 

    if (error) alert("Error al editar categoria", error);
  } catch (error) {
    alert(error.error_description || error.message + " editar categorias");
  }
}

// Elimina todas las categorias de un usuario
export async function EliminarCategoriasTodas(p) {
  try {
    const { error } = await supabase
      .from("categorias")
      .delete()
      .eq("idusuario", p.idusuario); 

    if (error) alert("Error al eliminar", error);

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

// Busca categorias por empresa y coincidencia en descripcion
export async function BuscarCategorias(p) {
  try {
    const { data } = await supabase
      .from("categorias")
      .select()
      .eq("id_empresa", p.id_empresa)
      .ilike("descripcion", "%" + p.descripcion + "%"); 

    return data;
  } catch (error) {
    console.error("❌ Error en BuscarCategorias:", error);
    return [];
  }
}
