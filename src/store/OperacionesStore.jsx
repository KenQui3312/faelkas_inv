import { create } from "zustand";
import { v } from "../styles/variables";

// Creación del store de operaciones usando Zustand
export const useOperaciones = create((set, get) => ({
  tipo: "i",
  
  // Título del botón de descripción para categorías
  tituloBtnDes: "Categorias ingresos",
  
  // Título del botón de descripción para movimientos
  tituloBtnDesMovimientos: "Ingresos",
  
  // Color para las categorías (toma el color de ingresos de las variables)
  colorCategoria:  v.colorIngresos,
  
  // Color de fondo para las categorías (toma el color de fondo de ingresos)
  bgCategoria:  v.colorbgingresos,
  
  // Año actual obtenido de la fecha del sistema
  año: (new Date).getFullYear(),
  
  // Mes actual obtenido de la fecha del sistema (+1 porque getMonth() devuelve 0-11)
  mes: (new Date).getMonth()+1,
  
  setMes: (p) => {
    set({ mes: p });
  },
  
  setAño: (p) => {
    set({ año: p });
  },
  
  // Función para cambiar el tipo de movimientos y actualizar propiedades relacionadas
  setTipoMovimientos:(p) => {
    // Actualiza el tipo de movimiento
    set({tipo:p.tipo})
    // Actualiza el título del botón de descripción de movimientos
    set({
      tituloBtnDesMovimientos:p.text
    });
    set({
      colorCategoria: p.color,
    });
    // Actualiza el color de fondo de la categoría según el tipo
    set({
      bgCategoria: p.bgcolor,
    });
  },
  
  // Función para cambiar el tipo de operación y actualizar propiedades relacionadas
  setTipo: (p) => {
    set({tipo:p.tipo})
    set({
      tituloBtnDes: p.text
    });
    set({
      colorCategoria: p.color,
    });
    // Actualiza el color de fondo de la categoría según el tipo
    set({
      bgCategoria: p.bgcolor,
    });
  },
}));