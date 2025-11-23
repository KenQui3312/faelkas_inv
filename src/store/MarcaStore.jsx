import { create } from "zustand";
import {
  BuscarMarca,
  EditarMarca,
  EliminarMarca,
  InsertarMarca,
  MostrarMarca,
} from "../index";
export const useMarcaStore = create((set, get) => ({
  buscador: "",
  // Actualizar valor del buscador
  setBuscador: (p) => {
    set({ buscador: p });
  },
  datamarca: [],
  marcaItemSelect: [],
  parametros: {},
  // Obtener todas las marcas por empresa
  mostrarMarca: async (p) => {
    // Si no hay parámetros, mostrar todas las marcas
    const params = p?.id_empresa ? { id_empresa: p.id_empresa } : {};
    const response = await MostrarMarca(params);
    set({ datamarca: response });
    return response;
  },
  // Seleccionar una marca
  selectMarca: (p) => {
    set({ marcaItemSelect: p });
  },
  // Insertar nueva marca y refrescar lista
  insertarMarca: async (p) => {
    await InsertarMarca(p);
    const { mostrarMarca } = get();
    const { parametros } = get();
    set(mostrarMarca(parametros));
  },
  // Eliminar marca y refrescar lista
  eliminarMarca: async (p) => {
    await EliminarMarca(p);
    const { mostrarMarca } = get();
    const { parametros } = get();
    console.log("parametros", parametros);
    set(mostrarMarca(parametros));
  },

  // Editar marca y refrescar lista
  editarMarca: async (p) => {
    await EditarMarca(p);
    const { mostrarMarca } = get();
    const { parametros } = get();
    console.log("parametros", parametros);
    set(mostrarMarca(parametros));
  },
  // Buscar marcas por termino
  buscarMarca: async (p) => {
    const response = await BuscarMarca(p);
    set({ datamarca: response });
  },
}));