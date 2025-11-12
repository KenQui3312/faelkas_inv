import styled from "styled-components";
import {
  Btnfiltro,
  Buscador,
  ContentFiltro, // Se mantiene este import
  Header,
  RegistrarCategorias,
  TablaCategorias,
  Title,
  useCategoriasStore, // Se mantiene el useCategoriasStore
  useOperaciones, // Se agrega el useOperaciones del remoto
  v,
  Lottieanimacion, // Se agrega Lottie
} from "../../index";
import { useState } from "react";
// Se agregan los imports de animacion del remoto
import vacioverde from "../../assets/vacioverde.json";
import vaciorojo from "../../assets/vaciorojo.json";

export function CategoriasTemplate({ data }) {
  const [openRegistro, SetopenRegistro] = useState(false);
  const [accion, setAccion] = useState("");
  const [dataSelect, setdataSelect] = useState([]);
  const [state, setState] = useState(false);
  
  // Lógica del remoto
  const [stateTipo, setStateTipo] = useState(false);
  const { colorCategoria, tituloBtnDes, bgCategoria, setTipo, tipo } =
    useOperaciones();
  
  // Lógica del local
  const { setBuscador } = useCategoriasStore();

  function cambiarTipo(p) {
    setTipo(p);
    setStateTipo(!stateTipo);
    setState(false);
  }

  function cerrarDesplegables() {
    setStateTipo(false);
    setState(false);
  }
  function openTipo() {
    setStateTipo(!stateTipo);
    setState(false);
  }
  function openUser() {
    setState(!state);
    setStateTipo(false);
  }
  
  // Lógica de registro combinada
  function nuevoRegistro() {
    SetopenRegistro(!openRegistro);
    setAccion("Nuevo");
    setdataSelect([]);
  }
  
  // Se remueve el uso de setState local
  
  return (
    <Container onClick={cerrarDesplegables}>
      {openRegistro && (
        <RegistrarCategorias
          dataSelect={dataSelect}
          onClose={() => SetopenRegistro(!openRegistro)}
          accion={accion}
        />
      )}

      <header className="header">
        <Header stateConfig={{ state: state, setState: openUser }} />
      </header>

      {/* Título de la sección del remoto */}
      <section className="tipo">
        <Title>Categoria de productos</Title>
      </section>
      
      {/* Buscador del local */}
      <section className="area1">
        <Buscador setBuscador={setBuscador} />
      </section>

      {/* ContentFiltro y botón de nuevo registro - se usa la lógica del local pero el estilo del remoto para el botón */}
      <section className="area2">
        <ContentFiltro>
          <Btnfiltro
            funcion={nuevoRegistro}
            bgcolor={bgCategoria || "#f6f3f3"} // Se usa la lógica de estilos del remoto
            textcolor={colorCategoria || "#353535"}
            icono={<v.agregar />}
          />
        </ContentFiltro>
      </section>

      <section className="main">
        {/* Lottie de Vacío del remoto */}
        {data.length == 0 && (
          <Lottieanimacion
            alto="300"
            ancho="300"
            animacion={tipo == "i" ? vacioverde : vaciorojo}
          />
        )}
        <TablaCategorias
          data={data}
          SetopenRegistro={SetopenRegistro}
          setdataSelect={setdataSelect}
          setAccion={setAccion}
        />
      </section>
    </Container>
  );
}

const Container = styled.div`
  min-height: 100vh;
  padding: 15px;
  width: 100%;

  color: ${({ theme }) => theme.text};
  display: grid;
  grid-template:
    "header" 100px
    "tipo" 100px /* Se mantiene el tipo del remoto */
    "area1" 100px /* Se agrega area1 para buscador */
    "area2" 50px
    "main" auto;

  .header {
    grid-area: header;
    /* background-color: rgba(103, 93, 241, 0.14); */
    display: flex;
    align-items: center;
  }
  
  .tipo {
    grid-area: tipo;
    /* background-color: rgba(229, 67, 26, 0.14); */
    display: flex;
    align-items: center;
  }

  .area1 {
    grid-area: area1;
    /* Agregado para el buscador */
    display: flex;
    align-items: center;
  }
  
  .area2 {
    grid-area: area2;
    /* background-color: rgba(77, 237, 106, 0.14); */
    display: flex;
    align-items: center;
    justify-content: end;
  }
  .main {
    grid-area: main;
    /* background-color: rgba(179, 46, 241, 0.14); */
  }
`;
