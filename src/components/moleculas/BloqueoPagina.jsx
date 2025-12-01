import styled from "styled-components";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function BloqueoPagina({ state, onClose, showCloseButton = true }) {
  const [visible, setVisible] = useState(true);
  const navigate = useNavigate(); // Hook para navegación
  
  const handleClose = () => {
    setVisible(false);
    if (onClose) onClose();
  };

  const handleGoHome = () => {
    setVisible(false);
    navigate("/"); // Navega al Home
  };

  if (state || !visible) return null;

  return (
    <Container>
      <Content>
        <span className="icono">💀</span>
        <span className="texto">No tienes permisos a este módulo</span>
        {showCloseButton && (
          <CloseButton onClick={handleClose}>✕</CloseButton>
        )}
      </Content>
      {showCloseButton && (
        <BackButton onClick={handleGoHome}>
          Regresar al menú principal
        </BackButton>
      )}
    </Container>
  );
}

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  background: rgba(26, 9, 9, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 20px;
`;

const Content = styled.div`
  position: relative;
  background: rgba(40, 15, 15, 0.9);
  border: 2px solid rgba(248, 42, 45, 0.7);
  border-radius: 10px;
  padding: 30px 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  min-width: 300px;
  max-width: 500px;
  
  .icono {
    font-size: 50px;
    margin-bottom: 10px;
  }
  
  .texto {
    font-size: 18px;
    font-weight: 500;
    text-align: center;
    color: #f8f8f8;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  color: #f8f8f8;
  font-size: 20px;
  cursor: pointer;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  
  &:hover {
    background: rgba(248, 42, 45, 0.3);
    transform: scale(1.1);
  }
`;

const BackButton = styled.button`
  background: rgba(248, 42, 45, 0.8);
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: rgba(248, 42, 45, 1);
    transform: translateY(-2px);
  }
`;