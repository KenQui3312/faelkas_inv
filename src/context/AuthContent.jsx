import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../index";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState([]);

  useEffect(() => {
    // Escucha los cambios de autenticacion (login, logout, refresh)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user == null) {
          setUser(null); // usuario desconectado
        } else {
          setUser(session.user); // usuario autenticado
          console.log("event", event);
          console.log("session USER", session.user);
        }
      }
    );

    // Limpia el listener al desmontar
    return () => {
      authListener.subscription;
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para acceder al usuario desde cualquier componente
export const UserAuth = () => {
  return useContext(AuthContext);
};
