import { Navigate } from "react-router-dom";

const AuthGuard = ({ children }) => {
  const token = localStorage.getItem("access_token");

  // Si NO hay token → forzar login
  if (!token) return <Navigate to="/login" replace />;

  return children;
};

export default AuthGuard;
