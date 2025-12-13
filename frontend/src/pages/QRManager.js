import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Tooltip,
  CircularProgress,
  Chip,
  Alert,
} from "@mui/material";

import {
  QrCode,
  Download,
  Send,
  Refresh,
  AutoAwesome,
  Mail,
} from "@mui/icons-material";

import qrService from "../services/qr.service";

// Modales
import GenerarQRModal from "../components/QR/GenerarQRModal";
import EnviarQRModal from "../components/QR/EnviarQRModal";

const QRManager = () => {
  const [trabajadores, setTrabajadores] = useState([]);
  const [loading, setLoading] = useState(false);

  // modales
  const [openGenerar, setOpenGenerar] = useState(false);
  const [openEnviar, setOpenEnviar] = useState(false);

  const [selected, setSelected] = useState(null);

  // ------------------------------------------
  // CARGAR TRABAJADORES
  // ------------------------------------------
  const loadData = async () => {
    try {
      setLoading(true);
      const res = await qrService.list();
      setTrabajadores(res.data);
    } catch (err) {
      console.error("Error cargando trabajadores:", err);
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------------------
  // ACCIONES INDIVIDUALES
  // ------------------------------------------
  const generarQR = (trabajador) => {
    setSelected(trabajador);
    setOpenGenerar(true);
  };

  const enviarQR = (trabajador) => {
    setSelected(trabajador);
    setOpenEnviar(true);
  };

  const descargarQR = async (id) => {
    try {
      await qrService.descargar(id);
    } catch (err) {
      console.error("Error descargando QR:", err);
    }
  };

  // ------------------------------------------
  // ACCIONES MASIVAS
  // ------------------------------------------

  const generarMasivo = async () => {
    try {
      const res = await qrService.masivoGenerar();
      alert(res.data.message);
      loadData();
    } catch (e) {
      console.error("Error en generación masiva:", e);
      alert("Error generando QR masivo.");
    }
  };

  const enviarMasivo = async () => {
    try {
      const res = await qrService.masivoEnviar();
      alert(res.data.message);
      loadData();
    } catch (e) {
      console.error("Error enviando masivo:", e);
      alert("Error enviando QR masivo.");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <Box>
      {/* TÍTULO */}
      <Typography variant="h4" gutterBottom>
        <QrCode sx={{ mr: 2, verticalAlign: "middle" }} />
        Gestión de Códigos QR
      </Typography>

      {/* ALERTA SUPERIOR */}
      <Alert severity="info" sx={{ mb: 3 }}>
        Generación de QR individual o masiva, descarga y envío por correo.  
        Envío de correo actualmente en modo simulado.
      </Alert>

      <Paper sx={{ p: 3 }}>

        {/* BOTONES MASIVOS */}
        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AutoAwesome />}
            onClick={generarMasivo}
          >
            Generar QR Masivo
          </Button>

          <Button
            variant="contained"
            color="success"
            startIcon={<Mail />}
            onClick={enviarMasivo}
          >
            Enviar QR Masivo
          </Button>

          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={loadData}
          >
            Recargar
          </Button>
        </Box>

        {/* TABLA */}
        {loading ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <table className="table table-dark table-striped" style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>Trabajador</th>
                <th>Sucursal</th>
                <th>Estado QR</th>
                <th style={{ width: "200px" }}>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {trabajadores.map((t) => (
                <tr key={t.id}>
                  <td>
                    {t.nombres} {t.apellido_paterno}
                    <br />
                    <small>{t.rut}</small>
                  </td>

                  <td>{t.sucursal || "—"}</td>

                  <td>
                    <Chip
                      label={t.qr_estado || "NO GENERADO"}
                      color={
                        t.qr_estado === "ENVIADO"
                          ? "success"
                          : t.qr_estado === "GENERADO"
                          ? "info"
                          : "default"
                      }
                    />
                  </td>

                  <td>
                    {/* GENERAR */}
                    <Tooltip title="Generar QR">
                      <IconButton onClick={() => generarQR(t)} color="primary">
                        <QrCode />
                      </IconButton>
                    </Tooltip>

                    {/* DESCARGAR */}
                    <Tooltip title="Descargar QR">
                      <IconButton onClick={() => descargarQR(t.id)}>
                        <Download />
                      </IconButton>
                    </Tooltip>

                    {/* ENVIAR */}
                    <Tooltip title="Enviar Email">
                      <IconButton onClick={() => enviarQR(t)} color="warning">
                        <Send />
                      </IconButton>
                    </Tooltip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Paper>

      {/* MODAL GENERAR QR */}
      {openGenerar && (
        <GenerarQRModal
          open={openGenerar}
          onClose={() => setOpenGenerar(false)}
          trabajador={selected}
          onGenerated={loadData}
        />
      )}

      {/* MODAL ENVIAR QR */}
      {openEnviar && (
        <EnviarQRModal
          open={openEnviar}
          onClose={() => setOpenEnviar(false)}
          trabajador={selected}
          onSent={loadData}
        />
      )}
    </Box>
  );
};

export default QRManager;
