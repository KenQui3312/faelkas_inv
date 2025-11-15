import { supabase } from "../index";
import Swal from "sweetalert2";
// Nombre de la tabla en la base de datos
const tabla = "productos";
// Función para insertar nuevos productos
export async function InsertarProductos(p) {
  try {
    // Llamar a la función RPC de Supabase para insertar productos
    const { error } = await supabase.rpc("insertarproductos", p);
    // Si hay error, mostrar alerta con SweetAlert2
    if (error) {
      console.log("parametros", p);
      console.log("parametros", error.message);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message,
        footer: '<a href="">Agregue una nueva descripcion</a>',
      });
    }
  } catch (error) {
    throw error
  }
}
// Función para obtener todos los productos de una empresa
export async function MostrarProductos(p) {
  try {
    // Llamar a la función RPC de Supabase para mostrar productos
    const { data } = await supabase.rpc("mostrarproductos", {
      _id_empresa: p._id_empresa,
    });
    return data;
  } catch (error) {}
}
// Función para eliminar un producto específico por ID
export async function EliminarProductos(p) {
  try {
    // Eliminar producto donde el ID coincida
    const { error } = await supabase.from("productos").delete().eq("id", p.id);
    // Si hay error, mostrar alerta
    if (error) {
      alert("Error al eliminar", error);
    }
  } catch (error) {
    // Manejar error mostrando mensaje específico
    alert(error.error_description || error.message + " eliminar productos");
  }
}
// Función para editar un producto existente
export async function EditarProductos(p) {
  try {
    // Actualizar producto donde el ID coincida
    const { error } = await supabase.from("productos").update(p).eq("id", p.id);
    // Si hay error, mostrar alerta
    if (error) {
      alert("Error al editar producto", error);
    }
  } catch (error) {
    // Manejar error mostrando mensaje específico
    alert(error.error_description || error.message + " editar categorias");
  }
}
// Función para buscar productos por descripción
export async function BuscarProductos(p) {
  try {
    // Llamar a la función RPC de Supabase para buscar productos
    const { data } = await supabase.rpc("buscarproductos", {
      _id_empresa: p.id_empresa,
      buscador: p.descripcion,
    });
    return data;
  } catch (error) {}
}
//REPORTES
// Reporte: Obtener todos los productos de una empresa
export async function ReportStockProductosTodos(p) {
  const { data, error } = await supabase
    .from(tabla)
    .select()
    .eq("id_empresa", p.id_empresa);
  if (error) {
    return;
  }
  return data;
}
// Reporte: Obtener un producto específico por ID
export async function ReportStockXProducto(p) {
  const { data, error } = await supabase
    .from(tabla)
    .select()
    .eq("id_empresa", p.id_empresa)
    .eq("id",p.id);
  if (error) {
    return;
  }
  return data;
}
// Reporte: Obtener productos bajo el stock mínimo
export async function ReportStockBajoMinimo(p) {
  try {
    console.log("🔍 Ejecutando reporte GLOBAL (ignorando filtro de empresa)");
    
    const { data, error } = await supabase.rpc("reportproductosbajominimo");
    
    if (error) {
      console.error("Error en reporte productos bajo mínimo:", error);
      return;
    }
    
    console.log("📊 TODOS los productos bajo mínimo:", data);
    return data; // ← Siempre retorna TODOS, ignora el filtro
  } catch (error) {
    console.error("Error general en ReportStockBajoMinimo:", error);
    return [];
  }
}
// Reporte: Obtener movimientos de kardex (entradas y salidas)
export async function ReportKardexEntradaSalida(p) {
  const { data, error } = await supabase.rpc("mostrarkardexempresa",p)
  if (error) {
    return;
  }
  return data;
}
// Reporte: Obtener inventario valorado (con valores monetarios)
export async function ReportInventarioValorado(p) {
  const { data, error } = await supabase.rpc("inventariovalorado",p)
  
  if (error) {
   
    return;
  }
  return data;
}