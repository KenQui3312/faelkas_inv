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
  datamarca: [],
  marcaItemSelect: [],
  parametros: {},
  
  // Actualizar valor del buscador
  setBuscador: (p) => {
    set({ buscador: p });
  },

  // Obtener todas las marcas por empresa
  mostrarMarca: async (p) => {
    try {
      console.log("🟡 MostrarMarca - Iniciando...", p);
      
      // Guardar parámetros para usar después
      if (p) {
        set({ parametros: p });
      }
      
      // Si no hay parámetros, mostrar todas las marcas
      const params = p?.id_empresa ? { id_empresa: p.id_empresa } : {};
      const response = await MostrarMarca(params);
      
      console.log("✅ MostrarMarca - Respuesta:", response);
      set({ datamarca: response });
      
      return response;
    } catch (error) {
      console.error("❌ Error en mostrarMarca:", error);
      set({ datamarca: [] });
      return [];
    }
  },

  // Seleccionar una marca
  selectMarca: (p) => {
    set({ marcaItemSelect: p });
  },

  // Insertar nueva marca y refrescar lista
  insertarMarca: async (p) => {
    try {
      console.log("🟡 InsertarMarca - Datos:", p);
      await InsertarMarca(p);
      
      // Recargar las marcas usando los parámetros guardados
      const { parametros } = get();
      console.log("🔄 Recargando marcas con parámetros:", parametros);
      await get().mostrarMarca(parametros);
    } catch (error) {
      console.error("❌ Error en insertarMarca:", error);
      throw error;
    }
  },

  // Eliminar marca y refrescar lista
  eliminarMarca: async (p) => {
    try {
      console.log("🟡 EliminarMarca - ID:", p.id);
      await EliminarMarca(p);
      
      // Recargar las marcas usando los parámetros guardados
      const { parametros } = get();
      console.log("🔄 Recargando marcas con parámetros:", parametros);
      await get().mostrarMarca(parametros);
    } catch (error) {
      console.error("❌ Error en eliminarMarca:", error);
      throw error;
    }
  },

  // Editar marca y refrescar lista
  editarMarca: async (p) => {
    try {
      console.log("🟡 EditarMarca - Datos:", p);
      await EditarMarca(p);
      
      // Recargar las marcas usando los parámetros guardados
      const { parametros } = get();
      console.log("🔄 Recargando marcas con parámetros:", parametros);
      await get().mostrarMarca(parametros);
    } catch (error) {
      console.error("❌ Error en editarMarca:", error);
      throw error;
    }
  },

  // Buscar marcas por término
  buscarMarca: async (p) => {
    try {
      console.log("🟡 BuscarMarca - Término:", p);
      const response = await BuscarMarca(p);
      console.log("✅ BuscarMarca - Resultados:", response?.length);
      set({ datamarca: response });
    } catch (error) {
      console.error("❌ Error en buscarMarca:", error);
      set({ datamarca: [] });
    }
  },
}));