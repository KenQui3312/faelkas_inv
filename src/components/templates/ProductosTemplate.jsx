// src\components\templates\ProductosTemplate.jsx:
import styled from "styled-components";
import { 
  Header, 
  Btnfiltro, 
  v, 
  Title, 
  Lottieanimacion, 
  Buscador, 
  RegistrarProductos, 
  TablaProductos 
} from "../../index";
import { useState } from "react";
import vacio from "../../assets/vacio.json";

export function ProductosTemplate({ 
  data, 
  categorias = [], 
  marcas = [], 
  onRecargar,
  buscador,
  onBuscadorChange 
}) {
  const [state, setState] = useState(false);
  const [openRegistro, SetopenRegistro] = useState(false);
  const [accion, setAccion] = useState("");
  const [dataSelect, setdataSelect] = useState([]);
  
  function nuevoRegistro() {
    SetopenRegistro(!openRegistro);
    setAccion("Nuevo");
    setdataSelect([]);
  }

  // ✅ Función unificada para editar
  const handleEditar = (datos) => {
    SetopenRegistro(true);
    setAccion("Editar");
    setdataSelect(datos);
  };

  // ✅ Función para manejar el cierre del registro y recargar datos
  const handleCloseRegistro = () => {
    SetopenRegistro(false);
    // Recargar los productos después de una operación CRUD
    if (onRecargar) {
      onRecargar();
    }
  };

  return (
    <Container>
      {openRegistro && (
        <RegistrarProductos
          dataSelect={dataSelect}
          onClose={handleCloseRegistro}
          accion={accion}
          categorias={categorias}
          marcas={marcas}
        />
      )}
      
      <header className="header">
        <Header
          stateConfig={{ state: state, setState: () => setState(!state) }}
        />
      </header>
      
      <section className="area1">
        <ContentFiltro>
          <Title>
            Productos - Todas las Empresas
          </Title>
          <Btnfiltro
            funcion={nuevoRegistro}
            bgcolor="#f6f3f3"
            textcolor="#353535"
            icono={<v.agregar />}
          />
        </ContentFiltro>
      </section>
      
      <section className="area2">
        <Buscador 
          setBuscador={onBuscadorChange}
          valor={buscador}
        />
      </section>
      
      <section className="main">
        {data?.length === 0 && (
          <Lottieanimacion
            alto="300"
            ancho="300"
            animacion={vacio}
          />
        )}

        <TablaProductos
          data={data}
          categorias={categorias}
          marcas={marcas}
          onEditar={handleEditar}
          onRecargar={onRecargar}
        />
      </section>
    </Container>
  );
}

const Container = styled.div`
  min-height: 100vh;
  padding: 15px;
  width: 100%;
  background: ${({ theme }) => theme.bgtotal};
  color: ${({ theme }) => theme.text};
  display: grid;
  grid-template:
    "header" 100px
    "area1" 100px
    "area2" 60px
    "main" auto;

  .header {
    grid-area: header;
    display: flex;
    align-items: center;
  }
  .area1 {
    grid-area: area1;
    display: flex;
    align-items: center;
  }
  .area2 {
    grid-area: area2;
    display: flex;
    align-items: center;
    justify-content: end;
  }
  .main {
    grid-area: main;
  }
`;

const ContentFiltro = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: end;
  width: 100%;
  gap: 15px;
`;