// src/guards/SupervisorGuard.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const SupervisorGuard = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (user.rol !== "supervisor") {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default SupervisorGuard;
