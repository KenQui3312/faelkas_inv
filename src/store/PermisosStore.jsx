import { create } from "zustand";
// Importación de funciones para operaciones de usuarios, permisos y configuración desde el archivo index
import {
  EditarTemaMonedaUser,
  supabase,
  InsertarUsuarios,
  InsertarPermisos,
  MostrarUsuariosTodos,
  InsertarAsignaciones,
  MostrarPermisos,
} from "../index";
// Importación de datos estáticos de módulos de configuración
import { DataModulosConfiguracion } from "../utils/dataEstatica";

// Creación del store de permisos usando Zustand
export const usePermisosStore = create((set, get) => ({
  // Array que almacena los permisos del usuario
  datapermisos: [],
  
  datapermisosEdit: [],
  
  // Función asíncrona para mostrar los permisos de un usuario
  mostrarPermisos: async (p) => {
    // Llama a la función que obtiene los permisos desde la API/BD
    const response = await MostrarPermisos(p);
    // Actualiza el array de permisos con la respuesta
    set({ datapermisos: response });
    
    // Array temporal para almacenar todos los módulos con su estado
    let allDocs = [];
    
    // Itera sobre cada módulo de configuración
    DataModulosConfiguracion.map((element) => {
      // Verifica si el módulo existe en los permisos del usuario
      const statePermiso = response.some((objeto) =>
        objeto.modulos.nombre.includes(element.title)
     
        );
      
      // Si el permiso existe, marca el módulo como activo (state: true)
      if (statePermiso) {
        allDocs.push({ ...element, state: true  });
      } else {
        // Si no existe el permiso, marca el módulo como inactivo (state: false)
        allDocs.push({ ...element, state: false });
      }
    });

    // Limpia el array original de módulos de configuración
    DataModulosConfiguracion.splice(0, DataModulosConfiguracion.length);
    // Actualiza el array con los módulos que incluyen el estado de permisos
    DataModulosConfiguracion.push(...allDocs)
    // Log para debug mostrando los módulos actualizados
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
  
  // Función asíncrona para mostrar los permisos en modo edición
  mostrarPermisosEdit: async (p) => {
    // Llama a la función que obtiene los permisos desde la API/BD
    const response = await MostrarPermisos(p);
    // Actualiza el array de permisos de edición con la respuesta
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