import styled from "styled-components";
import { ConfiguracionTemplate, Fondo1 } from "../index";
// Componente principal de Configuración
export function Configuracion() {
  return (
    <Container>
       {/* Renderiza el template de configuración */}
      <ConfiguracionTemplate />
    
    </Container>
  );
}
// Contenedor principal con estilos usando styled-components
const Container = styled.main`
 height: 100vh;
`;
