import { create } from "zustand";
import { supabase } from "../index"

export const useAuthStore=create((set,get)=>({
    signInWithEmail: async(p)=>{
        const {data,error} = await supabase.auth.signInWithPassword({
            email: p.correo,
            password: p.pass
        })
        if(error){
            return null;
        }
        if (data) return data;
    },
    signOut: async ()=>{
        const {error} = await supabase.auth.signOut()
        if(error)
            throw new Error("A ocurrido un error durante el cierre de sesion"+error)
    }
}))