import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Divider,
  CircularProgress,
} from "@mui/material";

import TrabajadoresService from "../../services/trabajadores.service";

export default function TrabajadorDetalleBase({ id, modo = "rrhh" }) {
  const [trabajador, setTrabajador] = useState(null);
  const [loading, setLoading] = useState(true);

  const cargar = async () => {
    try {
      const res = await TrabajadoresService.getById(id);
      setTrabajador(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    cargar();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!trabajador) {
    return <Typography>No se encontró el trabajador</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Ficha del Trabajador
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6">Datos Básicos</Typography>
        <Divider sx={{ my: 2 }} />

        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <b>RUT:</b> {trabajador.rut}
          </Grid>
          <Grid item xs={12} md={4}>
            <b>Nombre:</b> {trabajador.nombre} {trabajador.apellido}
          </Grid>
          <Grid item xs={12} md={4}>
            <b>Email:</b> {trabajador.email}
          </Grid>

          <Grid item xs={12} md={4}>
            <b>Teléfono:</b> {trabajador.telefono || "—"}
          </Grid>
          <Grid item xs={12} md={4}>
            <b>Cargo:</b> {trabajador.cargo || "—"}
          </Grid>
          <Grid item xs={12} md={4}>
            <b>Tipo Contrato:</b> {trabajador.tipo_contrato}
          </Grid>

          <Grid item xs={12} md={4}>
            <b>Sucursal:</b> {trabajador.sucursal?.nombre}
          </Grid>
          <Grid item xs={12} md={4}>
            <b>Departamento:</b> {trabajador.departamento?.nombre}
          </Grid>
          <Grid item xs={12} md={4}>
            <b>Estado:</b> {trabajador.estado}
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6">Información del Sistema</Typography>
        <Divider sx={{ my: 2 }} />

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <b>Fecha ingreso:</b> {trabajador.fecha_ingreso}
          </Grid>
          <Grid item xs={12} md={6}>
            <b>Fecha creación:</b>{" "}
            {new Date(trabajador.fecha_creacion).toLocaleString()}
          </Grid>
        </Grid>
      </Paper>

      {modo === "supervisor" && (
        <Typography sx={{ mt: 3, color: "gray" }}>
          Vista solo lectura (Supervisor)
        </Typography>
      )}
    </Box>
  );
}
