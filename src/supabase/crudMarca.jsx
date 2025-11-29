import { supabase } from "../index";
import Swal from "sweetalert2";

export async function InsertarMarca(p) {
  const { error } = await supabase.rpc("insertarmarca", p);
  if (error) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Ya existe un registro con " + p._descripcion,
      footer: '<a href="">Agregue una nueva descripcion</a>',
    });
  }
}
/*
export async function MostrarMarca(p = {}) {
  try {
    console.log('🔍 Mostrando TODAS las marcas...');
    
    const { data, error } = await supabase
      .from('marca')
      .select('*')
      .order('descripcion');
    
    if (error) throw error;
    return data || []; // ✅ Siempre retorna array
  } catch (error) {
    console.error('Error:', error);
    return []; // ✅ Siempre retorna array
  }
}
*/

// En crudMarca.jsx - función MostrarMarca
export async function MostrarMarca(p = {}) {
  try {
    console.log('🔍 Mostrando marcas con parámetros:', p);
    
    let query = supabase
      .from('marca')
      .select('*');
    
    // ✅ Filtrar por empresa si se proporciona
    if (p.id_empresa) {
      query = query.eq('id_empresa', p.id_empresa);
      console.log(`🏢 Filtrando por empresa: ${p.id_empresa}`);
    }
    
    query = query.order('descripcion');
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    console.log('✅ Marcas encontradas:', data?.length || 0);
    return data || [];
  } catch (error) {
    console.error('❌ Error en MostrarMarca:', error);
    return [];
  }
}

export async function EliminarMarca(p) {
  const { error } = await supabase
    .from("marca")
    .delete()
    .eq("id", p.id);
  if (error) {
    alert("Error al eliminar", error);
  }
}

export async function EditarMarca(p) {
  const { error } = await supabase
    .from("marca")
    .update(p)
    .eq("id", p.id);
  if (error) {
    alert("Error al editar marca", error);
  }
}

export async function EliminarMarcaTodas(p) {
  const { error } = await supabase
    .from("marca")
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
}

export async function BuscarMarca(p) {
  try {
    console.log('🔍 Buscando marcas con parámetros:', p);
    
    let query = supabase
      .from("marca")
      .select("*");
    
    // ✅ Aplicar filtros condicionalmente
    if (p.id_empresa) {
      query = query.eq("id_empresa", p.id_empresa);
    }
    
    if (p.descripcion) {
      query = query.ilike("descripcion", `%${p.descripcion}%`);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('❌ Error buscando marcas:', error);
      throw error;
    }
    
    console.log('✅ Marcas encontradas:', data?.length || 0);
    return data || []; // ✅ SIEMPRE retorna array, nunca undefined
    
  } catch (error) {
    console.error('❌ Error en BuscarMarca:', error);
    return []; // ✅ SIEMPRE retorna array, incluso en error
  }
}

// ✅ FUNCIÓN ADICIONAL: Para búsqueda global (sin empresa)
export async function BuscarMarcas(p) {
  try {
    console.log('🔍 Buscando TODAS las marcas...');
    
    const { descripcion = '' } = p;
    
    const { data, error } = await supabase
      .from("marca")
      .select("*")
      .ilike("descripcion", `%${descripcion}%`)
      .order('descripcion');
    
    if (error) throw error;
    
    console.log('✅ Marcas encontradas (global):', data?.length || 0);
    return data || []; // ✅ Siempre retorna array
    
  } catch (error) {
    console.error('❌ Error en BuscarMarcas:', error);
    return []; // ✅ Siempre retorna array
  }
}