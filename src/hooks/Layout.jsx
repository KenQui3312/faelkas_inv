import React, { useState, useEffect } from "react"; // ✅ Solo una importación
import styled from "styled-components";
import { useEmpresaStore } from "../store/EmpresaStore";
import { usePermisosStore } from "../store/PermisosStore";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "../components/organismos/sidebar/Sidebar";
import { Menuambur } from "../components/organismos/Menuambur";
import { Device } from "../styles/breakpoints";
import { useUsuariosStore } from "../store/UsuariosStore";
import { SpinnerLoader } from "../components/moleculas/SpinnerLoader";

export function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { mostrarUsuarios, datausuarios } = useUsuariosStore();
  const { mostrarEmpresa, dataempresa } = useEmpresaStore();
  const { mostrarPermisos } = usePermisosStore();

  // ✅ Consulta para usuarios - siempre ejecutar pero manejar null
  const {
    data: usuarios,
    isLoading: isLoadingUsuarios,
    error: errorUsuarios,
  } = useQuery({
    queryKey: ["mostrar usuarios"],
    queryFn: () => mostrarUsuarios(),
    retry: 1,
  });

  // ✅ Consulta para empresa - solo si hay usuario
  const {
    data: empresa,
    isLoading: isLoadingEmpresa,
    error: errorEmpresa,
  } = useQuery({
    queryKey: ["mostrar empresa", datausuarios?.id],
    queryFn: () => {
      if (!datausuarios?.id) {
        console.warn("ID de usuario no disponible para consulta de empresa");
        return null;
      }
      return mostrarEmpresa({ idusuario: datausuarios.id });
    },
    enabled: !!datausuarios?.id,
  });

  // ✅ Consulta para permisos - solo si hay usuario
  const {
    data: permisos,
    isLoading: isLoadingPermisos,
    error: errorPermisos,
  } = useQuery({
    queryKey: ["mostrar permisos", datausuarios?.id],
    queryFn: () => {
      if (!datausuarios?.id) {
        console.warn("ID de usuario no disponible para consulta de permisos");
        return [];
      }
      return mostrarPermisos({ id_usuario: datausuarios.id });
    },
    enabled: !!datausuarios?.id,
  });

  // ✅ Efecto para debuggear
  useEffect(() => {
    console.log("Estado actual:", {
      datausuarios,
      usuarios,
      empresa,
      dataempresa,
      permisos,
      isLoadingUsuarios,
      errorUsuarios,
    });
  }, [datausuarios, usuarios, empresa, dataempresa, permisos, isLoadingUsuarios, errorUsuarios]);

  // ✅ Loading state - solo si está cargando Y hay usuario
  if (isLoadingUsuarios && datausuarios) {
    return <SpinnerLoader />;
  }

  // ✅ Si no hay usuario autenticado, mostrar children directamente
  if (!datausuarios && !isLoadingUsuarios) {
    console.log("No hay usuario autenticado, mostrando contenido base");
    return (
      <Container className={sidebarOpen ? "active" : ""}>
        <div className="ContentSidebar">
          <Sidebar
            state={sidebarOpen}
            setState={() => setSidebarOpen(!sidebarOpen)}
          />
        </div>
        <div className="ContentMenuambur">
          <Menuambur />
        </div>
        <Containerbody>{children}</Containerbody>
      </Container>
    );
  }

  // ✅ Error state - solo si hay error Y estaba intentando cargar
  if (errorUsuarios && isLoadingUsuarios) {
    return <h1>Error al cargar los datos de usuario...</h1>;
  }

  return (
    <Container className={sidebarOpen ? "active" : ""}>
      <div className="ContentSidebar">
        <Sidebar
          state={sidebarOpen}
          setState={() => setSidebarOpen(!sidebarOpen)}
        />
      </div>
      <div className="ContentMenuambur">
        <Menuambur />
      </div>

      <Containerbody>
        {/* Mostrar loadings específicos para cada sección */}
        {isLoadingEmpresa && <SpinnerLoader size="small" />}
        {isLoadingPermisos && <SpinnerLoader size="small" />}
        
        {/* Mostrar errores específicos */}
        {errorEmpresa && (
          <div style={{ color: 'red', padding: '10px' }}>
            Error al cargar datos de empresa
          </div>
        )}
        {errorPermisos && (
          <div style={{ color: 'orange', padding: '10px' }}>
            Error al cargar permisos
          </div>
        )}
        
        {/* ✅ Pasar empresa como prop a los children */}
        {React.Children.map(children, child => 
          React.isValidElement(child) 
            ? React.cloneElement(child, { empresa: dataempresa?.[0] || empresa })
            : child
        )}
      </Containerbody>
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  background: ${({ theme }) => theme.bgtotal};
  transition: all 0.2s ease-in-out;

  .ContentSidebar {
    display: none;
  }
  .ContentMenuambur {
    display: block;
    position: absolute;
    left: 20px;
  }
  @media ${Device.tablet} {
    grid-template-columns: 65px 1fr;
    &.active {
      grid-template-columns: 220px 1fr;
    }
    .ContentSidebar {
      display: initial;
    }
    .ContentMenuambur {
      display: none;
    }
  }
`;

const Containerbody = styled.div`
  grid-column: 1;
  width: 100%;
  min-height: 100vh;
  position: relative;
  
  @media ${Device.tablet} {
    grid-column: 2;
  }
`;