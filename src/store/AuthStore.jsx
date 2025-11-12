import { useState } from "react";
import { create } from "zustand"; // Librería para manejo de estado global
import { supabase } from "../index"; // Cliente de Supabase para operaciones de backend
import { Navigate } from "react-router-dom";

// Creación del store de autenticación usando Zustand
export const useAuthStore = create((set) => ({
  // Estado que indica si el usuario está autenticado
  isAuth: false,
  
  // Array que almacena los datos del usuario autenticado
  datauserAuth: [],
  
  // Función asíncrona para iniciar sesión con email y contraseña
  signInWithEmail: async (p) => {
    // Llamada a Supabase para autenticar con email y password
    const { data, error } = await supabase.auth.signInWithPassword({
      email: p.correo, // Email del usuario desde el parámetro
      password: p.pass, // Contraseña del usuario desde el parámetro
    })
    
    if (error){
      return null;
    }
    
    return data.user;
  },

  
  // Función asíncrona para cerrar sesión
  signout: async () => {
    // Llamada a Supabase para cerrar la sesión del usuario
    const { error } = await supabase.auth.signOut()
    
    // Actualiza el estado para indicar que el usuario no está autenticado
    set({ isAuth: false });
    
    if (error)
      throw new Error("A ocurrido un error durante el cierre de sesión"+error);
  },

}));