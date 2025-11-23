import styled from "styled-components";
import { FaSearch } from "react-icons/fa";
import { useState, useEffect } from "react";

export function Buscador({ setBuscador, onFocus, funcion, valor = "" }) {
  const [inputValue, setInputValue] = useState(valor);

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

  return (
    <Container onClick={ejecutarfuncion}>
      <article className="content">
        <FaSearch className="icono" />
        <input 
          onFocus={onFocus} 
          onChange={buscar} 
          value={inputValue}
          placeholder="...buscar productos" 
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
  .content {
    padding: 15px;
    gap: 10px;
    display: flex;
    align-items: center;
    position: relative;
    width: 100%;
    .icono {
      font-size: 18px;
    }
    input {
      font-size: 18px;
      width: 100%;
      outline: none;
      background: none;
      border: 0;
      color: ${(props) => props.theme.text};
    }
  }
`;