import styled from "styled-components";
import { v } from "../../index";

export function Selector({ color, state, funcion, texto1, texto2 }) {
  const displayText = typeof texto2 === 'string' 
    ? texto2 
    : (typeof texto2 === 'object' && texto2 !== null 
        ? texto2.descripcion || texto2.nombre || JSON.stringify(texto2) 
        : String(texto2 || ""));

  return (
    <Container color={color} onClick={funcion}>
      <div>
        <span>{texto1}</span>
        <span>{displayText}</span>
      </div>
      <span className={state ? "open" : "close"}>{<v.iconoFlechabajo />}</span>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  cursor: pointer;
  border: 2px solid ${(props) => props.color};
  border-radius: 10px;
  padding: 10px;
  gap: 10px;
  transition: 0.3s;
  font-weight: 600;
  box-shadow: 4px 9px 20px -12px ${(props) => props.color};

  .open {
    transition: 0.3s;
    transform: rotate(0deg);
  }
  .close {
    transition: 0.3s;
    transform: rotate(180deg);
  }
  &:hover {
    background-color: ${(props) => props.color};
    color: #000;
  }
`;