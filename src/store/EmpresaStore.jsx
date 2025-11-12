import { create } from "zustand";
// Importación de la función para mostrar cuentas desde el archivo index
import { MostrarCuentas } from "../index";
// Importación de funciones específicas para operaciones de empresa desde crudEmpresa
import {
  ContarUsuariosXempresa,
  MostrarEmpresa,
} from "../supabase/crudEmpresa";

// Creación del store de empresa usando Zustand
export const useEmpresaStore = create((set, get) => ({
  // Array que almacena el contador de usuarios por empresa
  contadorusuarios: [],
  
  // Array que almacena los datos de la empresa
  dataempresa: [],
  
  // Función asíncrona para mostrar/obtener datos de la empresa
  mostrarEmpresa: async (p) => {
    // Llama a la función que obtiene los datos de la empresa desde la API/BD
    const response = await MostrarEmpresa(p);
    set({ dataempresa: response });
    return response;
  },
  
  // Función asíncrona para contar usuarios por empresa
  contarusuariosXempresa: async (p) => {
    // Llama a la función que cuenta los usuarios de una empresa específica
    const response = await ContarUsuariosXempresa(p);
    set({ contadorusuarios: response });
    return response;
  },
}));