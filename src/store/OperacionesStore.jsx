import { create } from "zustand";
import { v } from "../styles/variables";

// Store para gestion de operaciones financieras (ingresos/egresos)
export const useOperaciones = create((set, get) => ({
  tipo: "i",
  tituloBtnDes: "Categorias ingresos",
  tituloBtnDesMovimientos: "Ingresos",
  colorCategoria:  v.colorIngresos,
  bgCategoria:  v.colorbgingresos,
  año: (new Date).getFullYear(),
  mes: (new Date).getMonth()+1,
  
  // Actualizar mes 
  setMes: (p) => {
    set({ mes: p });
  },
  
  // Actualizar año 
  setAño: (p) => {
    set({ año: p });
  },
  
  // Cambiar tipo de movimiento y actualizar titulo/colores
  setTipoMovimientos:(p) => {
    set({tipo:p.tipo})
    set({
      tituloBtnDesMovimientos:p.text
    });
    set({
      colorCategoria: p.color,
    });
    set({
      bgCategoria: p.bgcolor,
    });
  },
  
  // Cambiar tipo de categoria y actualizar titulo/colores
  setTipo: (p) => {
    set({tipo:p.tipo})
    set({
      tituloBtnDes: p.text
    });
    set({
      colorCategoria: p.color,
    });
    set({
      bgCategoria: p.bgcolor,
    });
  },
}));