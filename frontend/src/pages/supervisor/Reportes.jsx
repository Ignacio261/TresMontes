// src/pages/supervisor/Reportes.jsx
import React from "react";
import { Box, Typography } from "@mui/material";

const SupervisorReportes = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Reportes
      </Typography>
      <Typography color="text.secondary">
        El supervisor solo tiene acceso a visualización básica de reportes.
      </Typography>
    </Box>
  );
};

export default SupervisorReportes;
