import { create } from "zustand";
import {
  MostrarModulosTodos,
} from "../index";

// Creación del store global usando Zustand
export const useGlobalStore = create((set, get) => ({
  // Array que almacena los módulos que están marcados/seleccionados (checked)
  datamoduloscheck:[],
  
  // Función para actualizar los módulos seleccionados
  setdatamodulosCheck:(p)=>{
        set({datamoduloscheck:p})
  },
  
  // Array que almacena todos los módulos disponibles
  datamodulos: [],
  
  // Función asíncrona para mostrar/obtener todos los módulos
  mostrarModulos: async () => {
    // Llama a la función que obtiene todos los módulos desde la API/BD
    const response = await MostrarModulosTodos();
    set({ datamodulos: response });
    return response;
  },
  
}));