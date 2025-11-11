import { useQuery } from "@tanstack/react-query";
// React Query para manejar consultas asincrónicas con caché.

import { useCategoriasStore } from "../store/CategoriasStore";
// Store de categorías para obtener y mostrar categorías de productos.

import { useEmpresaStore } from "../store/EmpresaStore";
// Store de empresa para obtener la empresa actualmente seleccionada.

import { SpinnerLoader } from "../components/moleculas/SpinnerLoader";
// Componente para mostrar un loader mientras se cargan los datos.

import { ProductosTemplate } from "../components/templates/ProductosTemplate";
// Template visual que renderiza los productos.

import { useProductosStore } from "../store/ProductosStore";
// Store de productos: funciones y estados para mostrar y buscar productos.

import { useMarcaStore } from "../store/MarcaStore";
// Store de marcas de productos.

import { usePermisosStore, BloqueoPagina } from "../index";
// Store de permisos del usuario y componente para bloquear la página si no tiene acceso.

export function Productos() {
  // Obtiene los permisos del usuario
  const { datapermisos } = usePermisosStore();

  // Verifica si el usuario tiene acceso al módulo "Productos"
  const statePermiso = datapermisos.some((objeto) =>
    objeto.modulos.nombre.includes("Productos")
  );

  // Validación de permisos comentada (puede activarse si se requiere bloquear el acceso)
  // if (statePermiso == false) {
  //   return <BloqueoPagina state={statePermiso} />;
  // }

  // Stores de productos
  const { mostrarProductos, dataproductos, buscador, buscarProductos } =
    useProductosStore();

  // Stores de categorías y marcas
  const { mostrarCategorias } = useCategoriasStore();
  const { mostrarMarca } = useMarcaStore();

  // Store de empresa
  const { dataempresa } = useEmpresaStore();

  // React Query: obtener todos los productos de la empresa
  const { data, isLoading, error } = useQuery({
    queryKey: ["mostrar productos", dataempresa?.id], // Clave única para caché
    queryFn: () =>
      mostrarProductos({ _id_empresa: dataempresa?.id }), // Función que consulta los productos
    enabled: !!dataempresa, // Solo se ejecuta si hay empresa seleccionada
  });

  // React Query: búsqueda de productos según texto ingresado en buscador
  const { data: buscar } = useQuery({
    queryKey: ["buscar productos", buscador],
    queryFn: () =>
      buscarProductos({
        descripcion: buscador,
        id_empresa: dataempresa?.id,
      }),
    enabled: !!dataempresa,
  });

  // React Query: obtener todas las marcas de la empresa
  const { data: marca } = useQuery({
    queryKey: ["mostrar marcas", dataempresa?.id],
    queryFn: () => mostrarMarca({ id_empresa: dataempresa?.id }),
    enabled: !!dataempresa,
  });

  // React Query: obtener todas las categorías de la empresa
  const { data: datacategorias } = useQuery({
    queryKey: ["mostrar categorias", dataempresa?.id],
    queryFn: () => mostrarCategorias({ idempresa: dataempresa?.id }),
  });

  // Render condicional: muestra loader mientras se cargan los datos
  if (isLoading) {
    return <SpinnerLoader />;
  }

  // Render condicional: si ocurre un error, muestra mensaje de error
  if (error) {
    return <span>Error...</span>;
  }

  // Render principal: envía los datos de productos al template visual
  return (
    <>
      <ProductosTemplate data={dataproductos} />
    </>
  );
}
