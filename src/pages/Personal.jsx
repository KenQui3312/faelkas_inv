import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { SpinnerLoader } from "../components/moleculas/SpinnerLoader";
import { PersonalTemplate } from "../components/templates/PersonalTemplate";
import { usePermisosStore, BloqueoPagina } from "../index";
import { MostrarUsuariosTodos, MostrarModulos } from "../index";

export function Personal() {
  // Verificar permisos del usuario para acceder al módulo Personal
  const { datapermisos } = usePermisosStore();
  const statePermiso = datapermisos.some((objeto) =>
    objeto.modulos.nombre.includes("Personal")
  );

  const [buscador, setBuscador] = useState("");

  // ✅ QUERY SIMPLIFICADA: Cargar TODOS los usuarios sin filtro de empresa
  const { 
    data: usuarios = [], 
    isLoading: isLoadingUsuarios, 
    error: errorUsuarios,
    refetch: refetchUsuarios 
  } = useQuery({
    queryKey: ["usuarios-personal"],
    queryFn: () => {
      console.log("🔄 Cargando TODOS los usuarios...");
      return MostrarUsuariosTodos(); // ✅ Sin parámetros - mostrará todos
    },
  });

  // ✅ QUERY: Módulos
  const { 
    data: modulos = [], 
    isLoading: isLoadingModulos 
  } = useQuery({
    queryKey: ["mostrar-modulos"],
    queryFn: () => MostrarModulos(),
  });

  // ✅ Filtrar usuarios localmente
  const usuariosFiltrados = useMemo(() => {
    if (!buscador.trim()) return usuarios;
    
    return usuarios.filter(usuario =>
      usuario.nombres?.toLowerCase().includes(buscador.toLowerCase()) ||
      usuario.correo?.toLowerCase().includes(buscador.toLowerCase()) ||
      usuario.nro_doc?.toLowerCase().includes(buscador.toLowerCase()) ||
      usuario.tipouser?.toLowerCase().includes(buscador.toLowerCase())
    );
  }, [buscador, usuarios]);

  // ✅ Estados combinados
  const isLoading = isLoadingUsuarios || isLoadingModulos;

  // ✅ DEBUG
  console.log('📊 Usuarios cargados:', usuarios);
  console.log('🔍 Búsqueda actual:', buscador);
  console.log('✅ ¿Tiene permisos?:', statePermiso);

  // Bloquear acceso si no tiene permisos
  if (!statePermiso) {
    return <BloqueoPagina />;
  }

  if (isLoading) {
    return <SpinnerLoader />;
  }

  if (errorUsuarios) {
    return (
      <div className="flex justify-center items-center p-8">
        <span className="text-red-500">Error al cargar los usuarios: {errorUsuarios.message}</span>
      </div>
    );
  }

  return (
    <PersonalTemplate 
      data={usuariosFiltrados}
      buscador={buscador}
      onBuscadorChange={setBuscador}
      onRecargar={refetchUsuarios}
      modulos={modulos}
    />
  );
}