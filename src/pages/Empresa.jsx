import { useEmpresaStore } from "../store/EmpresaStore";
import { SpinnerLoader } from "../components/moleculas/SpinnerLoader";
import { EmpresaTemplate } from "../components/templates/EmpresaTemplate";
import { useQuery } from "@tanstack/react-query";
import { usePermisosStore } from "../store/PermisosStore";
import { Mensaje } from "../components/moleculas/Mensaje";
import { BloqueoPagina } from "../components/moleculas/BloqueoPagina";

export function Empresa() {

  // Obtiene desde el store de permisos la lista de permisos otorgados al usuario
  const { datapermisos } = usePermisosStore();

  // Verificación de permisos para el módulo "Tu empresa"
  // Se busca si en la lista de permisos existe un módulo con ese nombre
  const statePermiso = datapermisos.some((objeto) =>
    objeto.modulos.nombre.includes("Tu empresa")
  );

  // Si se quisiera bloquear la página en caso de no tener permisos,
  // esta sería la validación correcta (comentada porque el usuario la dejó así):
  //
  // if (statePermiso == false) {
  //   return <BloqueoPagina state={statePermiso}/>;
  // }

  // Obtiene funciones y datos del store de empresa (Zustand)
  const { contarusuariosXempresa, dataempresa } = useEmpresaStore();

  // React Query para consultar la cantidad de usuarios asociados a la empresa actual
  const { data: contadorusurios } = useQuery({
    queryKey: ["contador de usuarios", dataempresa?.id],      // Identificador único de caché
    queryFn: () => contarusuariosXempresa({ id_empresa: dataempresa?.id }), // Consulta al backend
    enabled: !!dataempresa,                                   // Solo se ejecuta si existe una empresa seleccionada
  });

  // Renderiza la plantilla principal del módulo de empresa
  return (
    <>
      <EmpresaTemplate />
    </>
  );
}

