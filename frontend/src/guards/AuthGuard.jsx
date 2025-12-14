import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const AuthGuard = ({ children, rol }) => {
  const location = useLocation();

  const token =
    localStorage.getItem("access_token") ||
    localStorage.getItem("token");

  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Validación por rol si se especifica
  if (rol && user.rol !== rol) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AuthGuard;
