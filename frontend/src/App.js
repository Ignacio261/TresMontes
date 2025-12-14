import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import AuthGuard from "./guards/AuthGuard";

// Layouts
import Layout from "./components/Layout";
import SupervisorLayout from "./layouts/SupervisorLayout";

// Pages RRHH
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Trabajadores from "./pages/Trabajadores";

// Supervisor Pages
import SupervisorDashboard from "./pages/supervisor/Dashboard";
import SupervisorTrabajadores from "./pages/supervisor/Trabajadores";
import SupervisorQR from "./pages/supervisor/QR";
import SupervisorNotificaciones from "./pages/supervisor/Notificaciones";
import SupervisorReportes from "./pages/supervisor/Reportes";
import SupervisorPerfil from "./pages/supervisor/Perfil";

// Compartidas
import TrabajadorDetalle from "./pages/TrabajadorDetalle";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* LOGIN */}
        <Route path="/login" element={<Login />} />

        {/* ========================= */}
        {/* RRHH */}
        {/* ========================= */}
        <Route
          path="/"
          element={
            <AuthGuard rol="rrhh_admin">
              <Layout />
            </AuthGuard>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="trabajadores" element={<Trabajadores />} />
        </Route>

        {/* ========================= */}
        {/* SUPERVISOR */}
        {/* ========================= */}
        <Route
          path="/supervisor"
          element={
            <AuthGuard rol="supervisor">
              <SupervisorLayout />
            </AuthGuard>
          }
        >
          <Route index element={<SupervisorDashboard />} />
          <Route path="trabajadores" element={<SupervisorTrabajadores />} />
          <Route path="trabajadores/:id" element={<TrabajadorDetalle />} />
          <Route path="qr" element={<SupervisorQR />} />
          <Route path="notificaciones" element={<SupervisorNotificaciones />} />
          <Route path="reportes" element={<SupervisorReportes />} />
          <Route path="perfil" element={<SupervisorPerfil />} />
          <Route path="/supervisor/trabajadores" element={<SupervisorTrabajadores />} />
          <Route path="/supervisor/trabajadores/:id" element={<TrabajadorDetalle />} />


        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
