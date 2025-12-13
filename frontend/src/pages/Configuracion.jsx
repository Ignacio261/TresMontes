import React from "react";
import { Box, Typography, Grid, Paper } from "@mui/material";
import SucursalesList from "../components/Configuracion/SucursalesList";
import AreasList from "../components/Configuracion/AreasList";
import BeneficiosList from "../components/Configuracion/BeneficiosList";
import PeriodosList from "../components/Configuracion/PeriodosList";

const Configuracion = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>Configuración</Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <SucursalesList />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <AreasList />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <BeneficiosList />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <PeriodosList />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Configuracion;
