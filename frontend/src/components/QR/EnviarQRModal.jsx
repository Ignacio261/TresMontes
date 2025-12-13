// frontend/src/components/QR/EnviarQRModal.jsx
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";
import qrService from "../../services/qr.service";

export default function EnviarQRModal({ open, onClose, trabajador, onSent = () => {} }) {
  const [loading, setLoading] = useState(false);
  const [destinatario, setDestinatario] = useState("");
  const [asunto, setAsunto] = useState("Código QR - Tresmontes");
  const [mensaje, setMensaje] = useState("Adjunto tu código QR. Preséntalo en recepción.");

  useEffect(() => {
    if (trabajador) {
      // prefill email if available
      setDestinatario(trabajador.email || "");
    }
  }, [trabajador]);

  if (!trabajador) return null;

  const handleEnviar = async () => {
    setLoading(true);
    try {
      const res = await qrService.enviar(trabajador.id, {
        destinatario,
        asunto,
        mensaje,
      });
      // backend simula el envío y actualiza estado
      alert(res.message || "Enviado (simulado)");
      onSent();
      onClose();
    } catch (e) {
      console.error(e);
      const text = e?.response?.data?.message || JSON.stringify(e?.response?.data) || e.message;
      alert("Error enviando: " + text);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Enviar QR por Email — {trabajador.nombres || trabajador.nombre}</DialogTitle>

      <DialogContent dividers>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2">Completa los datos del envío. En producción se integrará con SMTP/servicio de email.</Typography>
        </Box>

        <TextField
          label="Destinatario (email)"
          value={destinatario}
          onChange={(e) => setDestinatario(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />

        <TextField
          label="Asunto"
          value={asunto}
          onChange={(e) => setAsunto(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />

        <TextField
          label="Mensaje"
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          fullWidth
          multiline
          minRows={3}
        />

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
            <CircularProgress />
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>Cancelar</Button>
        <Button variant="contained" color="primary" onClick={handleEnviar} disabled={loading || !destinatario}>
          Enviar (simulado)
        </Button>
      </DialogActions>
    </Dialog>
  );
}
