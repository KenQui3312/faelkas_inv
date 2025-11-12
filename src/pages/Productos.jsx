import { useQuery } from "@tanstack/react-query";

import { useCategoriasStore } from "../store/CategoriasStore";
import { useEmpresaStore } from "../store/EmpresaStore";
import { SpinnerLoader } from "../components/moleculas/SpinnerLoader";
import { ProductosTemplate } from "../components/templates/ProductosTemplate";
import { useProductosStore } from "../store/ProductosStore";
import { useMarcaStore } from "../store/MarcaStore";
import { usePermisosStore,BloqueoPagina } from "../index";
// Componente principal para la gestión de Productos
export function Productos() {
  // Verificar permisos del usuario para acceder al módulo Productos
  const { datapermisos } = usePermisosStore();
  const statePermiso = datapermisos.some((objeto) =>
  objeto.modulos.nombre.includes("Productos")
);
// Comentado: Bloqueo de página por permisos
// if (statePermiso == false) {
//   return <BloqueoPagina state={statePermiso} />;
// } 
  // Obtener funciones y estados de los stores
  const {mostrarProductos,dataproductos,buscador,buscarProductos} = useProductosStore()
  const {mostrarCategorias} = useCategoriasStore()
  const {mostrarMarca} = useMarcaStore()
  const {dataempresa} = useEmpresaStore()
// Query para obtener todos los productos de la empresa
 const {data,isLoading,error} = useQuery({queryKey:["mostrar productos",dataempresa?.id],queryFn:()=>mostrarProductos({_id_empresa:dataempresa?.id}),enabled:!!dataempresa})
 //buscador
 const {data:buscar} = useQuery({queryKey:["buscar productos",buscador],queryFn:()=>buscarProductos({descripcion: buscador,id_empresa:dataempresa?.id}),enabled:!!dataempresa})
 //mostrar marcas
 const {data:marca} = useQuery({queryKey:["mostrar marcas",dataempresa?.id],queryFn:()=>mostrarMarca({id_empresa:dataempresa?.id}),enabled:!!dataempresa})
  //mostrar categorias
  const {data:datacategorias} = useQuery({queryKey:["mostrar categorias",dataempresa?.id],queryFn:()=>mostrarCategorias({idempresa:dataempresa?.id})})
 //respuestas
 if(isLoading){
  return <SpinnerLoader/>
 }
 if(error){
  return <span>Error...</span>
 }

  return (<>
    {/* Renderizar el template de productos con los datos */}
    <ProductosTemplate data={dataproductos}/>
  </>)
}
