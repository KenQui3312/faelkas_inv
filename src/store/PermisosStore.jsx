import { create } from "zustand";
import {
  EditarTemaMonedaUser,
  supabase,
  InsertarUsuarios,
  InsertarPermisos,
  MostrarUsuariosTodos,
  InsertarAsignaciones,
  MostrarPermisos,
} from "../index";
import { DataModulosConfiguracion } from "../utils/dataEstatica";

// Store para gestion de permisos de usuarios
export const usePermisosStore = create((set, get) => ({
  datapermisos: [],
  datapermisosEdit: [],
  
  // Obtener permisos y actualizar estado de modulos
  mostrarPermisos: async (p) => {
    const response = await MostrarPermisos(p);
    set({ datapermisos: response });
    let allDocs = [];
    
    // Verificar estado de cada modulo segun permisos
    DataModulosConfiguracion.map((element) => {
      const statePermiso = response.some((objeto) =>
        objeto.modulos.nombre.includes(element.title)
     
        );
      if (statePermiso) {
        allDocs.push({ ...element, state: true  });
      } else {
        allDocs.push({ ...element, state: false });
      }
    });

    // Actualizar modulos de configuracion con estados
    DataModulosConfiguracion.splice(0, DataModulosConfiguracion.length);
    DataModulosConfiguracion.push(...allDocs)
    console.log("agergando",allDocs)



    // response.forEach((item) => {
    //   let modulo = item.modulos.nombre;
    
    //   DataModulosConfiguracion.forEach((itemmodulos) => {
    //     if (itemmodulos.title === modulo) {
    //       itemmodulos.state = true;
        
    //     } else {
    //       itemmodulos.state = false;
    //     }
    //   });
    // });
    return response;
  },
  
  // Obtener permisos para edicion
  mostrarPermisosEdit: async (p) => {
    const response = await MostrarPermisos(p);
    set({ datapermisosEdit: response });
    
    // response.forEach((item) => {
    //   let modulo = item.modulos.nombre;
    
    //   DataModulosConfiguracion.forEach((itemmodulos) => {
    //     if (itemmodulos.title === modulo) {
    //       itemmodulos.state = true;
        
    //     } else {
        
    //     }
    //   });
    // });

    return response;
  },

}));