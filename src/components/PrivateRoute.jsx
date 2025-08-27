import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ children }) {
  const { isAuthenticated, ready } = useAuth();
  if (!ready) return null; // ou un Loader
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}