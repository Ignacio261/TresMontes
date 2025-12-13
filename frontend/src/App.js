import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AuthGuard from "./guards/AuthGuard";
import Layout from "./components/Layout";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Trabajadores from "./pages/Trabajadores";
import Notificaciones from "./pages/Notificaciones";
import Entregas from "./pages/Entregas";
import QRManager from "./pages/QRManager";
import Configuracion from "./pages/Configuracion";
import Reportes from "./pages/reportes/Reportes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* Login público */}
        <Route path="/login" element={<Login />} />

        {/* Todo lo protegido va dentro del Layout */}
        <Route
          path="/"
          element={
            <AuthGuard>
              <Layout />
            </AuthGuard>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="trabajadores" element={<Trabajadores />} />
          <Route path="entregas" element={<Entregas />} />
          <Route path="notificaciones" element={<Notificaciones />} />
          <Route path="qr" element={<QRManager />} />
          <Route path="configuracion" element={<Configuracion />} />
          <Route path="reportes" element={<Reportes />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
