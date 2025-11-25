import styled from "styled-components";
import fondocuadros from "../../assets/fondocuadros.svg";
import { Device } from "../../styles/breakpoints";
import { v } from "../../styles/variables";
import { useEmpresaStore } from "../../store/EmpresaStore";

// Importación de iconos necesarios para las opciones
import { FaCog, FaExchangeAlt, FaChartBar } from 'react-icons/fa'; 

// =========================================================================
// 1. Componente de Opciones (CardOption)
// =========================================================================

const CardOption = ({ icon, text, href }) => {
  return (
    <CardOptionContainer as="a" href={href}>
      <div className="icon-wrapper">
        {icon}
      </div>
      <span>{text}</span>
    </CardOptionContainer>
  );
};

// =========================================================================
// 2. Componente Principal (BannerHome)
// =========================================================================

export function BannerHome() {
  const { dataempresa } = useEmpresaStore();
  
  return (
    <Container>
      <div className="content-wrapper-context" style={{ backgroundColor: "#fcfcfcff"}}>
        <span className="titulo" style={{textDecorationColor: "#000000"}}>
          {<v.iconoempresa />}
          Bienvenido/a FAELKAS_inv
        </span>
        <div className="content-text">
          FAELKAS_inv, Tu solución integral para la gestión de inventario inteligente.
        </div>

        <ContentOptions>
          <CardOption
            icon={<FaCog />}
            text="Opciones"
            href="/configurar"
          />
          <CardOption
            icon={<FaExchangeAlt />}
            text="Entradas y Salidas"
            href="/kardex"
          />
          <CardOption
            icon={<FaChartBar />}
            text="Reportes"
            href="/reportes"
          />
        </ContentOptions>
      </div>

      {/* ======================= SVGs de Fondo (Visual) ======================= */}
      <div className="contentsvg">
        <svg
          viewBox="0 0 492 253"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g filter="url(#filter0_f_934_1718)">
            <path
              d="M436.631 215.884C513.562 314.19 490.786 459.853 385.76 541.232C280.733 622.611 133.227 608.889 56.2961 510.583C-20.6352 412.277 2.14047 266.613 107.167 185.234C212.193 103.855 359.699 117.578 436.631 215.884Z"
              fill="#CC5555"
            ></path>
            <path
              d="M436.631 285.2C513.562 383.506 490.786 529.169 385.76 610.548C280.733 691.927 133.227 678.205 56.2961 579.899C-20.6352 481.593 2.14047 335.93 107.167 254.551C212.193 173.172 359.699 186.894 436.631 285.2Z"
              fill="white"
            ></path>
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
              <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
              <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend>
              <feGaussianBlur stdDeviation="65.7243" result="effect1_foregroundBlur_934_1718"></feGaussianBlur>
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
    </Container>
  );
}

// =========================================================================
// 3. Styled Components (PREDOMINA CÓDIGO 1)
// =========================================================================

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 0 solid #6b6b6b;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat, repeat;
  overflow: hidden;
  transition: cubic-bezier(0.4, 0, 0.2, 1) 0.6s;

  .cuadros {
    transition: cubic-bezier(0.4, 0, 0.2, 1) 0.6s;
    position: absolute;
    height: 100%;
    width: 100%;
    bottom: 0;
    transition: 0.6s;
  }

  .contentsvg {
    transition: cubic-bezier(0.4, 0, 0.2, 1) 0.6s;
    position: absolute;
    height: 100%;
    width: 100%;
    bottom: -500px;
    opacity: 0;
    svg {
      width: 100%;
      height: 100%;
    }
  }

  &:hover {
    border: 1px solid #4d4d4d;
    .contentsvg {
      bottom: -100px;
      opacity: 1;
    }
    .cuadros {
      transform: rotate(37deg) rotateX(5deg) rotateY(12deg) rotate(3deg)
        skew(2deg) skewY(1deg) scaleX(1.2) scaleY(1.2);
      color: red;
    }
  }

  @media ${Device.laptop} {
    width: 100%;
  }

  .content-wrapper-context {
    padding: 20px;
    gap: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    z-index: 1; /* Mantener por encima de los fondos */

    .titulo {
      font-size: 30px;
      font-weight: 700;
      gap: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      color: black;
      text-shadow: 0 2px 4px rgba(0,0,0,0.5); /* Sombra para mejor legibilidad */
      
      svg {
        color: #007bff;
      }
    }

    .content-text {
      font-weight: 400;
      font-size: 16px;
      line-height: 1.7em;
      display: -webkit-box;
      -webkit-line-clamp: 4;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      color: rgba(127, 104, 104, 0.9);
      text-shadow: 0 1px 2px rgba(0,0,0,0.5);
      max-width: 600px;
    }
  }

  /* Media queries responsivos */
  @media (max-width: 768px) {
    .content-wrapper-context {
      padding: 15px;
      
      .titulo {
        font-size: 24px;
        flex-direction: column;
        gap: 5px;
      }
      
      .content-text {
        font-size: 14px;
        -webkit-line-clamp: 3;
      }
    }
  }

  @media (max-width: 480px) {
    .content-wrapper-context {
      padding: 10px;
      
      .titulo {
        font-size: 20px;
      }
      
      .content-text {
        font-size: 13px;
      }
    }
  }
`;

const ContentOptions = styled.section`
  display: flex;
  gap: 25px;
  padding-top: 20px;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;

  @media (max-width: 768px) {
    gap: 15px;
  }

  @media (max-width: 480px) {
    gap: 10px;
  }
`;

const CardOptionContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 120px;
  background-color: rgba(255, 255, 255, 0.95); /* Fondo semi-transparente */
  backdrop-filter: blur(10px); /* Efecto glass */
  border: 1px solid rgba(99, 85, 85, 0.47);
  border-radius: 10px;
  padding: 10px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  text-decoration: none;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
    border-color: rgba(79, 23, 23, 0.4);
    transform: translateY(-5px);
  }

  .icon-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 60px;
    height: 60px;
    border: 2px solid #007bff;
    border-radius: 50%;
    margin-bottom: 8px;
    background-color: rgba(255, 255, 255, 0.1);
  }

  svg {
    font-size: 25px;
    color: #007bff;
  }

  span {
    font-size: 16px;
    font-weight: 600;
    color: black;
    text-align: center;
    text-shadow: 0 1px 2px rgba(0,0,0,0.5);
  }

  @media (max-width: 768px) {
    width: 90px;
    height: 90px;
    
    .icon-wrapper {
      width: 50px;
      height: 50px;
    }
    
    svg {
      font-size: 20px;
    }
    
    span {
      font-size: 14px;
    }
  }

  @media (max-width: 480px) {
    width: 80px;
    height: 80px;
    
    .icon-wrapper {
      width: 45px;
      height: 45px;
    }
    
    svg {
      font-size: 18px;
    }
    
    span {
      font-size: 12px;
    }
  }
`;