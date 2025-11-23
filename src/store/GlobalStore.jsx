import { create } from "zustand";
import {
  MostrarModulosTodos,
} from "../index";

// Store global para gestion de modulos del sistema
export const useGlobalStore = create((set, get) => ({
  datamoduloscheck:[],
  setdatamodulosCheck:(p)=>{
        set({datamoduloscheck:p})
  },
  datamodulos: [],

   // Obtener todos los modulos disponibles
  mostrarModulos: async () => {
    const response = await MostrarModulosTodos();
    set({ datamodulos: response });
    return response;
  },
  
}));
