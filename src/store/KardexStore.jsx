import { create } from "zustand";
// Importación de funciones para operaciones de Kardex desde el archivo index
import { BuscarKardex, InsertarKardex, MostrarKardex } from "../index";

// Creación del store de Kardex usando Zustand
export const useKardexStore = create((set, get) => ({
  // Estado para almacenar el valor del buscador
  buscador: "",
  
  // Función para actualizar el valor del buscador
  setBuscador: (p) => {
    set({ buscador: p });
  },
  
  // Array que almacena todos los registros del kardex
  datakardex: [],
  
  // Array que almacena el item de kardex seleccionado actualmente
  kardexItemSelect: [],
  
  // Objeto que almacena los parámetros de la última consulta
  parametros: {},

  // Función asíncrona para insertar un nuevo registro en el kardex
  insertarKardex: async (p) => {
    // Inserta el nuevo registro de kardex en la BD
    await InsertarKardex(p);
    const { mostrarKardex } = get();
    const { parametros } = get();
    set(mostrarKardex(parametros));
  },
  
  // Función asíncrona para mostrar/obtener registros del kardex
  mostrarKardex: async (p) => {
    // Llama a la función que obtiene los registros del kardex desde la API/BD
    const response = await MostrarKardex(p);
    // Guarda los parámetros utilizados en la consulta
    set({ parametros: p });
    set({ datakardex: response });
    return response;
  },
  
  // Función asíncrona para buscar registros en el kardex según criterios
  buscarKardex: async (p) => {
    // Busca registros en el kardex según los parámetros
    const response = await BuscarKardex(p);
    set({ datakardex: response });
    return response;
  },
}));