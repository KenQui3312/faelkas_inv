import styled from "styled-components";
// Importa styled-components para definir estilos CSS en JS.
// En este archivo se define un contenedor `Container` al final, aunque actualmente no se usa.

import { LoginTemplate } from "../index";
// Importa el componente visual LoginTemplate, que contiene la estructura de la pantalla de login.

export function Login() {
  // Componente funcional principal que representa la pantalla de login.
  // Su propósito es renderizar el template de login.

  return (
    <>
      {/* Se renderiza el componente LoginTemplate */}
      <LoginTemplate />
    </>
  );
}

// Definición de un contenedor estilizado usando styled-components.
// Actualmente está vacío, pero se puede usar para envolver contenido o agregar estilos futuros.
const Container = styled.div``;
