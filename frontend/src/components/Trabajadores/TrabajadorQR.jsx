// src/components/Trabajadores/TrabajadorQR.jsx
import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Divider,
  Box,
  Button,
  Chip,
  CircularProgress,
} from "@mui/material";

import QrCodeIcon from "@mui/icons-material/QrCode";
import SendIcon from "@mui/icons-material/Send";

import api from "../../services/api";

export default function TrabajadorQR({ trabajador }) {
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const esSupervisor = user.rol === "supervisor";

  if (!trabajador) return null;

  const qrEstado = trabajador.qr_estado?.estado_simplificado || "no_generado";

  const getColor = () => {
    switch (qrEstado) {
      case "generado":
        return "warning";
      case "enviado":
        return "success";
      case "no_generado":
      default:
        return "default";
    }
  };

  const getLabel = () => {
    switch (qrEstado) {
      case "generado":
        return "QR Generado";
      case "enviado":
        return "QR Enviado";
      case "no_generado":
      default:
        return "QR No Generado";
    }
  };

  const generarQR = async () => {
    setLoading(true);
    try {
      await api.post(`/qr/generar/${trabajador.id}/`);
      alert("QR generado correctamente");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Error al generar QR");
    } finally {
      setLoading(false);
    }
  };

  const enviarQR = async () => {
    setLoading(true);
    try {
      await api.post(`/qr/enviar-email/${trabajador.id}/`);
      alert("QR enviado por correo (simulado)");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Error al enviar QR");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Estado del Código QR
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          {/* Estado */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <QrCodeIcon />
            <Chip label={getLabel()} color={getColor()} />
          </Box>

          {/* Acciones */}
          {!esSupervisor && (
            <Box sx={{ display: "flex", gap: 2 }}>
              {qrEstado === "no_generado" && (
                <Button
                  variant="contained"
                  startIcon={<QrCodeIcon />}
                  onClick={generarQR}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={18} /> : "Generar QR"}
                </Button>
              )}

              {qrEstado === "generado" && (
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<SendIcon />}
                  onClick={enviarQR}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={18} /> : "Enviar QR"}
                </Button>
              )}
            </Box>
          )}
        </Box>

        {esSupervisor && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 2 }}
          >
            * El supervisor solo puede visualizar el estado del QR.
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
