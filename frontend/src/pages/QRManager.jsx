import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
  IconButton,
} from "@mui/material";

import DownloadIcon from "@mui/icons-material/Download";
import EmailIcon from "@mui/icons-material/Email";
import QrCodeIcon from "@mui/icons-material/QrCode";
import AutoModeIcon from "@mui/icons-material/AutoMode";

import api from "../services/api";
import QRService from "../services/qr.service";

export default function QRManager() {
  const [trabajadores, setTrabajadores] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargarTrabajadores = async () => {
    setLoading(true);
    try {
      const res = await api.get("/trabajadores/");
      setTrabajadores(res.data || []);
    } catch (err) {
      console.error("Error cargando trabajadores", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    cargarTrabajadores();
  }, []);

  const generarQR = async (id) => {
    await QRService.generar(id);
    cargarTrabajadores();
  };

  const descargarQR = (id) => {
    QRService.descargar(id);
  };

  const enviarQR = async (id) => {
    await QRService.enviar(id, {
      destinatario: "demo@email.com",
      asunto: "Código QR trabajador",
      mensaje: "Adjuntamos su QR correspondiente.",
    });
    cargarTrabajadores();
  };

  const generarMasivo = async () => {
    await QRService.generarMasivo();
    cargarTrabajadores();
  };

  const enviarMasivo = async () => {
    await QRService.enviarMasivo();
    cargarTrabajadores();
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Card sx={{ background: "#0d1b12", color: "white" }}>
        <CardContent>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Gestión de Códigos QR
          </Typography>

          {/* BOTONES MASIVOS */}
          <Button
            variant="contained"
            color="primary"
            startIcon={<QrCodeIcon />}
            sx={{ mr: 2 }}
            onClick={generarMasivo}
          >
            Generar QR Masivo
          </Button>

          <Button
            variant="contained"
            color="secondary"
            startIcon={<EmailIcon />}
            onClick={enviarMasivo}
          >
            Enviar QR Masivo
          </Button>

          {/* TABLA */}
          <Table sx={{ mt: 4 }}>
            <TableHead>
              <TableRow>
                <TableCell style={{ color: "white" }}>Trabajador</TableCell>
                <TableCell style={{ color: "white" }}>RUT</TableCell>
                <TableCell style={{ color: "white" }}>QR Estado</TableCell>
                <TableCell style={{ color: "white" }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : (
                trabajadores.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell style={{ color: "white" }}>
                      {t.nombres} {t.apellido_paterno}
                    </TableCell>
                    <TableCell style={{ color: "white" }}>{t.rut}</TableCell>
                    <TableCell style={{ color: "white" }}>
                      {t.qr_estado || "NO GENERADO"}
                    </TableCell>

                    <TableCell>
                      {/* Generar */}
                      <IconButton
                        onClick={() => generarQR(t.id)}
                        color="primary"
                      >
                        <AutoModeIcon />
                      </IconButton>

                      {/* Descargar */}
                      <IconButton
                        onClick={() => descargarQR(t.id)}
                        color="success"
                      >
                        <DownloadIcon />
                      </IconButton>

                      {/* Enviar */}
                      <IconButton
                        onClick={() => enviarQR(t.id)}
                        color="secondary"
                      >
                        <EmailIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Container>
  );
}
