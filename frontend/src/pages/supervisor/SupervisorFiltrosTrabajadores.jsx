// src/components/supervisor/SupervisorFiltrosTrabajadores.jsx
import React from "react";
import { Grid, TextField, MenuItem, Button } from "@mui/material";

export default function SupervisorFiltrosTrabajadores({
  filtros,
  onChange,
  onClear,
  sucursales,
  departamentos,
}) {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Buscar"
          placeholder="Nombre, apellido o RUT"
          value={filtros.search}
          onChange={(e) => onChange("search", e.target.value)}
        />
      </Grid>

      <Grid item xs={12} md={3}>
        <TextField
          select
          fullWidth
          label="Sucursal"
          value={filtros.sucursal}
          onChange={(e) => onChange("sucursal", e.target.value)}
        >
          <MenuItem value="">Todas</MenuItem>
          {sucursales.map((s) => (
            <MenuItem key={s.id} value={s.id}>
              {s.nombre}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      <Grid item xs={12} md={3}>
        <TextField
          select
          fullWidth
          label="Área"
          value={filtros.departamento}
          onChange={(e) => onChange("departamento", e.target.value)}
        >
          <MenuItem value="">Todas</MenuItem>
          {departamentos.map((d) => (
            <MenuItem key={d.id} value={d.id}>
              {d.nombre}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      <Grid item xs={12} md={2} sx={{ display: "flex", alignItems: "center" }}>
        <Button variant="outlined" fullWidth onClick={onClear}>
          Limpiar
        </Button>
      </Grid>
    </Grid>
  );
}
