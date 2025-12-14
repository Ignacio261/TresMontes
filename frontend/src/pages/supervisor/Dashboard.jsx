import React, { useState } from "react";
import { Box, Typography } from "@mui/material";

import SupervisorStats from "../../components/supervisor/dashboard/SupervisorStats";
import SupervisorTrabajadoresResumen from "../../components/supervisor/dashboard/SupervisorTrabajadoresResumen";
import SupervisorFiltrosDashboard from "../../components/supervisor/dashboard/SupervisorFiltrosDashboard";

export default function SupervisorDashboard() {
  const [filtros, setFiltros] = useState({
    sucursal: "",
    departamento: "",
  });

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Dashboard Supervisor
      </Typography>

      {/* Filtros */}
      <SupervisorFiltrosDashboard
        filtros={filtros}
        onChange={(k, v) => setFiltros({ ...filtros, [k]: v })}
        onClear={() => setFiltros({ sucursal: "", departamento: "" })}
      />

      {/* Estadísticas */}
      <SupervisorStats filtros={filtros} />

      {/* Resumen trabajadores */}
      <SupervisorTrabajadoresResumen filtros={filtros} />
    </Box>
  );
}
