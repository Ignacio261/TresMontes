// frontend/src/components/QR/GenerarQRModal.jsx
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
  TextField,
} from "@mui/material";
import qrService from "../../services/qr.service";

export default function GenerarQRModal({ open, onClose, trabajador, onGenerated = () => {} }) {
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");

  if (!trabajador) return null;

  const handleGenerar = async () => {
    setLoading(true);
    setMensaje("");
    try {
      const res = await qrService.generar(trabajador.id);
      setMensaje(res.message || "QR generado correctamente");
      onGenerated();
    } catch (e) {
      console.error(e);
      const text = e?.response?.data?.message || JSON.stringify(e?.response?.data) || e.message;
      setMensaje("Error: " + text);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Generar QR — {trabajador.nombres || trabajador.nombre}</DialogTitle>

      <DialogContent dividers>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2">
            Se generará un código QR único para el trabajador. El contenido incluirá un identificador y hash de validación.
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2">Trabajador</Typography>
          <Typography>{(trabajador.nombres || trabajador.nombre) + " " + (trabajador.apellido_paterno || trabajador.apellido)}</Typography>
          <Typography variant="caption" color="text.secondary">{trabajador.rut || trabajador.id}</Typography>
        </Box>

        {mensaje && (
          <Box sx={{ mb: 2 }}>
            <TextField
              label="Resultado"
              value={mensaje}
              fullWidth
              multiline
              minRows={2}
              InputProps={{ readOnly: true }}
            />
          </Box>
        )}

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
            <CircularProgress />
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>Cerrar</Button>
        <Button variant="contained" color="primary" onClick={handleGenerar} disabled={loading}>
          Generar QR
        </Button>
      </DialogActions>
    </Dialog>
  );
}
