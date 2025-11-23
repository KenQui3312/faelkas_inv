import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useMemo } from "react";
import { SpinnerLoader } from "../components/moleculas/SpinnerLoader";
import { ProductosTemplate } from "../components/templates/ProductosTemplate";
import { usePermisosStore, BloqueoPagina } from "../index";
import { 
  MostrarProductos, 
  MostrarCategorias, 
  MostrarMarca 
} from "../index";

export function Productos() {
  const { datapermisos } = usePermisosStore();
  const statePermiso = datapermisos.some((objeto) =>
    objeto.modulos.nombre.includes("Productos")
  );

  const [buscador, setBuscador] = useState("");

  // ✅ QUERY: Productos (GLOBAL - TODAS LAS EMPRESAS)
  const { 
    data: productos = [], 
    isLoading: isLoadingProductos, 
    error: errorProductos,
    refetch: refetchProductos 
  } = useQuery({
    queryKey: ["productos-global"],
    queryFn: () => MostrarProductos(),
    staleTime: 5 * 60 * 1000,
  });

  // ✅ QUERY: Categorías (GLOBAL)
  const { 
    data: categorias = [], 
    isLoading: isLoadingCategorias,
    error: errorCategorias 
  } = useQuery({
    queryKey: ["categorias-global"],
    queryFn: () => MostrarCategorias(),
    staleTime: 10 * 60 * 1000,
  });

  // ✅ QUERY: Marcas (GLOBAL)
  const { 
    data: marcas = [], 
    isLoading: isLoadingMarcas,
    error: errorMarcas 
  } = useQuery({
    queryKey: ["marcas-global"],
    queryFn: () => MostrarMarca(),
    staleTime: 10 * 60 * 1000,
  });

  // ✅ DEBUG: Ver estructura de datos
  useEffect(() => {
    if (productos.length > 0) {
      console.log('🔍 ESTRUCTURA del primer producto:', productos[0]);
      console.log('📋 CAMPOS disponibles:', Object.keys(productos[0]));
      console.log('🏷️ Primera categoría:', categorias[0]);
    }
  }, [productos, categorias]);

  // ✅ SOLUCIÓN: Usar useMemo en lugar de useEffect + useState
  const productosFiltrados = useMemo(() => {
    if (!buscador.trim()) {
      return productos;
    }
    
    return productos.filter(producto =>
      producto.descripcion?.toLowerCase().includes(buscador.toLowerCase()) ||
      producto.codigo?.toLowerCase().includes(buscador.toLowerCase()) ||
      producto.codigobarras?.toLowerCase().includes(buscador.toLowerCase())
    );
  }, [buscador, productos]);

  // ✅ Estados combinados
  const isLoading = isLoadingProductos || isLoadingCategorias || isLoadingMarcas;
  const hasError = errorProductos || errorCategorias || errorMarcas;

  // ✅ Mostrar loading mientras cargan los datos
  if (isLoading) {
    return <SpinnerLoader/>;
  }
  
  // ✅ Mostrar error si hay problemas
  if (hasError) {
    return (
      <div className="flex justify-center items-center p-8">
        <span className="text-red-500">Error al cargar los datos...</span>
      </div>
    );
  }

  // ✅ Verificar permisos
  if (!statePermiso) {
    return <BloqueoPagina />;
  }

  return (
    <ProductosTemplate 
      data={productosFiltrados}
      categorias={categorias}
      marcas={marcas}
      buscador={buscador}
      onBuscadorChange={setBuscador}
      onRecargar={refetchProductos}
    />
  );
}