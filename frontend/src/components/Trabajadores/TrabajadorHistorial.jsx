// src/components/Trabajadores/TrabajadorHistorial.jsx
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Box,
} from "@mui/material";

import api from "../../services/api";

export default function TrabajadorHistorial({ trabajadorId }) {
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargarHistorial = async () => {
    try {
      const res = await api.get(`/trabajadores/${trabajadorId}/historial/`);
      setHistorial(res.data.results || res.data);
    } catch (err) {
      console.error("Error cargando historial:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (trabajadorId) cargarHistorial();
  }, [trabajadorId]);

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Historial del Trabajador
        </Typography>

        <Divider sx={{ mb: 2 }} />

        {loading ? (
          <Box sx={{ textAlign: "center", p: 2 }}>
            <CircularProgress size={24} />
          </Box>
        ) : historial.length === 0 ? (
          <Typography color="text.secondary">
            No hay registros en el historial.
          </Typography>
        ) : (
          <List>
            {historial.map((h) => (
              <ListItem key={h.id} divider>
                <ListItemText
                  primary={`${h.tipo_cambio.toUpperCase()} – ${h.descripcion}`}
                  secondary={
                    <>
                      <Typography variant="body2" component="span">
                        Fecha:{" "}
                        {new Date(h.fecha_cambio).toLocaleString()}
                      </Typography>
                      <br />
                      {h.valor_anterior && (
                        <Typography variant="body2" component="span">
                          Antes: {h.valor_anterior} → Después: {h.valor_nuevo}
                        </Typography>
                      )}
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
}
