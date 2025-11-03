import Swal from "sweetalert2";
import { supabase } from "../index"

export const InsertarUsuarios= async(p)=>{
    const {data, error}= await supabase.from("usuarios").insert(p).select().maybeSingle();
    if(error){
        Swal.fire({
            icon:"error",
            tittle: "Oops...",
            text:"Error al insertar usuarios!" + error.message
        });
    }
    if(data) return data;
}