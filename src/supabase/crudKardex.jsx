import { supabase } from "./supabase.config";
import Swal from "sweetalert2";
// Función para insertar un nuevo registro en el kardex
export async function InsertarKardex(p) {
  // Insertar datos en la tabla kardex
  const { error } = await supabase.from("kardex").insert(p);
  // Si hay error, mostrar alerta con SweetAlert2
  if (error) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: error.message,
      footer: '<a href="">...</a>',
    });
  }
}
// Función para obtener todos los registros del kardex de una empresa
export async function MostrarKardex(p) {
  // Llamar a la función RPC de Supabase para mostrar kardex
  const { data } = await supabase
    .rpc("mostrarkardexempresa", {
      _id_empresa: p.id_empresa,
    })
    .order("id", { ascending: false });// Ordenar por ID descendente (más recientes primero)
  return data;
}
// Función para buscar registros específicos en el kardex
export async function BuscarKardex(p) {
  // Llamar a la función RPC de Supabase para buscar en el kardex
  const { data } = await supabase
    .rpc("buscarkardexempresa", {
      _id_empresa: p.id_empresa,
      buscador: p.buscador,
    })
    .order("id", { ascending: false });// Ordenar por ID descendente (más recientes primero)
  return data;
}
