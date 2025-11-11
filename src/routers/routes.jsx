import { Routes, Route } from "react-router-dom";
// React Router DOM para definir rutas y navegación en la aplicación.

import {
  Login,
  Home,
  ProtectedRoute,
  Configuracion,
  Categorias,
  Productos,
  Marca,
  Personal,
  Empresa,
  Kardex,
  Reportes,
  StockActualPorProducto,
  StockBajoMinimo,
  KardexEntradaSalida,
  StockInventarioValorado,
} from "../index";
// Importa todos los componentes de páginas y templates desde el índice principal.

import StockActualTodos from "../components/organismos/report/StockActualTodos";
// Componente específico de reporte: stock actual de todos los productos.

import { Layout } from "../hooks/Layout";
// Componente Layout que envuelve las páginas autenticadas para mostrar navbar, sidebar, etc.

export function MyRoutes() {
  // Componente principal de rutas de la aplicación.
  // Define todas las rutas y su nivel de protección según autenticación.

  return (
    <Routes>
      {/* Ruta de login, accesible solo para usuarios no autenticados */}
      <Route
        path="/login"
        element={
          <ProtectedRoute accessBy="non-authenticated">
            <Login />
          </ProtectedRoute>
        }
      />

      {/* Ruta principal "/" para usuarios autenticados */}
      <Route
        path="/"
        element={
          <ProtectedRoute accessBy="authenticated">
            <Layout>
              <Home />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Configuración de usuarios */}
      <Route
        path="/configurar/usuarios"
        element={
          <ProtectedRoute accessBy="authenticated">
            <Layout>
              <Personal />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Página principal de configuración */}
      <Route
        path="/configurar"
        element={
          <ProtectedRoute accessBy="authenticated">
            <Layout>
              <Configuracion />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Configuración de categorías */}
      <Route
        path="/configurar/categorias"
        element={
          <ProtectedRoute accessBy="authenticated">
            <Layout>
              <Categorias />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Configuración de productos */}
      <Route
        path="/configurar/productos"
        element={
          <ProtectedRoute accessBy="authenticated">
            <Layout>
              <Productos />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Configuración de marcas */}
      <Route
        path="/configurar/marca"
        element={
          <ProtectedRoute accessBy="authenticated">
            <Layout>
              <Marca />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Configuración de empresa */}
      <Route
        path="/configurar/empresa"
        element={
          <ProtectedRoute accessBy="authenticated">
            <Layout>
              <Empresa />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Módulo Kardex */}
      <Route
        path="/kardex"
        element={
          <ProtectedRoute accessBy="authenticated">
            <Layout>
              <Kardex />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Módulo Reportes */}
      <Route
        path="/reportes"
        element={
          <ProtectedRoute accessBy="authenticated">
            <Layout>
              <Reportes />
            </Layout>
          </ProtectedRoute>
        }
      >
        {/* Subrutas de reportes */}
        <Route path="stock-actual-todos" element={<StockActualTodos />} />
        <Route
          path="stock-actual-por-producto"
          element={<StockActualPorProducto />}
        />
        <Route path="stock-bajo-minimo" element={<StockBajoMinimo />} />
        <Route
          path="kardex-entradas-salidas"
          element={<KardexEntradaSalida />}
        />
        <Route
          path="inventario-valorado"
          element={<StockInventarioValorado />}
        />
      </Route>
    </Routes>
  );
}

