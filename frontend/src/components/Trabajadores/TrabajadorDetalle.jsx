// src/components/Trabajadores/TrabajadorDetalle.jsx
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  Card,
  CardContent,
  Avatar,
  Box,
  Divider,
} from "@mui/material";
import api from "../../services/api";

export default function TrabajadorDetalle({ open, onClose, trabajadorId, onOpenHistorial }) {
  const [loading, setLoading] = useState(false);
  const [trabajador, setTrabajador] = useState(null);

  useEffect(() => {
    if (open && trabajadorId) {
      fetchTrabajador();
    }
    // eslint-disable-next-line
  }, [open, trabajadorId]);

  const fetchTrabajador = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/trabajadores/${trabajadorId}/`);
      setTrabajador(res.data);
    } catch (e) {
      console.error("Error cargando trabajador:", e);
      alert("No se pudo cargar la ficha");
    } finally {
      setLoading(false);
    }
  };

  const generarQR = async () => {
    try {
      await api.post(`/trabajadores/${trabajadorId}/generar_qr/`);
      alert("QR generado correctamente");
      fetchTrabajador();
    } catch (e) {
      alert("Error generando QR");
    }
  };

  const descargarQR = async () => {
    try {
      const res = await api.get(`/trabajadores/${trabajadorId}/descargar_qr/`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = `${trabajador.rut}_qr.png`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      alert("No se pudo descargar el QR");
    }
  };

  if (!trabajador) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Ficha del trabajador</DialogTitle>

      <DialogContent dividers>
        {loading ? (
          <Typography>Cargando...</Typography>
        ) : (
          <Grid container spacing={3}>
            {/* Foto */}
            <Grid item xs={12} sm={4}>
              <Card sx={{ textAlign: "center", p: 2 }}>
                <Avatar
                  src={trabajador.foto}
                  alt={trabajador.nombre}
                  sx={{ width: 120, height: 120, margin: "auto" }}
                />
                <Typography variant="h6" mt={2}>
                  {trabajador.nombre} {trabajador.apellido}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {trabajador.cargo}
                </Typography>
              </Card>
            </Grid>

            {/* Información */}
            <Grid item xs={12} sm={8}>
              <Card>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="primary">
                        Información general
                      </Typography>
                      <Divider />
                    </Grid>

                    <Grid item xs={6}>
                      <strong>RUT:</strong> {trabajador.rut}
                    </Grid>
                    <Grid item xs={6}>
                      <strong>Email:</strong> {trabajador.email}
                    </Grid>
                    <Grid item xs={6}>
                      <strong>Teléfono:</strong> {trabajador.telefono}
                    </Grid>
                    <Grid item xs={6}>
                      <strong>Dirección:</strong> {trabajador.direccion}
                    </Grid>

                    <Grid item xs={6}>
                      <strong>Sucursal:</strong>{" "}
                      {trabajador.sucursal?.nombre || trabajador.sucursal}
                    </Grid>
                    <Grid item xs={6}>
                      <strong>Departamento:</strong>{" "}
                      {trabajador.departamento?.nombre || trabajador.departamento}
                    </Grid>

                    <Grid item xs={6}>
                      <strong>Tipo contrato:</strong> {trabajador.tipo_contrato}
                    </Grid>
                    <Grid item xs={6}>
                      <strong>Estado:</strong> {trabajador.estado}
                    </Grid>

                    <Grid item xs={6}>
                      <strong>Fecha ingreso:</strong> {trabajador.fecha_ingreso}
                    </Grid>
                    <Grid item xs={6}>
                      <strong>Nacimiento:</strong> {trabajador.fecha_nacimiento}
                    </Grid>

                    <Grid item xs={12} mt={2}>
                      <Typography variant="subtitle2" color="primary">
                        Código QR
                      </Typography>
                      <Divider sx={{ mb: 2 }} />

                      {trabajador.qr_estado === "no_generado" && (
                        <Typography color="warning.main">
                          Este trabajador no tiene QR generado.
                        </Typography>
                      )}

                      <Box display="flex" gap={1} mt={2}>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={generarQR}
                        >
                          Generar QR
                        </Button>

                        {trabajador.qr_estado !== "no_generado" && (
                          <Button
                            variant="outlined"
                            onClick={descargarQR}
                          >
                            Descargar QR
                          </Button>
                        )}

                        <Button
                          variant="text"
                          onClick={() => onOpenHistorial(trabajador.id)}
                        >
                          Ver historial
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
}
