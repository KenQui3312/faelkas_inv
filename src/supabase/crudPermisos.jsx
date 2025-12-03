import { supabase } from "../index";
import Swal from "sweetalert2";

// Inserta permisos en la tabla
export async function InsertarPermisos(p) {

  const { data, error } = await supabase
    .from("permisos")
    .insert(p)
    .select(); 

  if (error) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Error al insertar permisos " + error.message,
      footer: '<a href="">error</a>',
    });
  }
}

// Obtiene los permisos de un usuario
export async function MostrarPermisos(p) {

  const { data } = await supabase
    .from("permisos")
    .select(`id, id_usuario, idmodulo, modulos(nombre)`) // incluye relación con modulos
    .eq("id_usuario", p.id_usuario);

  return data;
}

// Elimina permisos por usuario
export async function EliminarPermisos(p) {

  const { error } = await supabase
    .from("permisos")
    .delete()
    .eq("id_usuario", p.id_usuario);

  if (error) {
    alert("Error al eliminar", error);
  }
}
