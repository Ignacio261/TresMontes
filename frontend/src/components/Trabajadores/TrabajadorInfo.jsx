// src/components/Trabajadores/TrabajadorInfo.jsx
import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Divider,
  Box,
} from "@mui/material";

export default function TrabajadorInfo({ trabajador }) {
  if (!trabajador) return null;

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Información del Trabajador
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Typography variant="body2" color="text.secondary">
              RUT
            </Typography>
            <Typography>{trabajador.rut}</Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="body2" color="text.secondary">
              Nombre
            </Typography>
            <Typography>
              {trabajador.nombre} {trabajador.apellido}
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="body2" color="text.secondary">
              Cargo
            </Typography>
            <Typography>{trabajador.cargo || "—"}</Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="body2" color="text.secondary">
              Email
            </Typography>
            <Typography>{trabajador.email}</Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="body2" color="text.secondary">
              Teléfono
            </Typography>
            <Typography>{trabajador.telefono || "—"}</Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="body2" color="text.secondary">
              Estado
            </Typography>
            <Typography sx={{ fontWeight: "bold" }}>
              {trabajador.estado === "activo" ? "Activo" : "Inactivo"}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary">
              Sucursal
            </Typography>
            <Typography>
              {trabajador.sucursal?.nombre || trabajador.sucursal}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary">
              Departamento
            </Typography>
            <Typography>
              {trabajador.departamento?.nombre || trabajador.departamento}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary">
              Tipo de Contrato
            </Typography>
            <Typography>
              {trabajador.tipo_contrato === "indefinido"
                ? "Indefinido"
                : "Plazo Fijo"}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary">
              Fecha de Ingreso
            </Typography>
            <Typography>
              {trabajador.fecha_ingreso
                ? new Date(trabajador.fecha_ingreso).toLocaleDateString()
                : "—"}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
