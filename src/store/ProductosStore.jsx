import { create } from "zustand";
import {
  BuscarProductos,
  EditarProductos,
  EliminarProductos,
  InsertarProductos,
  MostrarProductos,
  ReportStockProductosTodos,ReportStockXProducto,ReportStockBajoMinimo,ReportKardexEntradaSalida,ReportInventarioValorado
} from "../index";

// Store de productos con funciones CRUD y generación de reportes
export const useProductosStore = create((set, get) => ({
  // Valor del campo de búsqueda
  buscador: "",
  // Actualiza el buscador
  setBuscador: (p) => {
    set({ buscador: p });
  },
  // Lista de todos los productos
  dataproductos: [],
  // Producto actualmente seleccionado
  productoItemSelect: [],
  // Parámetros de la última consulta realizada
  parametros: {},
  
  // Obtiene y muestra productos según parámetros
  mostrarProductos: async (p) => {
    const response = await MostrarProductos(p);
    set({ parametros: p });
    set({ dataproductos: response });
    set({ productoItemSelect: [] }); // Limpia la selección
    return response;
  },
  
  // Selecciona un producto
  selectProductos: (p) => {
    set({ productoItemSelect: p });
  },
  
  // Inserta nuevo producto y refresca la lista con los parámetros anteriores
  insertarProductos: async (p) => {
    await InsertarProductos(p);
    const { mostrarProductos } = get();
    const { parametros } = get();
    set(mostrarProductos(parametros));
  },
  
  // Elimina producto y actualiza la lista
  eliminarProductos: async (p) => {
    await EliminarProductos(p);
    const { mostrarProductos } = get();
    const { parametros } = get();
    console.log("parametros", parametros);
    set(mostrarProductos(parametros));
  },

  // Edita producto existente y refresca la lista
  editarProductos: async (p) => {
    await EditarProductos(p);
    const { mostrarProductos } = get();
    const { parametros } = get();
    console.log("parametros", parametros);
    set(mostrarProductos(parametros));
  },
  
  // Busca productos según criterios y actualiza la lista
  buscarProductos: async (p) => {
    const response = await BuscarProductos(p);
    set({ dataproductos: response });
    return response;
  },
  
  // Genera reporte de stock de todos los productos
  reportStockProductosTodos: async (p) => {
    const response = await ReportStockProductosTodos(p);
    return response;
  },
  
  // Genera reporte de stock para un producto específico
  reportStockXproducto: async (p) => {
    const response = await ReportStockXProducto(p);
    return response;
  },
  
  // Genera reporte de productos con stock bajo el mínimo establecido
  reportBajoMinimo: async (p) => {
    const response = await ReportStockBajoMinimo(p);
    return response;
  },
  
  // Genera reporte del kardex mostrando entradas y salidas de productos
  reportKardexEntradaSalida: async (p) => {
    const response = await ReportKardexEntradaSalida(p);
    return response;
  },
  
  // Genera reporte del inventario con valores monetarios calculados
  reportInventarioValorado: async (p) => {
    const response = await ReportInventarioValorado(p);
    return response;
  },

}));