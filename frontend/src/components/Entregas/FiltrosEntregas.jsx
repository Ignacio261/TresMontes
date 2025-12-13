import React from "react";
import { Grid, TextField, MenuItem, Button } from "@mui/material";

export default function FiltrosEntregas({ filtros, onChange, onClear }) {
  return (
    <Grid container spacing={2} sx={{ mb: 2 }}>
      <Grid item xs={12} md={3}>
        <TextField
          label="Buscar"
          fullWidth
          value={filtros.search}
          onChange={(e) => onChange("search", e.target.value)}
        />
      </Grid>

      <Grid item xs={12} md={3}>
        <TextField
          label="Sucursal"
          fullWidth
          select
          value={filtros.sucursal}
          onChange={(e) => onChange("sucursal", e.target.value)}
        >
          <MenuItem value="">Todas</MenuItem>
          <MenuItem value="Casablanca">Casablanca</MenuItem>
          <MenuItem value="Valparaíso Planta BIF">Valparaíso Planta BIF</MenuItem>
          <MenuItem value="Valparaíso Planta BIC">Valparaíso Planta BIC</MenuItem>
        </TextField>
      </Grid>

      <Grid item xs={12} md={3}>
        <TextField
          label="Estado"
          fullWidth
          select
          value={filtros.estado}
          onChange={(e) => onChange("estado", e.target.value)}
        >
          <MenuItem value="">Todos</MenuItem>
          <MenuItem value="pendiente">Pendiente</MenuItem>
          <MenuItem value="retirado">Retirado</MenuItem>
        </TextField>
      </Grid>

      <Grid item xs={12} md={3} sx={{ display: "flex", alignItems: "center" }}>
        <Button variant="outlined" color="secondary" onClick={onClear} fullWidth>
          Limpiar filtros
        </Button>
      </Grid>
    </Grid>
  );
}
