import { createContext, useContext, useEffect, useState } from "react";
import * as Auth from "../services/AuthService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    // ✅ Restaurer immédiatement le user s’il est dans localStorage
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setReady(true);
      return;
    }

    // ✅ Sinon, si on a un token → vérifier avec l’API
    if (!token) {
      setReady(true);
      return;
    }

    Auth.getProfile()
      .then((profile) => {
        setUser(profile);
        localStorage.setItem("user", JSON.stringify(profile)); // sauvegarde
      })
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      })
      .finally(() => setReady(true));
  }, []);

  // ✅ Login : enregistre token + user
  const login = async (email, password) => {
    const data = await Auth.login(email, password);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  // ✅ Logout : supprime token + user
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const value = { 
    user, 
    isAuthenticated: !!user, 
    ready, 
    login, 
    logout, 
    setUser 
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);