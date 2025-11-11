import { useQuery } from "@tanstack/react-query";
// React Query para manejar consultas asincrónicas con caché.

import { useEmpresaStore } from "../store/EmpresaStore";
// Store para obtener la empresa actualmente seleccionada.

import { SpinnerLoader } from "../components/moleculas/SpinnerLoader";
// Componente para mostrar un loader mientras se cargan los datos.

import { PersonalTemplate } from "../components/templates/PersonalTemplate";
// Template visual que renderiza la información del personal.

import { useGlobalStore } from "../store/GlobalStore";
// Store global para funciones y estados compartidos, como mostrar módulos.

import { useUsuariosStore } from "../store/UsuariosStore";
// Store de usuarios: funciones y estados para mostrar y gestionar los usuarios.

import { usePermisosStore } from "../store/PermisosStore";
// Store de permisos del usuario.

import { BloqueoPagina } from "../components/moleculas/BloqueoPagina";
// Componente que bloquea la pantalla si el usuario no tiene permisos.

export function Personal() {
  // Obtiene los permisos del usuario
  const { datapermisos } = usePermisosStore();

  // Verifica si el usuario tiene acceso al módulo "Personal"
  const statePermiso = datapermisos.some((objeto) =>
    objeto.modulos.nombre.includes("Personal")
  );

  // Stores de usuarios
  const { mostrarUsuariosTodos, datausuariosTodos } = useUsuariosStore();

  // Store de marcas (se usa para obtener el texto del buscador)
  const { buscador } = useMarcaStore();

  // Store de empresa
  const { dataempresa } = useEmpresaStore();

  // Store global para mostrar módulos
  const { mostrarModulos } = useGlobalStore();

  // React Query: obtiene todos los usuarios asociados a la empresa
  const { data, isLoading, error } = useQuery({
    queryKey: ["mostrar usuarios todos", dataempresa?.id], // Clave única para caché
    queryFn: () => mostrarUsuariosTodos({ _id_empresa: dataempresa?.id }), // Función que consulta los usuarios
    enabled: !!dataempresa, // Solo se ejecuta si hay empresa seleccionada
  });

  // React Query: obtiene los módulos del sistema
  const { data: modulos } = useQuery({
    queryKey: ["mostrar modulos"], // Clave única para caché
    queryFn: mostrarModulos, // Función que consulta los módulos
  });

  // Bloquea la página si el usuario no tiene permisos
  if (statePermiso == false) return <BloqueoPagina state={statePermiso} />;

  // Render condicional: muestra loader mientras se cargan los datos
  if (isLoading) {
    return <SpinnerLoader />;
  }

  // Render condicional: si ocurre un error, muestra mensaje de error
  if (error) {
    return <span>Error...{error.message}</span>;
  }

  // Render principal: envía los datos de usuarios al template visual
  return (
    <>
      <PersonalTemplate data={datausuariosTodos} />
    </>
  );
}

      <PersonalTemplate data={datausuariosTodos} />
    </>
  );
}
