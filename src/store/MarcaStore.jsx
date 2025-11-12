import { create } from "zustand";
// Importación de funciones para operaciones CRUD de marcas desde el archivo index
import {
  BuscarMarca,
  EditarMarca,
  EliminarMarca,
  InsertarMarca,
  MostrarMarca,
} from "../index";

// Creación del store de marcas usando Zustand
export const useMarcaStore = create((set, get) => ({
  // Estado para almacenar el valor del buscador
  buscador: "",
  
  // Función para actualizar el valor del buscador
  setBuscador: (p) => {
    set({ buscador: p });
  },
  
  // Array que almacena todas las marcas
  datamarca: [],
  
  // Objeto que almacena la marca seleccionada actualmente
  marcaItemSelect: [],
  
  // Objeto que almacena los parámetros de la última consulta
  parametros: {},
  
  // Función asíncrona para mostrar/obtener marcas
  mostrarMarca: async (p) => {
    // Llama a la función que obtiene las marcas desde la API/BD
    const response = await MostrarMarca(p);
    // Guarda los parámetros utilizados en la consulta
    set({ parametros: p });
    // Actualiza el array de marcas con la respuesta
    set({ datamarca: response });
    // Selecciona automáticamente la primera marca del resultado
    set({ marcaItemSelect:response[0] });
    return response;
  },
  
  // Función para seleccionar una marca específica
  selectMarca: (p) => {
    set({ marcaItemSelect: p });
  },
  
  // Función asíncrona para insertar una nueva marca
  insertarMarca: async (p) => {
    // Inserta la nueva marca en la BD
    await InsertarMarca(p);
    const { mostrarMarca } = get();
    const { parametros } = get();
    set(mostrarMarca(parametros));
  },
  
  // Función asíncrona para eliminar una marca específica
  eliminarMarca: async (p) => {
    // Elimina la marca de la BD
    await EliminarMarca(p);
    // Obtiene la función mostrarMarca del store
    const { mostrarMarca } = get();
    // Obtiene los parámetros guardados del store
    const { parametros } = get();
    // Log para debug de los parámetros
    console.log("parametros", parametros);
    set(mostrarMarca(parametros));
  },

  // Función asíncrona para editar una marca existente
  editarMarca: async (p) => {
    // Actualiza la marca en la BD
    await EditarMarca(p);
    const { mostrarMarca } = get();
    const { parametros } = get();
    console.log("parametros", parametros);
    set(mostrarMarca(parametros));
  },
  
  // Función asíncrona para buscar marcas según criterios
  buscarMarca: async (p) => {
    // Busca marcas en la BD según los parámetros
    const response = await BuscarMarca(p);
    set({ datamarca: response });
  },
}));