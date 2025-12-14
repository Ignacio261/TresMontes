import React from "react";
import { Box, Typography } from "@mui/material";
import SupervisorNotificacionesTable from "../../components/supervisor/notificaciones/SupervisorNotificacionesTable";

export default function SupervisorNotificaciones() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Notificaciones
      </Typography>

      <SupervisorNotificacionesTable />
    </Box>
  );
}
