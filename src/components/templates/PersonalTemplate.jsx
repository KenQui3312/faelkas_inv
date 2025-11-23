// src\components\templates\PersonalTemplate.jsx - VERSIÓN CORREGIDA
import styled from "styled-components";
import { 
  Header, 
  Btnfiltro, 
  v, 
  Title, 
  Lottieanimacion, 
  Buscador, 
  RegistrarPersonal, 
  TablaPersonal 
} from "../../index";
import { useState } from "react";
import vacio from "../../assets/vacio.json";

export function PersonalTemplate({ 
  data, 
  buscador, 
  onBuscadorChange, 
  onRecargar 
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

  // ✅ Función para editar personal
  const handleEditar = (datos) => {
    SetopenRegistro(true);
    setAccion("Editar");
    setdataSelect(datos);
  };

  // ✅ Función para cerrar registro y recargar
  const handleCloseRegistro = () => {
    SetopenRegistro(false);
    if (onRecargar) {
      onRecargar(); // Recargar datos después de operaciones CRUD
    }
  };

  return (
    <Container>
      {openRegistro && (
        <RegistrarPersonal 
          dataSelect={dataSelect}
          onClose={handleCloseRegistro}
          accion={accion}
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
            Personal
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
          setBuscador={onBuscadorChange} // ✅ Usar la prop correcta
          valor={buscador} // ✅ Pasar el valor actual del buscador
        />
      </section>
      
      <section className="main">
        {(!data || data.length === 0) && ( // ✅ Mejor verificación
          <Lottieanimacion
            alto="300"
            ancho="300"
            animacion={vacio}
          />
        )}

        <TablaPersonal
          data={data || []} // ✅ Asegurar array
          onEditar={handleEditar} // ✅ Pasar función de editar
          onRecargar={onRecargar} // ✅ Pasar función de recargar
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