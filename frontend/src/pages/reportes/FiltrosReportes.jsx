import React, { useState } from "react";
import { Grid, TextField, Button } from "@mui/material";

const FiltrosReportes = ({ onBuscar }) => {
  const [filtros, setFiltros] = useState({
    desde: "",
    hasta: "",
    sede: "",
    beneficio: "",
    estado: "",
    search: "",
  });

  const handleChange = (e) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={2}>
        <TextField label="Desde" type="date" name="desde" fullWidth onChange={handleChange} />
      </Grid>
      <Grid item xs={12} sm={2}>
        <TextField label="Hasta" type="date" name="hasta" fullWidth onChange={handleChange} />
      </Grid>
      <Grid item xs={12} sm={2}>
        <TextField label="Sede" name="sede" fullWidth onChange={handleChange} />
      </Grid>
      <Grid item xs={12} sm={2}>
        <TextField label="Beneficio" name="beneficio" fullWidth onChange={handleChange} />
      </Grid>
      <Grid item xs={12} sm={2}>
        <TextField label="Estado" name="estado" fullWidth onChange={handleChange} />
      </Grid>
      <Grid item xs={12} sm={2}>
        <TextField label="Buscar" name="search" fullWidth onChange={handleChange} />
      </Grid>

      <Grid item xs={12}>
        <Button variant="contained" onClick={() => onBuscar(filtros)}>
          Buscar
        </Button>
      </Grid>
    </Grid>
  );
};

export default FiltrosReportes;
