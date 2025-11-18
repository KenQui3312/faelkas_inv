import { supabase } from "./supabase.config";
import Swal from "sweetalert2";
// Función para insertar nuevos movimientos en el kardex
export const InsertarMovimientos = async (p) => {
  try {
    // Insertar movimiento y retornar los datos insertados
    const { data, error } = await supabase
      .from("kardex")
      .insert(p)
      .select();
      // Si hay error, mostrar alerta de error
    if (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Ya existe un registro con " + p.descripcion,
        footer: '<a href="">Agregue una nueva descripcion</a>',
      });
    }
    // Si la inserción fue exitosa, mostrar confirmación
    if (data) {
      Swal.fire({
        icon: "success",
        title: "Registrado",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  } catch (error) {
     // Manejar errores generales
    alert(error.error_description || error.message + " insertar movimientos");
  }
};
// Función para eliminar movimientos del kardex
export async function EliminarMovimientos(p) {
  try {
    // Eliminar movimiento por ID
    const { error } = await supabase
      .from("kardex")
      .delete()
      .eq("id", p.id);
    // Si hay error, mostrar alerta
    if (error) {
      alert("Error al eliminar", error);
    }
  } catch (error) {
    // Manejar errores generales
    alert(error.error_description || error.message + " eliminar movimientos");
  }
}
// Función para mostrar movimientos filtrados por mes y año
export async function MostrarMovimientosPorMesAño(p) {
  try {
    // Llamar a función RPC para obtener movimientos por mes y año
    const { data } = await supabase.rpc("mmovimientosmesanio", {
      anio: p.año,
      mes: p.mes,
      iduser: p.idusuario,
      tipocategoria: p.tipocategoria,
    });
    return data;
  } catch (error) {}
}
// Función para generar reporte de movimientos por mes y año
export async function RptMovimientosPorMesAño(p) {
  try {
    // Llamar a función RPC para generar reporte de movimientos
    const { data } = await supabase.rpc("rptmovimientos_anio_mes", {
      anio: p.año,
      mes: p.mes,
      iduser: p.idusuario,
      tipocategoria: p.tipocategoria,
    });
    return data;
  } catch (error) {}
}
