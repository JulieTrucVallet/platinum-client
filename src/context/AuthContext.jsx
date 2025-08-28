import { createContext, useContext, useEffect, useState } from "react";
import * as Auth from "../services/AuthService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  // Check if user is already logged in (on first load)
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    // If user is in localStorage, use it
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setReady(true);
      return;
    }

    // If no token, just mark as ready
    if (!token) {
      setReady(true);
      return;
    }

    // Otherwise, fetch profile from API
    Auth.getProfile()
      .then((profile) => {
        setUser(profile);
        localStorage.setItem("user", JSON.stringify(profile));
      })
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      })
      .finally(() => setReady(true));
  }, []);

  // Save user + token on login
  const login = (user, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
  };

  // Clear user on logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  // Context value
  const value = {
    user,
    isAuthenticated: !!user,
    ready,
    login,
    logout,
    setUser,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

// Hook to use Auth context easily
export const useAuth = () => useContext(AuthContext);