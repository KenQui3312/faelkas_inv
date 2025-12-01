import styled from "styled-components";
import { FaSearch } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";

export function Buscador({ setBuscador, onFocus, funcion, valor = "" }) {
  const [inputValue, setInputValue] = useState(valor);
  const inputRef = useRef(null);

  // ✅ Sincronizar el valor interno con el valor externo
  useEffect(() => {
    setInputValue(valor);
  }, [valor]);

  // ✅ Manejar cambio con debounce
  function buscar(e) {
    const value = e.target.value;
    setInputValue(value);
    
    // Llamar a setBuscador después de un pequeño delay (debounce)
    setTimeout(() => {
      if (setBuscador) {
        setBuscador(value);
      }
    }, 300);
  }

  function ejecutarfuncion() {
    if (funcion) {
      funcion();
    }
  }

  // ✅ Manejar focus para asegurar visibilidad
  const handleFocus = (e) => {
    if (onFocus) {
      onFocus(e);
    }
    // Asegurar que el input esté visible
    if (inputRef.current) {
      inputRef.current.style.zIndex = "1000";
    }
  };

  return (
    <Container onClick={ejecutarfuncion}>
      <article className="content">
        <FaSearch className="icono" />
        <input 
          ref={inputRef}
          onFocus={handleFocus} 
          onChange={buscar} 
          value={inputValue}
          placeholder="...buscar productos" 
          className="buscador-input"
        />
      </article>
    </Container>
  );
}

const Container = styled.div`
  background-color: ${(props) => props.theme.bg};
  border-radius: 10px;
  height: 60px;
  align-items: center;
  display: flex;
  color: ${(props) => props.theme.text};
  border: 1px solid #414244;
  position: relative; /* ← IMPORTANTE: agregar posición relativa */
  z-index: 100; /* ← z-index base */

  .content {
    padding: 15px;
    gap: 10px;
    display: flex;
    align-items: center;
    position: relative;
    width: 100%;
    height: 100%;
    
    .icono {
      font-size: 18px;
      z-index: 101; /* Ícono sobre el input */
      position: relative;
    }
    
    .buscador-input {
      font-size: 18px;
      width: 100%;
      outline: none;
      background: none;
      border: 0;
      color: ${(props) => props.theme.text};
      position: relative;
      z-index: 102; /* ← Input sobre TODO */
      
      /* Quitar estilos por defecto que puedan interferir */
      &::-webkit-calendar-picker-indicator {
        display: none;
      }
      
      /* Para Firefox */
      &::-moz-list-bullet {
        display: none;
      }
      
      /* Evitar que el datalist se superponga */
      &[list] {
        &::-webkit-calendar-picker-indicator {
          display: none !important;
        }
      }
    }
    
    /* Estilos para cuando el input está enfocado */
    .buscador-input:focus {
      z-index: 1000 !important;
    }
  }
  
  /* Si tienes un datalist asociado, asegurar que esté debajo */
  datalist {
    z-index: 99 !important;
    position: absolute !important;
    top: 100% !important;
    left: 0 !important;
  }
`;