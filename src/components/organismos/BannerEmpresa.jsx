import React from "react";
import styled from "styled-components";
import { 
  Header, 
  Title,
  CardDatosEmpresa,
  v
} from "../../index";

export function EmpresaTemplate({ datosEmpresa }) {
  return (
    <Container>
      <header className="header">
        {/* Pasar stateConfig vacío para evitar errores en DataUser */}
        <Header stateConfig={{}} />
      </header>
      
      <section className="main">
        {/* Banner principal con estilo de BannerEmpresa */}
        <BannerContainer>
          <div className="banner-content">
            <div className="banner-header">
              <span className="titulo">
                {<v.iconoempresa />}
                Información de la Empresa
              </span>
              <p className="subtitulo">Datos fiscales y generales</p>
            </div>
            
            <div className="banner-svg">
              <svg 
                viewBox="0 0 492 253" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <g filter="url(#filter0_f_934_1718)">
                  <path 
                    d="M436.631 215.884C513.562 314.19 490.786 459.853 385.76 541.232C280.733 622.611 133.227 608.889 56.2961 510.583C-20.6352 412.277 2.14047 266.613 107.167 185.234C212.193 103.855 359.699 117.578 436.631 215.884Z" 
                    fill="#C300E2"
                  />
                  <path 
                    d="M436.631 285.2C513.562 383.506 490.786 529.169 385.76 610.548C280.733 691.927 133.227 678.205 56.2961 579.899C-20.6352 481.593 2.14047 335.93 107.167 254.551C212.193 173.172 359.699 186.894 436.631 285.2Z" 
                    fill="white"
                  />
                </g>
                <defs>
                  <filter 
                    id="filter0_f_934_1718" 
                    x="-120.728" 
                    y="0.703659" 
                    width="734.383" 
                    height="794.376" 
                    filterUnits="userSpaceOnUse" 
                    colorInterpolationFilters="sRGB"
                  >
                    <feFlood 
                      floodOpacity="0"
                      result="BackgroundImageFix"
                    />
                    <feBlend 
                      mode="normal" 
                      in="SourceGraphic" 
                      in2="BackgroundImageFix" 
                      result="shape"
                    />
                    <feGaussianBlur 
                      stdDeviation="65.7243" 
                      result="effect1_foregroundBlur_934_1718"
                    />
                  </filter>
                </defs>
              </svg>
            </div>
            
            <svg
              className="cuadros"
              viewBox="0 0 492 317"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                opacity="0.40"
                d="M526 1L-34 1.00005M526 27.25L-34 27.2501M526 53.5L-34 53.5001M526 79.75L-34 79.7501M526 106L-34 106M526 132.25L-34 132.25M526 158.5L-34 158.5M526 184.75L-34 184.75M526 211L-34 211M526 237.25L-34 237.25M526 263.5L-34 263.5M526 289.75L-34 289.75M526 316L-34 316M-29.625 1V316M-3.375 1V316M22.875 1V316M49.125 1V316M75.375 1V316M101.625 1V316M127.875 1V316M154.125 1V316M180.375 1V316M206.625 1V316M232.875 1V316M259.125 1V316M285.375 1V316M311.625 1V316M337.875 1V316M364.125 1V316M390.375 1V316M416.625 1V316M442.875 1V316M469.125 1V316M495.375 1V316M521.625 1V316"
                stroke="url(#paint0_radial_932_3040)"
                strokeWidth="0.5"
              />
              <defs>
                <radialGradient
                  id="paint0_radial_932_3040"
                  cx="0"
                  cy="0"
                  r="1"
                  gradientUnits="userSpaceOnUse"
                  gradientTransform="translate(246 158.5) rotate(90) scale(212.625 212.625)"
                >
                  <stop offset="0.343728" stopColor="white" />
                  <stop offset="1" stopOpacity="0" />
                </radialGradient>
              </defs>
            </svg>
          </div>
        </BannerContainer>
        
        {/* Información Fiscal */}
        <InfoFiscalContainer>
          {/* Logo y Nombre */}
          <LogoNombreSection>
            <div className="logo-container">
              {datosEmpresa.logo ? (
                <img src={datosEmpresa.logo} alt="Logo" className="logo" />
              ) : (
                <div className="logo-placeholder">
                  <span>🏢</span>
                  <span className="logo-text">FAELKAS</span>
                </div>
              )}
            </div>
            
            <div className="nombre-container">
              <h2 className="nombre-empresa">FAELKAS SHOP</h2>
              <div className="identificacion-fiscal">
                <span className="icon">📋</span>
                <span className="text">{datosEmpresa.identificacionFiscal}</span>
              </div>
            </div>
          </LogoNombreSection>
          
          {/* Tarjetas de Información */}
          <CardsGrid>
            <CardDatosEmpresa 
              titulo="Dirección Fiscal"
              valor={datosEmpresa.direccionFiscal}
              img="📍"
            />
            
            <CardDatosEmpresa 
              titulo="Contacto"
              valor={
                <div className="contacto-info">
                  <div className="contacto-item">
                    <span className="icon">📞</span>
                    <span>{datosEmpresa.telefono}</span>
                  </div>
                  <div className="contacto-item">
                    <span className="icon">✉️</span>
                    <span>{datosEmpresa.email}</span>
                  </div>
                </div>
              }
              img="👥"
            />
          </CardsGrid>
          
          {/* Misión y Visión */}
          <MisionVisionSection>
            <div className="card mision">
              <div className="card-header">
                <span className="icon">🎯</span>
                <h4>Misión</h4>
              </div>
              <p className="card-content">{datosEmpresa.mision}</p>
            </div>
            
            <div className="card vision">
              <div className="card-header">
                <span className="icon">👁️</span>
                <h4>Visión</h4>
              </div>
              <p className="card-content">{datosEmpresa.vision}</p>
            </div>
          </MisionVisionSection>
        </InfoFiscalContainer>
      </section>
    </Container>
  );
}

// Estilos principales
const Container = styled.div`
  position: relative;
  min-height: 100vh;
  padding: 15px;
  width: 100%;
  background: ${({ theme }) => theme.bgtotal};
  color: ${({ theme }) => theme.text};
  display: grid;
  grid-template:
    "header" 100px
    "main" auto;

  .header {
    grid-area: header;
    display: flex;
    align-items: center;
  }
  
  .main {
    grid-area: main;
  }
`;

// Banner con estilo de BannerEmpresa
const BannerContainer = styled.div`
  position: relative;
  width: 100%;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 0 solid #6b6b6b;
  border-radius: 14px;
  overflow: hidden;
  margin-bottom: 20px;
  transition: cubic-bezier(0.4, 0, 0.2, 1) 0.6s;

  .banner-content {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .banner-header {
    position: relative;
    z-index: 2;
    text-align: center;
    padding: 20px;
    
    .titulo {
      font-size: 32px;
      font-weight: 700;
      gap: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      margin-bottom: 8px;
    }
    
    .subtitulo {
      font-weight: 400;
      font-size: 16px;
      color: rgba(255, 255, 255, 0.9);
    }
  }

  .banner-svg {
    transition: cubic-bezier(0.4, 0, 0.2, 1) 0.6s;
    position: absolute;
    height: 100%;
    width: 100%;
    bottom: -100px;
    opacity: 0.7;
    
    svg {
      width: 100%;
      height: 100%;
    }
  }

  .cuadros {
    transition: cubic-bezier(0.4, 0, 0.2, 1) 0.6s;
    position: absolute;
    height: 100%;
    width: 100%;
    bottom: 0;
    transition: 0.6s;
    opacity: 0.3;
  }

  &:hover {
    .banner-svg {
      bottom: -50px;
      opacity: 0.8;
    }
    
    .cuadros {
      transform: rotate(15deg) scaleX(1.1) scaleY(1.1);
    }
  }
`;

const InfoFiscalContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const LogoNombreSection = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid #e5e7eb;
  
  .logo-container {
    .logo {
      width: 100px;
      height: 100px;
      border-radius: 12px;
      object-fit: cover;
      border: 2px solid #e5e7eb;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    .logo-placeholder {
      width: 100px;
      height: 100px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 12px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: white;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      
      span {
        font-size: 24px;
        margin-bottom: 4px;
      }
      
      .logo-text {
        font-size: 14px;
        font-weight: bold;
        letter-spacing: 1px;
      }
    }
  }
  
  .nombre-container {
    flex: 1;
    
    .nombre-empresa {
      font-size: 2rem;
      color: #1f2937;
      margin: 0 0 12px 0;
      font-weight: 700;
    }
    
    .identificacion-fiscal {
      display: flex;
      align-items: center;
      gap: 10px;
      color: #6b7280;
      font-size: 1rem;
      background: #f9fafb;
      padding: 8px 12px;
      border-radius: 8px;
      display: inline-flex;
      
      .icon {
        font-size: 18px;
      }
      
      .text {
        font-weight: 500;
      }
    }
  }
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
  
  .contacto-info {
    display: flex;
    flex-direction: column;
    gap: 12px;
    
    .contacto-item {
      display: flex;
      align-items: center;
      gap: 10px;
      color: #374151;
      font-size: 1rem;
      
      .icon {
        font-size: 18px;
        opacity: 0.8;
      }
    }
  }
`;

const MisionVisionSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
  margin-top: 24px;
  
  .card {
    background: #f9fafb;
    border-radius: 12px;
    padding: 24px;
    transition: transform 0.3s, box-shadow 0.3s;
    
    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
    }
    
    &.mision {
      border-left: 5px solid #10b981;
      
      .icon {
        color: #10b981;
      }
    }
    
    &.vision {
      border-left: 5px solid #3b82f6;
      
      .icon {
        color: #3b82f6;
      }
    }
    
    .card-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
      
      h4 {
        font-size: 1.25rem;
        font-weight: 600;
        color: #1f2937;
        margin: 0;
      }
      
      .icon {
        font-size: 28px;
      }
    }
    
    .card-content {
      color: #4b5563;
      line-height: 1.7;
      margin: 0;
      font-size: 1rem;
    }
  }
`;