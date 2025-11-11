import { useQuery } from "@tanstack/react-query";
// React Query para manejar consultas asincrónicas con caché.

import { useCategoriasStore } from "../store/CategoriasStore";
// Store de categorías (aunque en este componente no se usa directamente, puede ser útil para futuras extensiones).
import { useEmpresaStore } from "../store/EmpresaStore";
// Store de empresa para obtener la empresa actual.
import { SpinnerLoader } from "../components/moleculas/SpinnerLoader";
// Componente visual para mostrar un loader mientras se cargan datos.
import { ProductosTemplate } from "../components/templates/ProductosTemplate";
// Template visual de productos (no se usa directamente, se podría integrar después).
import { useProductosStore } from "../store/ProductosStore";
// Store de productos: funciones y estado para mostrar y buscar productos.
import { useMarcaStore } from "../store/MarcaStore";
// Store de marcas de productos.
import { KardexTemplate } from "../components/templates/KardexTemplate";
// Template visual de Kardex donde se muestran los productos.
import { useKardexStore } from "../store/KardexStore";
// Store de Kardex: funciones y estado para mostrar y buscar registros de Kardex.
import { usePermisosStore, BloqueoPagina } from "../index";
// Store de permisos y componente para bloquear la página si el usuario no tiene acceso.

export function Kardex() {
  // Obtiene los permisos del usuario
  const { datapermisos } = usePermisosStore();

  // Verifica si el usuario tiene acceso al módulo "Kardex"
  const statePermiso = datapermisos.some((objeto) =>
    objeto.modulos.nombre.includes("Kardex")
  );

  // Stores de productos
  const { mostrarProductos, dataproductos, buscador, buscarProductos } =
    useProductosStore();

  // Stores de Kardex
  const { mostrarKardex, buscarKardex, buscador: buscadorkardex } =
    useKardexStore();

  // Store de marcas
  const { mostrarMarca } = useMarcaStore();

  // Store de empresa
  const { dataempresa } = useEmpresaStore();

  // React Query: obtiene todos los productos de la empresa
  const { data, isLoading, error } = useQuery({
    queryKey: ["mostrar productos", dataempresa.id],
    queryFn: () => mostrarProductos({ _id_empresa: dataempresa.id }),
    enabled: dataempresa.id != null, // Se ejecuta solo si existe empresa
  });

  // React Query: búsqueda de productos según el texto del buscador
  const { data: buscar } = useQuery({
    queryKey: ["buscar productos", buscador],
    queryFn: () =>
      buscarProductos({ descripcion: buscador, id_empresa: dataempresa.id }),
    enabled: dataempresa.id != null,
  });

  // React Query: obtiene todos los registros de Kardex
  const { data: datakardex } = useQuery({
    queryKey: ["mostrar kardex", dataempresa.id],
    queryFn: () => mostrarKardex({ id_empresa: dataempresa.id }),
    enabled: dataempresa.id != null,
  });

  // React Query: búsqueda de Kardex según texto del buscador
  const { data: buscarkardex } = useQuery({
    queryKey: ["buscar kardex", buscadorkardex],
    queryFn: () =>
      buscarKardex({ buscador: buscadorkardex, id_empresa: dataempresa.id }),
    enabled: dataempresa.id != null,
  });

  // Render condicional: muestra loader mientras se cargan los datos
  if (isLoading) {
    return <SpinnerLoader />;
  }

  // Si ocurrió un error en la consulta, se muestra mensaje
  if (error) {
    return <span>Error...</span>;
  }

  // Bloquea la página si el usuario no tiene permisos
  if (statePermiso == false) return <BloqueoPagina state={statePermiso} />;

  // Renderiza el template principal de Kardex pasando los productos obtenidos
  return <KardexTemplate data={dataproductos} />;
}
