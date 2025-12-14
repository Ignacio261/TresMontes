// src/pages/TrabajadorDetalle.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import api from "../services/api";
import TrabajadorInfo from "../components/Trabajadores/TrabajadorInfo";
import TrabajadorQR from "../components/Trabajadores/TrabajadorQR";
import TrabajadorHistorial from "../components/Trabajadores/TrabajadorHistorial";

export default function TrabajadorDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [trabajador, setTrabajador] = useState(null);
  const [loading, setLoading] = useState(true);

const user = JSON.parse(localStorage.getItem("user") ?? "{}");
const esSupervisor = ["supervisor"].includes(user.rol);


  const loadData = async () => {
    try {
      const res = await api.get(`/trabajadores/${id}/`);
      setTrabajador(res.data);
    } catch (err) {
      console.error("Error cargando trabajador:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!trabajador) {
    return <Typography>Error cargando trabajador</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4">
          Ficha del Trabajador
        </Typography>

        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
        >
          Volver
        </Button>
      </Box>

      {/* Datos personales */}
      <TrabajadorInfo trabajador={trabajador} />

      {/* Estado QR */}
      <TrabajadorQR trabajador={trabajador} />

      {/* Historial */}
      <TrabajadorHistorial trabajadorId={trabajador.id} />

      {/* Nota permisos */}
      {esSupervisor && (
        <Typography sx={{ mt: 3 }} color="text.secondary">
          * Vista solo lectura (Supervisor)
        </Typography>
      )}
    </Box>
  );
}
