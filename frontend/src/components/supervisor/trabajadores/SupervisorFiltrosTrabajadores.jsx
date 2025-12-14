import React from "react";
import { Grid, TextField, Button } from "@mui/material";

export default function SupervisorFiltrosTrabajadores({
  filtros,
  onChange,
  onClear,
}) {
  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12} md={4}>
        <TextField
          label="Sucursal"
          fullWidth
          value={filtros.sucursal}
          onChange={(e) => onChange("sucursal", e.target.value)}
        />
      </Grid>

      <Grid item xs={12} md={4}>
        <TextField
          label="Área / Departamento"
          fullWidth
          value={filtros.departamento}
          onChange={(e) => onChange("departamento", e.target.value)}
        />
      </Grid>

      <Grid item xs={12} md={4}>
        <Button
          variant="outlined"
          fullWidth
          onClick={onClear}
          sx={{ height: "56px" }}
        >
          Limpiar filtros
        </Button>
      </Grid>
    </Grid>
  );
}
