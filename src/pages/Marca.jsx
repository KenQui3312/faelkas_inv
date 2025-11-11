import { useQuery } from "@tanstack/react-query";
// React Query para manejar consultas asincrónicas con caché.

import { useEmpresaStore } from "../store/EmpresaStore";
// Store de empresa para obtener la empresa actualmente seleccionada.

import { SpinnerLoader } from "../components/moleculas/SpinnerLoader";
// Componente visual para mostrar un loader mientras se cargan los datos.

import { MarcaTemplate } from "../components/templates/MarcaTemplate";
// Template visual que renderiza las marcas de productos.

import { useMarcaStore } from "../store/MarcaStore";
// Store de marcas: funciones y estados para mostrar y buscar marcas.

export function Marca() {
  // Stores de marcas
  const { mostrarMarca, datamarca, buscarMarca } = useMarcaStore();
  const { buscador } = useMarcaStore();
  
  // Store de empresa
  const { dataempresa } = useEmpresaStore();

  // React Query: obtener todas las marcas asociadas a la empresa
  const { data, isLoading, error } = useQuery({
    queryKey: ["mostrar marcas", dataempresa.id],  // Clave única para caché
    queryFn: () => mostrarMarca({ id_empresa: dataempresa.id }), // Función que consulta las marcas
    enabled: dataempresa.id != null, // Solo se ejecuta si hay empresa seleccionada
  });

  // React Query: búsqueda de marcas según texto ingresado en buscador
  const { data: buscar } = useQuery({
    queryKey: ["buscar marcas", buscador], // Se vuelve a ejecutar cuando cambia el texto del buscador
    queryFn: () =>
      buscarMarca({ descripcion: buscador, id_empresa: dataempresa.id }), // Función de búsqueda
    enabled: dataempresa.id != null, // Solo se ejecuta si hay empresa seleccionada
  });

  // Render condicional: muestra loader mientras se cargan los datos
  if (isLoading) {
    return <SpinnerLoader />;
  }

  // Render condicional: si ocurre un error, muestra mensaje
  if (error) {
    return <span>Error...</span>;
  }

  // Render principal: envía los datos de marcas al template visual
  return (
    <>
      <MarcaTemplate data={datamarca} />
    </>
  );
}
