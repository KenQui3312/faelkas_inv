import { create } from "zustand";
import { BuscarKardex, InsertarKardex, MostrarKardex } from "../index";

// Store para gestion de kardex (control de inventario)
export const useKardexStore = create((set, get) => ({
  buscador: "",
  // Actualizar valor del buscador
  setBuscador: (p) => {
    set({ buscador: p });
  },
  datakardex: [],
  kardexItemSelect: [],
  parametros: {},

  // Insertar nuevo registro de kardex y refrescar lista
  insertarKardex: async (p) => {
    await InsertarKardex(p);
    const { mostrarKardex } = get();
    const { parametros } = get();
    set(mostrarKardex(parametros));
  },
  // Obtener registros de kardex segun parametros
  mostrarKardex: async (p) => {
    const response = await MostrarKardex(p);
    set({ parametros: p });
    set({ datakardex: response });
    return response;
  },
  // Buscar registros de kardex por termino
  buscarKardex: async (p) => {
    const response = await BuscarKardex(p);
    set({ datakardex: response });
    return response;
  },
}));