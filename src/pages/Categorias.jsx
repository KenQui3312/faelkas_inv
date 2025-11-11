import { useQuery } from "@tanstack/react-query";
import { CategoriasProTemplate } from "../components/templates/CategoriasProTemplate";
import { useCategoriasStore } from "../store/CategoriasStore";
import { useEmpresaStore } from "../store/EmpresaStore";
import { SpinnerLoader } from "../components/moleculas/SpinnerLoader";
import { usePermisosStore, BloqueoPagina } from "../index";

export function Categorias() {
  // ✅ TODOS LOS HOOKS PRIMERO - en el mismo orden siempre
  
  // 1. Store hooks
  const { datapermisos } = usePermisosStore();
  const { mostrarCategorias, datacategorias, buscarCategorias, buscador } =
    useCategoriasStore();
  const { dataempresa } = useEmpresaStore();

  // 2. React Query hooks
  const { data, isLoading, error } = useQuery({
    queryKey: ["mostrar categorias", dataempresa?.id],
    queryFn: () => mostrarCategorias({ idempresa: dataempresa.id }),
    enabled: dataempresa?.id != null,
  });

  // ✅ CORREGIDO: Hook de búsqueda con manejo de undefined
  const { data: buscar } = useQuery({
    queryKey: ["buscar categorias", buscador],
    queryFn: async () => {
      // ✅ Si no hay término de búsqueda, retornar array vacío
      if (!buscador || buscador.trim() === "") {
        return [];
      }
      
      // ✅ Si no hay empresa, retornar array vacío
      if (!dataempresa?.id) {
        return [];
      }
      
      // ✅ Ejecutar búsqueda y asegurar retorno
      const resultado = await buscarCategorias({ 
        descripcion: buscador, 
        id_empresa: dataempresa.id 
      });
      
      // ✅ Asegurar que nunca retorne undefined
      return resultado || [];
    },
    enabled: dataempresa?.id != null, // ✅ Mantener habilitado incluso con buscador vacío
  });

  // ✅ LÓGICA CONDICIONAL DESPUÉS de todos los hooks
  const statePermiso = datapermisos?.some((objeto) =>
    objeto.modulos.nombre.includes("Categoria de productos")
  );

  console.log(statePermiso);

  // ✅ RETURNS CONDICIONALES al FINAL
  if (!statePermiso) {
    return <BloqueoPagina />;
  }

  if (isLoading) {
    return <SpinnerLoader />;
  }

  if (error) {
    return <span>Error...</span>;
  }

  // ✅ RENDER PRINCIPAL
  return (
    <>
      <CategoriasProTemplate data={datacategorias} />
    </>
  );
}