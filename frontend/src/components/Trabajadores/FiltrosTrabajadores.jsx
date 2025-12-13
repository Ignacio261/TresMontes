// src/components/Trabajadores/FiltrosTrabajadores.jsx
import React from "react";
import { Grid, TextField, MenuItem, Button, Paper } from "@mui/material";

export default function FiltrosTrabajadores({
  filtros,
  onChange,
  onClear,
}) {
  return (
    <Paper
      elevation={3}
      sx={{
        padding: 2,
        background: "#0d1b12",
        border: "1px solid #1b5e20",
        marginBottom: 2,
      }}
    >
      <Grid container spacing={2}>
        {/* Buscador */}
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Buscar (RUT, nombre, apellido)"
            variant="outlined"
            value={filtros.search}
            onChange={(e) => onChange("search", e.target.value)}
          />
        </Grid>

        {/* Sucursal */}
        <Grid item xs={12} sm={3}>
          <TextField
            select
            fullWidth
            label="Sucursal"
            value={filtros.sucursal}
            onChange={(e) => onChange("sucursal", e.target.value)}
          >
            <MenuItem value="">Todas</MenuItem>
            <MenuItem value="Casablanca">Casablanca</MenuItem>
            <MenuItem value="Valparaíso Planta BIF">Valparaíso Planta BIF</MenuItem>
            <MenuItem value="Valparaíso Planta BIC">Valparaíso Planta BIC</MenuItem>
          </TextField>
        </Grid>

        {/* Tipo contrato */}
        <Grid item xs={12} sm={2}>
          <TextField
            select
            fullWidth
            label="Contrato"
            value={filtros.tipo_contrato}
            onChange={(e) => onChange("tipo_contrato", e.target.value)}
          >
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="Indefinido">Indefinido</MenuItem>
            <MenuItem value="Plazo Fijo">Plazo Fijo</MenuItem>
          </TextField>
        </Grid>

        {/* Estado */}
        <Grid item xs={12} sm={2}>
          <TextField
            select
            fullWidth
            label="Estado"
            value={filtros.estado}
            onChange={(e) => onChange("estado", e.target.value)}
          >
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="Activo">Activo</MenuItem>
            <MenuItem value="Inactivo">Inactivo</MenuItem>
          </TextField>
        </Grid>

        {/* Botón limpiar */}
        <Grid item xs={12} sm={1}>
          <Button
            fullWidth
            variant="outlined"
            color="error"
            onClick={onClear}
            sx={{ height: "100%" }}
          >
            X
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}
