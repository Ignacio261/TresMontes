import React from "react";
import { Grid, TextField, Button, Card, CardContent } from "@mui/material";

export default function SupervisorFiltrosDashboard({
  filtros,
  onChange,
  onClear,
}) {
  return (
    <Card
      sx={{
        mb: 3,
        backgroundColor: "#0f1c0f",
        border: "1px solid #1b5e20",
      }}
    >
      <CardContent>
        <Grid container spacing={2}>
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
              sx={{ height: "56px" }}
              onClick={onClear}
            >
              Limpiar filtros
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
