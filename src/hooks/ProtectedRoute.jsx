import { Navigate, Outlet } from "react-router-dom";
import { UserAuth } from "../context/AuthContent";

export const ProtectedRoute = ({ children, accessBy }) => {
  const { user } = UserAuth();

  switch (accessBy) {
    case "non-authenticated":
      // Solo usuarios NO logueados (login, register, etc.)
      return !user ? children : <Navigate to="/" replace />;
    
    case "authenticated":
      // Solo usuarios logueados
      return user ? (children || <Outlet />) : <Navigate to="/login" replace />;
    
    default:
      // Por defecto, requerir autenticación
      return user ? (children || <Outlet />) : <Navigate to="/login" replace />;
  }
};