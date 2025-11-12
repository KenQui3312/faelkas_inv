import { create } from "zustand";
import {
  MostrarMovimientosPorMesAño,
  InsertarMovimientos,
  EliminarMovimientos,
  RptMovimientosPorMesAño,
} from "../index";

// Creación del store de movimientos usando Zustand
export const useMovimientosStore = create((set, get) => ({
  // Array que almacena todos los movimientos
  datamovimientos: [],
  
  dataRptMovimientosAñoMes: [],
  
  // Número que almacena el total de movimientos del mes/año
  totalMesAño: 0,
  
  totalMesAñoPagados: 0,
  
  totalMesAñoPendientes: 0,
  
  // Objeto que almacena los parámetros de la última consulta
  parametros: {},
  
  // Función asíncrona para mostrar movimientos por mes y año
  mostrarMovimientos: async (p) => {
    // Llama a la función que obtiene los movimientos desde la API/BD
    const response = await MostrarMovimientosPorMesAño(p);
    // Guarda los parámetros utilizados en la consulta
    set({ parametros: p });
    // Obtiene la función calcularTotales del store
    const { calcularTotales } = get();
    // Calcula los totales basados en la respuesta obtenida
    calcularTotales(response);
    // Actualiza el array de movimientos con la respuesta
    set({ datamovimientos: response });
    return response;
  },
  
  // Función para calcular los totales de movimientos (general, pagados y pendientes)
  calcularTotales: (response) => {
    // Filtra los movimientos con estado 1 (pagados)
    const dtPagados = response?.filter((item) => item.estado == 1);
    // Filtra los movimientos con estado 0 (pendientes)
    const dtPendientes = response?.filter((item) => item.estado == 0);
    // Inicializa variables para los totales
    let total = 0;
    let tpagados = 0;
    let tpendientes = 0;
    // Calcula el total general sumando el tercer valor de cada movimiento
    response?.forEach((item) => {
      const array = Object.values(item);
      total += array[2];
    });
    // Calcula el total de movimientos pagados
    dtPagados?.forEach((item) => {
      const array = Object.values(item);
      tpagados += array[2];
    });
    // Calcula el total de movimientos pendientes
    dtPendientes?.forEach((item) => {
      const array = Object.values(item);
      tpendientes += array[2];
    });
    // Actualiza el estado con el total general
    set({ totalMesAño: total });
    // Actualiza el estado con el total de pagados
    set({ totalMesAñoPagados: tpagados });
    // Actualiza el estado con el total de pendientes
    set({ totalMesAñoPendientes: tpendientes });
  },
  
  // Función asíncrona para insertar un nuevo movimiento
  insertarMovimientos: async (p) => {
    // Inserta el nuevo movimiento en la BD
    await InsertarMovimientos(p);
    const { mostrarMovimientos } = get();
    const { parametros } = get();
    set(mostrarMovimientos(parametros));
  },
  
  // Función asíncrona para eliminar un movimiento
  eliminarMovimiento: async (p) => {
    // Elimina el movimiento de la BD
    await EliminarMovimientos(p);
    const { parametros } = get();
    const { mostrarMovimientos } = get();
    set(mostrarMovimientos(parametros));
  },
  
  // Función asíncrona para generar reporte de movimientos por mes y año
  rptMovimientosAñoMes: async (p) => {
    // Llama a la función que genera el reporte desde la API/BD
    const response = await RptMovimientosPorMesAño(p);
    // Actualiza el array con los datos del reporte
    set({ dataRptMovimientosAñoMes: response });
    return response;
  },
}));