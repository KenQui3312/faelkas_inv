import { create } from "zustand";
// Importación de la función para obtener cuentas desde el archivo index
import { MostrarCuentas } from "../index";

export const useCuentaStore = create((set, get) => ({
  cuentaItemSelect: [],
  
  datacuentas: [],
  
  // Función asíncrona para mostrar/obtener cuentas
  mostrarCuentas: async (p) => {
    // Llama a la función que obtiene las cuentas desde la API/BD
    const response = await MostrarCuentas(p);
    // Actualiza el array de cuentas con la respuesta
    set({ datacuentas: response });
    // Asigna todas las cuentas como seleccionadas
    set({ cuentaItemSelect: response });
    return response;
  },
}));