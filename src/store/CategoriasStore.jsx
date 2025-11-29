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
    try {
      console.log("🟡 MostrarCategorias - Iniciando...", p);
      
      // Guardar parámetros para usar después
      if (p) {
        set({ parametros: p });
      }
      
      // CORREGIDO: usar id_empresa en lugar de idempresa
      const params = p?.id_empresa ? { id_empresa: p.id_empresa } : {};
      const response = await MostrarCategorias(params);
      
      console.log("✅ MostrarCategorias - Respuesta:", response);
      set({ datacategorias: response });
      
      return response;
    } catch (error) {
      console.error("❌ Error en mostrarCategorias:", error);
      set({ datacategorias: [] });
      return [];
    }
  },
  // Seleccionar una categoria
  selectCategoria: (p) => {
    set({ categoriaItemSelect: p });
  },
  // Insertar nueva categoria y refrescar lista
  insertarCategorias: async (p) => {
    try {
      console.log("🟡 InsertarCategorias - Datos:", p);
      await InsertarCategorias(p);
      
      // Recargar las categorías usando los parámetros guardados
      const { parametros } = get();
      console.log("🔄 Recargando categorías con parámetros:", parametros);
      await get().mostrarCategorias(parametros);
    } catch (error) {
      console.error("❌ Error en insertarCategorias:", error);
      throw error;
    }
  },
  // Eliminar categoria y refrescar lista
  eliminarCategoria: async (p) => {
    try {
      console.log("🟡 EliminarCategoria - ID:", p.id);
      await EliminarCategorias(p);
      
      // Recargar las categorías usando los parámetros guardados
      const { parametros } = get();
      console.log("🔄 Recargando categorías con parámetros:", parametros);
      await get().mostrarCategorias(parametros);
    } catch (error) {
      console.error("❌ Error en eliminarCategoria:", error);
      throw error;
    }
  },
  // Eliminar todas las categorias y refrescar lista
  eliminarCategoriasTodas: async (p) => {
    await EliminarCategoriasTodas(p);
    const { mostrarCategorias } = get();
    set(mostrarCategorias(p));
  },
  // Editar categoria y refrescar lista
  editarCategoria: async (p) => {
    try {
      console.log("🟡 EditarCategoria - Datos:", p);
      await EditarCategorias(p);
      
      // Recargar las categorías usando los parámetros guardados
      const { parametros } = get();
      console.log("🔄 Recargando categorías con parámetros:", parametros);
      await get().mostrarCategorias(parametros);
    } catch (error) {
      console.error("❌ Error en editarCategoria:", error);
      throw error;
    }
  },
  // Buscar categorias por termino
  buscarCategorias: async (p) => {
    try {
      console.log("🟡 BuscarCategorias - Término:", p);
      const response = await BuscarCategorias(p);
      console.log("✅ BuscarCategorias - Resultados:", response?.length);
      set({ datacategorias: response });
    } catch (error) {
      console.error("❌ Error en buscarCategorias:", error);
      set({ datacategorias: [] });
    }
  },
}));