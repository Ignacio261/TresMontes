// src/components/Trabajadores/TrabajadorForm.jsx
import React, { useEffect, useState } from "react";
import {
  Grid,
  TextField,
  MenuItem,
  Box,
  Button,
  CircularProgress
} from "@mui/material";

import api from "../../services/api";

export default function TrabajadorForm({ onClose, onSaved }) {
  const [loading, setLoading] = useState(false);
  const [sucursales, setSucursales] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);

  const [form, setForm] = useState({
    rut: "",
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    direccion: "",
    sucursal: "",
    departamento: "",
    cargo: "",
    tipo_contrato: "indefinido",
    estado: "activo",
    fecha_ingreso: new Date().toISOString().split("T")[0],
    fecha_nacimiento: "",
  });

  // Cargar selects
  useEffect(() => {
    const load = async () => {
      const s = await api.get("configuracion/sucursales/");
      const d = await api.get("configuracion/areas/");
      setSucursales(s.data);
      setDepartamentos(d.data);
    };
    load();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      await api.post("trabajadores/", form);
      alert("Trabajador creado correctamente");
      onSaved();
      onClose();
    } catch (err) {
      alert("Error guardando trabajador");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <TextField label="RUT" name="rut" value={form.rut} onChange={handleChange} fullWidth />
        </Grid>

        <Grid item xs={4}>
          <TextField label="Nombre" name="nombre" value={form.nombre} onChange={handleChange} fullWidth />
        </Grid>

        <Grid item xs={4}>
          <TextField label="Apellido" name="apellido" value={form.apellido} onChange={handleChange} fullWidth />
        </Grid>

        <Grid item xs={6}>
          <TextField label="Email" name="email" value={form.email} onChange={handleChange} fullWidth />
        </Grid>

        <Grid item xs={6}>
          <TextField label="Teléfono" name="telefono" value={form.telefono} onChange={handleChange} fullWidth />
        </Grid>

        <Grid item xs={6}>
          <TextField
            select
            label="Sucursal"
            name="sucursal"
            value={form.sucursal}
            onChange={handleChange}
            fullWidth
          >
            {sucursales.map((s) => (
              <MenuItem key={s.id} value={s.id}>{s.nombre}</MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={6}>
          <TextField
            select
            label="Departamento"
            name="departamento"
            value={form.departamento}
            onChange={handleChange}
            fullWidth
          >
            {departamentos.map((d) => (
              <MenuItem key={d.id} value={d.id}>{d.nombre}</MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
            startIcon={loading && <CircularProgress size={18} />}
          >
            Guardar Trabajador
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
