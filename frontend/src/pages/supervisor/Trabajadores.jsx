import React from "react";
import { Box, Typography } from "@mui/material";

import SupervisorTrabajadoresTable from "../../components/supervisor/trabajadores/SupervisorTrabajadoresTable";

export default function SupervisorTrabajadores() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Trabajadores a Cargo
      </Typography>

      <SupervisorTrabajadoresTable />
    </Box>
  );
}
