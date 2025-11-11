import styled from "styled-components"; 
// Importa la librería styled-components, utilizada para crear estilos con CSS dentro de componentes React.
// Aunque en este archivo no se usa directamente, puede estar presente por consistencia o por futuros estilos.

import { HomeTemplate } from "../index";
// Importa el componente `HomeTemplate` desde el archivo de índice de componentes.
// Este template contiene la estructura visual de la pantalla de inicio.

export function Home() {
  // Componente funcional principal llamado "Home".
  // Su propósito es actuar como contenedor y renderizar el template correspondiente
  // a la pantalla de inicio del sistema.

  return (
    <HomeTemplate />
    // Se renderiza el componente visual HomeTemplate.
    // No se pasa ninguna propiedad porque el template se encarga de manejar su propio contenido.
  );
}

