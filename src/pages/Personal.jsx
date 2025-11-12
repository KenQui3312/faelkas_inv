import { useQuery } from "@tanstack/react-query";
import { useEmpresaStore } from "../store/EmpresaStore";
import { SpinnerLoader } from "../components/moleculas/SpinnerLoader";
import { MarcaTemplate } from "../components/templates/MarcaTemplate";
import { useMarcaStore } from "../store/MarcaStore";
import { PersonalTemplate } from "../components/templates/PersonalTemplate";
import { useGlobalStore } from "../store/GlobalStore";
import { useUsuariosStore } from "../store/UsuariosStore";
import { usePermisosStore } from "../store/PermisosStore";
import { BloqueoPagina } from "../components/moleculas/BloqueoPagina";
// Componente principal para la gestión del Personal
export function Personal() {
  // Verificar permisos del usuario para acceder al módulo Personal
  const { datapermisos } = usePermisosStore();
  const statePermiso = datapermisos.some((objeto) =>
  objeto.modulos.nombre.includes("Personal")
);
  // Obtener funciones y datos de usuarios
  const { mostrarUsuariosTodos, datausuariosTodos } = useUsuariosStore();
  // Obtener buscador de marcas (posiblemente reutilizado)
  const { buscador } = useMarcaStore();
  // Obtener datos de la empresa
  const { dataempresa } = useEmpresaStore();
  // Obtener función para mostrar módulos
  const { mostrarModulos } = useGlobalStore();

  //mostrar data
  const { data, isLoading, error } = useQuery({
    queryKey: ["mostrar usuarios todos", dataempresa?.id],
    queryFn: () => mostrarUsuariosTodos({ _id_empresa: dataempresa?.id }),
    enabled: !!dataempresa,
  });
  //modulos 
  const { data: modulos } = useQuery({
    queryKey: ["mostrar modulos"],
    queryFn: mostrarModulos,
  });
    // Bloquear acceso si no tiene permisos
  if (statePermiso == false) return <BloqueoPagina state={statePermiso}/>;
  //respuestas
  if (isLoading) {
    return <SpinnerLoader />;
  }
  if (error) {
    return <span>Error...{error.message}</span>;
  }
 
  return (
    <>
    {/* Renderizar el template de personal con los datos de usuarios */}
      <PersonalTemplate data={datausuariosTodos} />
    </>
  );
}
