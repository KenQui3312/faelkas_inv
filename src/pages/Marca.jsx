// src\pages\Marca.jsx - CON DEBUG
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo, useEffect } from "react";
import { SpinnerLoader } from "../components/moleculas/SpinnerLoader";
import { MarcaTemplate } from "../components/templates/MarcaTemplate";
import { usePermisosStore, BloqueoPagina } from "../index";
import { 
  MostrarMarca, 
  BuscarMarcas
} from "../index";

export function Marca() {
  // Verificar permisos
  const { datapermisos } = usePermisosStore();
  
  // ✅ AGREGA ESTE DEBUG
  useEffect(() => {
    console.log('=== DEBUG PERMISOS MARCAS ===');
    console.log('🔐 Todos los permisos:', datapermisos);
    console.log('🔍 Nombres de módulos:', datapermisos.map(p => p.modulos?.nombre));
    console.log('📋 Estructura del primer permiso:', datapermisos[0]);
  }, [datapermisos]);

  // ✅ BÚSQUEDA FLEXIBLE - prueba diferentes nombres
  const statePermiso = datapermisos.some((objeto) => {
    const nombreModulo = objeto.modulos?.nombre;
    console.log('🔍 Verificando módulo:', nombreModulo);
    
    return (
      nombreModulo?.includes('Marcas') ||
      nombreModulo?.includes('Marca') ||
      nombreModulo?.includes('marcas') ||
      nombreModulo?.includes('marca') ||
      nombreModulo?.includes('Brand')
    );
  });

  console.log('✅ ¿Tiene permiso para Marcas?:', statePermiso);

  const [buscador, setBuscador] = useState("");

  // ✅ QUERY: Marcas (GLOBAL - TODAS LAS EMPRESAS)
  const { 
    data: marcas = [], 
    isLoading: isLoadingMarcas, 
    error: errorMarcas,
    refetch: refetchMarcas 
  } = useQuery({
    queryKey: ["marcas-global"],
    queryFn: () => MostrarMarca(),
    staleTime: 5 * 60 * 1000,
  });

  // ✅ QUERY: Búsqueda de Marcas - CORREGIDA
  const { 
    data: marcasBusqueda = [],
    isLoading: isLoadingBusqueda 
  } = useQuery({
    queryKey: ["buscar-marcas", buscador],
    queryFn: () => {
      if (!buscador.trim()) {
        return [];
      }
      return BuscarMarcas({ descripcion: buscador });
    },
    enabled: !!buscador.trim(),
  });

  // ✅ Filtrar marcas localmente
  const marcasMostrar = useMemo(() => {
    if (!buscador.trim()) {
      return marcas;
    }
    return marcasBusqueda;
  }, [buscador, marcas, marcasBusqueda]);

  // ✅ Estados combinados
  const isLoading = isLoadingMarcas || isLoadingBusqueda;

  // ✅ TEMPORAL: Comenta esta línea para probar
  // if (!statePermiso) {
  //   return <BloqueoPagina />;
  // }

  if (isLoading) {
    return <SpinnerLoader/>;
  }
  
  if (errorMarcas) {
    return (
      <div className="flex justify-center items-center p-8">
        <span className="text-red-500">Error al cargar las marcas...</span>
      </div>
    );
  }

  // ✅ TEMPORAL: Permite acceso mientras solucionamos
  const accesoPermitido = true; // statePermiso; // Cambia a esto una vez solucionado

  if (!accesoPermitido) {
    return <BloqueoPagina />;
  }

  return (
    <MarcaTemplate 
      data={marcasMostrar}
      buscador={buscador}
      onBuscadorChange={setBuscador}
      onRecargar={refetchMarcas}
    />
  );
}