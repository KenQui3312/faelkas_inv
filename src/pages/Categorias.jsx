import { useQuery } from "@tanstack/react-query";
import { CategoriasProTemplate } from "../components/templates/CategoriasProTemplate";
import { useCategoriasStore } from "../store/CategoriasStore";
import { useEmpresaStore } from "../store/EmpresaStore";
import { SpinnerLoader } from "../components/moleculas/SpinnerLoader";
import { usePermisosStore, BloqueoPagina } from "../index";

export function Categorias() {
  // Todos los hooks deben declararse antes de cualquier condicional o return

  // 1. Hooks del store (Zustand): obtenemos estados y funciones relacionadas con categorías, permisos y empresa
  const { datapermisos } = usePermisosStore(); // Contiene los permisos del usuario
  const { mostrarCategorias, datacategorias, buscarCategorias, buscador } =
    useCategoriasStore(); // Funciones para obtener y buscar categorías, además del estado actual
  const { dataempresa } = useEmpresaStore(); // Datos de la empresa seleccionada en sesión

  // 2. React Query: consulta principal para obtener las categorías existentes en la empresa
  const { data, isLoading, error } = useQuery({
    queryKey: ["mostrar categorias", dataempresa?.id], // Clave que identifica la consulta en caché
    queryFn: () => mostrarCategorias({ idempresa: dataempresa.id }), // Llamada al backend usando función del store
    enabled: dataempresa?.id != null, // Se ejecuta únicamente si existe empresa seleccionada
  });

  // React Query secundaria: búsqueda de categorías filtradas por texto del buscador
  const { data: buscar } = useQuery({
    queryKey: ["buscar categorias", buscador], // Se vuelve a ejecutar cada vez que cambia el texto del buscador
    queryFn: async () => {
      // Si el buscador está vacío, no se realiza ninguna búsqueda
      if (!buscador || buscador.trim() === "") {
        return [];
      }
      
      // Si no existe empresa, evita ejecutar la consulta
      if (!dataempresa?.id) {
        return [];
      }
      
      // Ejecuta la búsqueda y retorna siempre un arreglo para evitar valores undefined
      const resultado = await buscarCategorias({ 
        descripcion: buscador, 
        id_empresa: dataempresa.id 
      });
      
      return resultado || [];
    },
    enabled: dataempresa?.id != null, // Se ejecuta únicamente si hay empresa
  });

  // Validación de permisos del usuario: verifica si el módulo "Categoria de productos" está permitido
  const statePermiso = datapermisos?.some((objeto) =>
    objeto.modulos.nombre.includes("Categoria de productos")
  );

  console.log(statePermiso); // Debug: imprime en consola si tiene permisos

  // Si el usuario no tiene permisos, bloquea el acceso a la página
  if (!statePermiso) {
    return <BloqueoPagina />;
  }

  // Si la consulta está cargando, se muestra un loader en pantalla
  if (isLoading) {
    return <SpinnerLoader />;
  }

  // Si ocurrió un error en la consulta, se muestra mensaje de error
  if (error) {
    return <span>Error...</span>;
  }

  // Render principal: envía las categorías obtenidas al template visual
  return (
    <>
      <CategoriasProTemplate data={datacategorias} />
    </>
  );
}
