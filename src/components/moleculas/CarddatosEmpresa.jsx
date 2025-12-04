import styled from "styled-components";

export function CardDatosEmpresa({ titulo, valor, img }) {
  return (
    <Container>
      <div className="card">
        <div className="pricing-block-content">
          <p className="pricing-plan">{titulo}</p>
          <div className="price-value">
            <div className="valor-content">
              {valor}
            </div>
            {img && (
              <div className="icon-container">
                {typeof img === 'string' ? (
                  <span className="icon-text">{img}</span>
                ) : (
                  img
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
}

const Container = styled.div`
  z-index: 1;
  
  .card {
    width: 100%;
    background: #fffefe;
    padding: 1.5rem;
    border-radius: 1rem;
    border: 0.5vmin solid #05060f;
    box-shadow: 0.4rem 0.4rem #05060f;
    overflow: hidden;
    color: black;
    height: 100%;
    transition: transform 0.2s;
    
    &:hover {
      transform: translateY(-2px);
    }
  }

  .pricing-block-content {
    display: flex;
    flex-direction: column;
    height: 100%;
    gap: 0.75rem;
  }

  .pricing-plan {
    color: #05060f;
    font-size: 1.1rem;
    line-height: 1.25;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }

  .price-value {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    flex: 1;
    
    .valor-content {
      flex: 1;
      color: #05060f;
      font-size: 1.2rem;
      line-height: 1.4;
      font-weight: 500;
      word-break: break-word;
    }
    
    .icon-container {
      display: flex;
      align-items: center;
      justify-content: center;
      color: #4f46e5;
      
      .icon-text {
        font-size: 2rem;
      }
    }
  }
`;