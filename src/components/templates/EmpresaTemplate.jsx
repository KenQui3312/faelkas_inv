import React, { useState } from "react"; // ✅ Agregar import de React
import styled from "styled-components";
import { Header, Btnfiltro, v, RegistrarCategorias, Title, Lottieanimacion, TablaCategorias, Buscador, RegistrarProductos, useProductosStore, TablaProductos, BannerEmpresa, ShapeSmall, ShapeSBig } from "../../index";
import vacio from "../../assets/vacio.json";

export function EmpresaTemplate({ contadorUsuarios = 0 }) { // ✅ Aceptar prop contadorUsuarios
  const [state, setState] = useState(false);
  const [openRegistro, SetopenRegistro] = useState(false);
  const [accion, setAccion] = useState("");
  const [dataSelect, setdataSelect] = useState([]);
  
  function nuevoRegistro() {
    SetopenRegistro(!openRegistro);
    setAccion("Nuevo");
    setdataSelect([]);
  }
  
  return (
    <Container>
      <header className="header">
        <Header
          stateConfig={{ state: state, setState: () => setState(!state) }}
        />
      </header>
      <section className="area1">
        <ContentFiltro>
          <Title>
            Tu empresa
          </Title>
          {/* ✅ Mostrar contador de usuarios */}
          <div style={{
            background: 'white',
            padding: '10px 15px',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}>
            <span style={{ fontSize: '14px', color: '#64748b' }}>Usuarios:</span>
            <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#3b82f6' }}>
              {contadorUsuarios}
            </span>
          </div>
        </ContentFiltro>
      </section>
      <section className="area2">
        {/* Puedes dejar este espacio para otros controles */}
      </section>
      <section className="main">
        <BannerEmpresa/>
      </section>
    </Container>
  );
}

const Container = styled.div`
  position:relative;
  min-height: 100vh;
  padding: 15px;
  width: 100%;
  background: ${({ theme }) => theme.bgtotal};
  color: ${({ theme }) => theme.text};
  display: grid;
  grid-template:
    "header" 100px
    "area1" 0px
    "area2" 60px
    "main" auto;

  .header {
    grid-area: header;
    display: flex;
    align-items: center;
  }
  .area1 {
    margin-top:15px;
    grid-area: area1;
    display: flex;
    align-items: center;
  }
  .area2 {
    grid-area: area2;
    display: flex;
    align-items: center;
    justify-content:end;
  }
  .main {
    grid-area: main;
  }
`;

const ContentFiltro = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between; /* ✅ Título a la izquierda, contador a la derecha */
  align-items: center;
  width:100%;
  gap:15px;
`;