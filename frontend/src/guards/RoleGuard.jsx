import React from "react";
import { Navigate } from "react-router-dom";

const RoleGuard = ({ allowedRoles, children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || !allowedRoles.includes(user.rol)) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default RoleGuard;
