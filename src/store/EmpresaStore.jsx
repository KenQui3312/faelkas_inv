import { create } from "zustand";
import {
  ContarUsuariosXempresa,
  MostrarEmpresa,
} from "../supabase/crudEmpresa";

export const useEmpresaStore = create((set, get) => ({
  contadorusuarios: [],
  dataempresa: null,
  
  // Obtener datos de la empresa
  mostrarEmpresa: async (p = {}) => {
    try {
      console.log("🔄 MostrarEmpresa - Parámetros:", p);
      
      const response = await MostrarEmpresa(p);
      console.log("✅ MostrarEmpresa response:", response);
      
      // Si response es undefined o null, usa datos por defecto
      if (!response) {
        console.warn("⚠️ MostrarEmpresa: respuesta vacía, usando datos por defecto");
        const datosPorDefecto = {
          id: 8,
          nombre: "FAELKAS SHOP",
          simbolomoneda: "S/.",
          iduseradmin: 8,
          direccion: "Choluteca, Honduras",
          telefono: "+504 1234-5678",
          email: "contacto@faelkas.com",
          identificacion_fiscal: "RTN: 0801-1990-12345",
        };
        
        set({ dataempresa: datosPorDefecto });
        return datosPorDefecto;
      }
      
      set({ dataempresa: response });
      return response;
    } catch (error) {
      console.error("❌ Error en mostrarEmpresa:", error);
      
      // Datos por defecto en caso de error
      const datosPorDefecto = {
        id: 8,
        nombre: "FAELKAS SHOP",
        simbolomoneda: "S/.",
        iduseradmin: 8,
        direccion: "Choluteca, Honduras",
        telefono: "+504 1234-5678",
        email: "contacto@faelkas.com",
        identificacion_fiscal: "RTN: 0801-1990-12345",
      };
      
      set({ dataempresa: datosPorDefecto });
      return datosPorDefecto;
    }
  },
  
  // Contar usuarios por empresa
  contarusuariosXempresa: async (p) => {
    try {
      if (!p?.id_empresa) {
        console.warn("⚠️ No se proporcionó id_empresa para contar usuarios");
        return 0;
      }
      
      const response = await ContarUsuariosXempresa(p);
      return response || 0;
    } catch (error) {
      console.error("❌ Error en contarusuariosXempresa:", error);
      return 0;
    }
  },
}));