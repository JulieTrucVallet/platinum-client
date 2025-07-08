import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

// Create authentication context
const AuthContext = createContext();

// Auth provider to manage user state and auth functions
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Save token and set user data
  const login = (userData, token) => {
    localStorage.setItem("token", token);
    setUser(userData);
  };

  // Remove token and clear user
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  // Check if user is authenticated
  const checkAuth = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await axios.get("http://localhost:8010/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setUser(res.data);
    } catch (err) {
      localStorage.removeItem("token");
      setUser(null);
    }
  };

  // Run checkAuth on component mount
  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to access AuthContext
export function useAuth() {
  return useContext(AuthContext);
}