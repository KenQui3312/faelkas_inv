import { create } from "zustand";
import {
  BuscarProductos,
  EditarProductos,
  EliminarProductos,
  InsertarProductos,
  MostrarProductos,
  ReportStockProductosTodos,
  ReportStockXProducto,
  ReportStockBajoMinimo,
  ReportKardexEntradaSalida,
  ReportInventarioValorado
} from "../index";

export const useProductosStore = create((set, get) => ({
  // Estados
  buscador: "",
  dataproductos: [],
  productoItemSelect: [],
  
  // ✅ ELIMINAR la dependencia de empresa
  parametrosFiltros: {}, // Solo para filtros de consulta

  // Actions
  setBuscador: (p) => {
    set({ buscador: p });
  },

  mostrarProductos: async (p = {}) => {
    console.log('🔍 STORE mostrarProductos - Parámetros recibidos:', p);
    
    // ✅ MOSTRAR TODOS los productos sin filtrar por empresa
    const params = {
      ...p,
      // NO incluir id_empresa para obtener todos los productos
    };
    
    console.log('🎯 Buscando TODOS los productos (sin filtro empresa)');
    const response = await MostrarProductos(params);
    
    set({ parametrosFiltros: p });
    set({ dataproductos: response || [] });
    set({ productoItemSelect: [] });
    
    console.log('✅ TODOS los productos cargados:', response?.length || 0, 'registros');
    return response;
  },

  selectProductos: (p) => {
    set({ productoItemSelect: p });
  },

  insertarProductos: async (p) => {
    console.log('🔍 STORE insertarProductos - Parámetros:', p);
    
    await InsertarProductos(p);
    
    // ✅ Recargar TODOS los productos
    const { mostrarProductos } = get();
    
    console.log('🔄 Recargando TODOS los productos después de insertar...');
    await mostrarProductos(); // Sin parámetros = mostrar todos
  },

  eliminarProductos: async (p) => {
    console.log('🔍 STORE eliminarProductos - Parámetros:', p);
    
    await EliminarProductos(p);
    
    // ✅ Recargar TODOS los productos
    const { mostrarProductos } = get();
    
    console.log('🔄 Recargando TODOS los productos después de eliminar...');
    await mostrarProductos(); // Sin parámetros = mostrar todos
  },

  editarProductos: async (p) => {
    console.log('🔍 STORE editarProductos - Parámetros:', p);
    
    await EditarProductos(p);
    
    // ✅ Recargar TODOS los productos
    const { mostrarProductos } = get();
    
    console.log('🔄 Recargando TODOS los productos después de editar...');
    await mostrarProductos(); // Sin parámetros = mostrar todos
  },

  buscarProductos: async (p) => {
    console.log("🔍 STORE buscarProductos GLOBAL - Parámetros:", p);
    
    // Solo necesitamos el término de búsqueda
    const params = {
      descripcion: p?.descripcion || ''
    };
    
    console.log("🎯 Parámetros para búsqueda GLOBAL:", params);
    const response = await BuscarProductos(params);
    set({ dataproductos: response });
    return response;
  },

  // ✅ FUNCIÓN ESPECÍFICA para productos de una empresa (si la necesitas en algún caso)
  mostrarProductosPorEmpresa: async (idEmpresa) => {
    if (!idEmpresa) {
      console.log('🏢 Mostrando TODOS los productos (empresa no especificada)');
      return await get().mostrarProductos();
    }
    
    console.log('🏢 Mostrando productos de empresa específica:', idEmpresa);
    const response = await MostrarProductos({ id_empresa: idEmpresa });
    set({ dataproductos: response || [] });
    return response;
  },

  // Función para obtener el estado actual (debug)
  obtenerEstado: () => {
    const state = get();
    console.log('📊 ESTADO ACTUAL ProductosStore:', {
      filtros: state.parametrosFiltros,
      productosCount: state.dataproductos.length,
      buscador: state.buscador
    });
    return state;
  },

  // Reportes (sin cambios)
  reportStockProductosTodos: async (p) => {
    const response = await ReportStockProductosTodos(p);
    return response;
  },
  
  reportStockXproducto: async (p) => {
    if (!p?.id) {
      console.error("❌ Store: ID de producto faltante para reportStockXproducto");
      return [];
    }
    const response = await ReportStockXProducto(p);
    return response || [];
  },

  reportBajoMinimo: async (p) => {
    const response = await ReportStockBajoMinimo(p);
    return response;
  },
  
  reportKardexEntradaSalida: async (p) => {
    const response = await ReportKardexEntradaSalida(p);
    return response;
  },

  reportInventarioValorado: async () => {
    const response = await ReportInventarioValorado();
    return response || [];
  },
}));