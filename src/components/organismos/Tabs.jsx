import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import {
  v,
  useMovimientosStore,
  useOperaciones,
  useUsuariosStore,
  TablaKardex,
  useKardexStore,
} from "../../index";
import { Device } from "../../styles/breakpoints";
import { useQuery } from "@tanstack/react-query";

// Componente de pestañas (tabs) para navegación entre diferentes vistas
export function Tabs() {
  // Estado para controlar la pestaña activa
  const [activeTab, setactiveTab] = useState(0);
  
  // Estado para los estilos del deslizador (glider) animado
  const [gliderStyle, setGliderStyle] = useState({});
  
  // Referencia para acceder a los elementos DOM de las pestañas
  const tabsRef = useRef([]);

  // Función para manejar el clic en una pestaña
  const handleClick = (index) => {
    setactiveTab(index);
  };

  // Efecto para calcular y actualizar la posición del deslizador
  useEffect(() => {
    const tab = tabsRef.current[activeTab];
    if (tab) {
      const rect = tab.getBoundingClientRect();
      const parentRect = tab.parentElement.getBoundingClientRect();

      // Determinar si el diseño es horizontal (tablet/desktop) o vertical (mobile)
      const isHorizontal = window.innerWidth >= 768;

      // Calcular estilos del deslizador según la orientación
      setGliderStyle({
        width: isHorizontal ? rect.width : "100%",
        height: isHorizontal ? "4px" : rect.height,
        transform: isHorizontal
          ? `translateX(${rect.left - parentRect.left}px)`
          : `translateY(${rect.top - parentRect.top}px)`,
      });
    }
  }, [activeTab]);

  // Obtener datos y funciones de los stores
  const { idusuario } = useUsuariosStore();
  const { datakardex } = useKardexStore();
  const { año, mes, tipo } = useOperaciones();
  const { dataRptMovimientosAñoMes, rptMovimientosAñoMes } = useMovimientosStore();

  // Query para obtener reporte de movimientos por año y mes
  const { isLoading, error } = useQuery({
    queryKey: ["reporte-movimientos", año, mes, tipo, idusuario],
    queryFn: () =>
      rptMovimientosAñoMes({
        año,
        mes,
        tipocategoria: tipo,
        idusuario,
      }),
  });

  // Manejar estados de carga y error
  if (isLoading) return <h1>Cargando...</h1>;
  if (error) return <h1>Error</h1>;

  return (
    <Container className="container">
      {/* Lista de pestañas */}
      <ul className="tabs">
        {/* Renderizar pestañas - actualmente solo "Kardex" */}
        {["Kardex"].map((label, i) => (
          <li
            key={i}
            ref={(el) => (tabsRef.current[i] = el)}
            className={activeTab === i ? "active" : ""}
            onClick={() => handleClick(i)}
          >
            {i === 0 && <v.iconopie />}
            {label}
          </li>
        ))}

        {/* Deslizador animado que sigue la pestaña activa */}
        <span className="glider" style={gliderStyle}></span>
      </ul>

      {/* Contenido de las pestañas */}
      <div className="tab-content">
        {/* Contenido para la pestaña 0 (Kardex) */}
        {activeTab === 0 && (
          <TablaKardex
            data={datakardex}
            filtros={{ anio: año, mes: mes }}
            SetopenRegistro={() => {}}
            setdataSelect={() => {}}
            setAccion={() => {}}
          />
        )}
      </div>
    </Container>
  );
}

// Estilos del componente usando styled-components
const Container = styled.div`
  position: relative;
  width: 100%;
  border: 1px solid #6a6b6c;
  border-radius: 15px;
  height: 100%;

  .tabs {
    list-style: none;
    display: flex;
    position: relative;
    flex-direction: column;

    /* Cambiar a diseño horizontal en tablets y mayores */
    @media ${Device.tablet} {
      flex-direction: row;
    }

    li {
      gap: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 54px;
      padding: 0 20px;
      font-size: 1.25rem;
      font-weight: 500;
      border-radius: 99px;
      cursor: pointer;
      transition: color 0.15s ease-in;

      /* Estilo para pestaña activa */
      &.active {
        color: #e05024;
      }
    }

    /* Estilos del deslizador animado */
    .glider {
      position: absolute;
      bottom: 0;
      background-color: #e05024;
      z-index: 1;
      border-radius: 15px;
      transition: transform 0.25s ease-out, width 0.25s, height 0.25s;
      box-shadow: 0px 10px 20px -3px #ff5722;
    }
  }

  .tab-content {
    margin-top: 20px;
    height: 100%;
    width: 100%;
  }
`;