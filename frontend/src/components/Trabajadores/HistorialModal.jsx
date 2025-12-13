// src/components/Trabajadores/HistorialModal.jsx
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Typography,
  Chip,
  Box,
} from "@mui/material";

import api from "../../services/api";

export default function HistorialModal({ open, onClose, trabajadorId }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && trabajadorId) loadHistorial();
    // eslint-disable-next-line
  }, [open, trabajadorId]);

  const loadHistorial = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/trabajadores/${trabajadorId}/historial/`);
      setItems(res.data);
    } catch (err) {
      console.error(err);
      alert("No se pudo cargar el historial.");
    } finally {
      setLoading(false);
    }
  };

  const getColor = (tipo) => {
    switch (tipo) {
      case "qr_generado":
        return "primary";
      case "qr_enviado":
        return "success";
      case "entrega":
        return "info";
      case "actualizacion":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Historial del trabajador</DialogTitle>

      <DialogContent dividers>
        {loading ? (
          <Typography>Cargando...</Typography>
        ) : items.length === 0 ? (
          <Typography>No hay registros aún.</Typography>
        ) : (
          <List>
            {items.map((h, i) => (
              <Box key={i}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Chip label={h.tipo.toUpperCase()} color={getColor(h.tipo)} size="small" />
                        <Typography>{h.descripcion}</Typography>
                      </Box>
                    }
                    secondary={
                      <Typography variant="caption" color="gray">
                        {h.fecha}
                      </Typography>
                    }
                  />
                </ListItem>

                {i < items.length - 1 && <Divider />}
              </Box>
            ))}
          </List>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
}
