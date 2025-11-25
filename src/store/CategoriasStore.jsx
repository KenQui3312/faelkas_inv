import { create } from "zustand";
import {
  BuscarCategorias,
  EditarCategorias,
  EliminarCategorias,
  EliminarCategoriasTodas,
  InsertarCategorias,
  MostrarCategorias,
} from "../index";

// Store para gestion de categorias
export const useCategoriasStore = create((set, get) => ({
  buscador: "",
  // Actualizar valor del buscador
  setBuscador: (p) => {
    set({ buscador: p });
  },
  datacategorias: [],
  categoriaItemSelect: [],
  parametros: {},
  // Obtener todas las categorias por empresa
  mostrarCategorias: async (p) => {
    const params = p?.idempresa ? { id_empresa: p.idempresa } : {};
    const response = await MostrarCategorias(params);
    set({ datacategorias: response });
    return response;
  },
  // Seleccionar una categoria
  selectCategoria: (p) => {
    set({ categoriaItemSelect: p });
  },
  // Insertar nueva categoria y refrescar lista
  insertarCategorias: async (p) => {
    await InsertarCategorias(p);
    const { mostrarCategorias } = get();
    const { parametros } = get();
    set(mostrarCategorias(parametros));
  },
  // Eliminar categoria y refrescar lista
  eliminarCategoria: async (p) => {
    await EliminarCategorias(p);
    const { mostrarCategorias } = get();
    const { parametros } = get();
    console.log("parametros", parametros);
    set(mostrarCategorias(parametros));
  },
  // Eliminar todas las categorias y refrescar lista
  eliminarCategoriasTodas: async (p) => {
    await EliminarCategoriasTodas(p);
    const { mostrarCategorias } = get();
    set(mostrarCategorias(p));
  },
  // Editar categoria y refrescar lista
  editarCategoria: async (p) => {
    await EditarCategorias(p);
    const { mostrarCategorias } = get();
    const { parametros } = get();
    console.log("parametros", parametros);
    set(mostrarCategorias(parametros));
  },
  // Buscar categorias por termino
  buscarCategorias: async (p) => {
    const response = await BuscarCategorias(p);
    set({ datacategorias: response });
  },
}));