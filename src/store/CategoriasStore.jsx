import { create } from "zustand";
// Importación de funciones para operaciones CRUD de categorías desde el archivo index
import {
  BuscarCategorias,
  EditarCategorias,
  EliminarCategorias,
  EliminarCategoriasTodas,
  InsertarCategorias,
  MostrarCategorias,
} from "../index";

// Creación del store de categorías usando Zustand
export const useCategoriasStore = create((set, get) => ({
  // Estado para almacenar el valor del buscador
  buscador: "",
  
  // Función para actualizar el valor del buscador
  setBuscador: (p) => {
    set({ buscador: p });
  },
  
  // Array que almacena todas las categorías
  datacategorias: [],
  
  // Objeto que almacena la categoría seleccionada actualmente
  categoriaItemSelect: [],
  
  // Objeto que almacena los parámetros de la última consulta
  parametros: {},
  
  // Función asíncrona para mostrar/obtener categorías
  mostrarCategorias: async (p) => {
    // Llama a la función que obtiene las categorías desde la API/BD
    const response = await MostrarCategorias(p);
    // Guarda los parámetros utilizados en la consulta
    set({ parametros: p });
    // Actualiza el array de categorías con la respuesta
    set({ datacategorias: response });
    // Selecciona automáticamente la primera categoría del resultado
    set({ categoriaItemSelect: response[0] });
    return response;
  },
  
  // Función para seleccionar una categoría específica
  selectCategoria: (p) => {
    set({ categoriaItemSelect: p });
  },
  
  // Función asíncrona para insertar una nueva categoría
  insertarCategorias: async (p) => {
    // Inserta la nueva categoría en la BD
    await InsertarCategorias(p);
    // Obtiene la función mostrarCategorias del store
    const { mostrarCategorias } = get();
    // Obtiene los parámetros guardados del store
    const { parametros } = get();
    // Actualiza la lista de categorías con los parámetros anteriores
    set(mostrarCategorias(parametros));
  },
  
  // Función asíncrona para eliminar una categoría específica
  eliminarCategoria: async (p) => {
    // Elimina la categoría de la BD
    await EliminarCategorias(p);
    // Obtiene la función mostrarCategorias del store
    const { mostrarCategorias } = get();
    // Obtiene los parámetros guardados del store
    const { parametros } = get();
    // Log para debug de los parámetros
    console.log("parametros", parametros);
    // Actualiza la lista de categorías
    set(mostrarCategorias(parametros));
  },
  
  // Función asíncrona para eliminar todas las categorías
  eliminarCategoriasTodas: async (p) => {
    // Elimina todas las categorías de la BD
    await EliminarCategoriasTodas(p);
    // Obtiene la función mostrarCategorias del store
    const { mostrarCategorias } = get();
    // Actualiza la lista de categorías con los parámetros proporcionados
    set(mostrarCategorias(p));
  },
  
  // Función asíncrona para editar una categoría existente
  editarCategoria: async (p) => {
    // Actualiza la categoría en la BD
    await EditarCategorias(p);
    // Obtiene la función mostrarCategorias del store
    const { mostrarCategorias } = get();
    // Obtiene los parámetros guardados del store
    const { parametros } = get();
    // Log para debug de los parámetros
    console.log("parametros", parametros);
    // Actualiza la lista de categorías
    set(mostrarCategorias(parametros));
  },
  
  // Función asíncrona para buscar categorías según criterios
  buscarCategorias: async (p) => {
    // Busca categorías en la BD según los parámetros
    const response = await BuscarCategorias(p);
    // Actualiza el array de categorías con los resultados de la búsqueda
    set({ datacategorias: response });
  },
}));