import React, { useState, useEffect } from "react";
import { Box, Paper, Typography, Divider } from "@mui/material";
import ReportesService from "../../services/reportes.service";
import FiltrosReportes from "./FiltrosReportes";
import TablaReportes from "./TablaReportes";
import ExportButtons from "./ExportButtons";

const Reportes = () => {
  const [datos, setDatos] = useState([]);

  const cargar = async (filtros = {}) => {
    const res = await ReportesService.listar(filtros);
    setDatos(res);
  };

  useEffect(() => {
    cargar();
  }, []);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Reportes de Entregas
      </Typography>

      <Paper sx={{ p: 3 }}>
        <FiltrosReportes onBuscar={cargar} />

        <Divider sx={{ my: 2 }} />

        <ExportButtons />

        <TablaReportes datos={datos} />
      </Paper>
    </Box>
  );
};

export default Reportes;
