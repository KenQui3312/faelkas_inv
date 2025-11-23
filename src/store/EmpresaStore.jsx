// EmpresaStore.jsx - VERSIÓN CORREGIDA
import { create } from "zustand";
import { MostrarCuentas } from "../index";
import {
  ContarUsuariosXempresa,
  MostrarEmpresa,
} from "../supabase/crudEmpresa";

export const useEmpresaStore = create((set, get) => ({
  contadorusuarios: [],
  dataempresa: [],
  
   mostrarEmpresa: async (p) => {
    try {
      const response = await MostrarEmpresa(p);
      console.log("🔄 MostrarEmpresa response:", response);
      console.log("📦 Tipo de response:", typeof response);
      console.log("🔍 Es array?", Array.isArray(response));
      
      // ✅ Si response es un objeto individual, guárdalo como tal
      set({ dataempresa: response });
      return response;
    } catch (error) {
      console.error("❌ Error en mostrarEmpresa:", error);
      set({ dataempresa: null });
      return null;
    }
  },
  
  contarusuariosXempresa: async (p) => {
    try {
      // ✅ Verificar que p y p.id_empresa existan
      if (!p?.id_empresa) {
        console.warn("⚠️ No se proporcionó id_empresa para contar usuarios");
        set({ contadorusuarios: [] });
        return [];
      }
      
      const response = await ContarUsuariosXempresa(p);
      set({ contadorusuarios: response || [] });
      return response || [];
    } catch (error) {
      console.error("❌ Error en contarusuariosXempresa:", error);
      set({ contadorusuarios: [] });
      return [];
    }
  },
}));