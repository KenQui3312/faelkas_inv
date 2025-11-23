import { useEmpresaStore } from "../store/EmpresaStore";
import { SpinnerLoader } from "../components/moleculas/SpinnerLoader";
import { EmpresaTemplate } from "../components/templates/EmpresaTemplate";
import { useQuery } from "@tanstack/react-query";
import { usePermisosStore } from "../store/PermisosStore";
import { Mensaje } from "../components/moleculas/Mensaje";
import { BloqueoPagina } from "../components/moleculas/BloqueoPagina";

export function Empresa() {
  const { datapermisos } = usePermisosStore();
  const statePermiso = datapermisos.some((objeto) =>
    objeto.modulos.nombre.includes("Tu empresa")
  );
  
  // if (statePermiso == false) {
  //   return <BloqueoPagina state={statePermiso}/>;
  // } 

  const { contarusuariosXempresa, dataempresa } = useEmpresaStore();
  
  // ✅ CORREGIDO: dataempresa es un OBJETO, no un array
  const empresa = dataempresa; // ✅ Directamente dataempresa, no dataempresa?.[0]

  // ✅ DEBUG MEJORADO
  console.log("=== DEBUG EMPRESA ===");
  console.log("🏢 DataEmpresa:", dataempresa);
  console.log("📦 Tipo de dataempresa:", typeof dataempresa);
  console.log("🔍 Es array?", Array.isArray(dataempresa));
  console.log("🆔 ID Empresa:", dataempresa?.id);

  // ✅ Query para el contador de usuarios
  const { data: contadorusuarios, isLoading: isLoadingContador } = useQuery({
    queryKey: ["contador de usuarios", dataempresa?.id],
    queryFn: () => {
      if (!dataempresa?.id) {
        console.warn("⚠️ No hay empresa disponible para contar usuarios");
        return 0;
      }
      console.log("🔢 Contando usuarios para empresa:", dataempresa.id);
      return contarusuariosXempresa({ id_empresa: dataempresa.id });
    },
    enabled: !!dataempresa?.id,
  });

  // ✅ Mostrar loading si está cargando el contador
  if (isLoadingContador) {
    return <SpinnerLoader />;
  }

  // ✅ Si no hay empresa, mostrar mensaje
  if (!dataempresa) {
    return (
      <div className="flex justify-center items-center p-8">
        <Mensaje tipo="warning">
          No se encontró información de la empresa. Contacta al administrador.
        </Mensaje>
      </div>
    );
  }

  return (
    <EmpresaTemplate contadorUsuarios={contadorusuarios || 0} />
  );
}