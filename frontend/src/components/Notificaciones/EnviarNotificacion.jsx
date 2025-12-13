import React, { useState } from "react";
import { Box, Paper, Typography, TextField, Button } from "@mui/material";
import NotifService from "../../services/notificaciones.service";

const EnviarNotificacion = () => {
  const [titulo, setTitulo] = useState("");
  const [mensaje, setMensaje] = useState("");

  const enviar = async () => {
    await NotifService.crear({
      titulo,
      mensaje,
      usuario: 1 // si quieres enviar al admin o usuario específico
    });

    alert("Notificación enviada");
    setTitulo("");
    setMensaje("");
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Enviar Notificación</Typography>

      <TextField fullWidth margin="normal" label="Título"
        value={titulo} onChange={(e) => setTitulo(e.target.value)} />

      <TextField fullWidth margin="normal" label="Mensaje"
        multiline rows={4}
        value={mensaje} onChange={(e) => setMensaje(e.target.value)} />

      <Button variant="contained" sx={{ mt: 2 }} onClick={enviar}>
        Enviar
      </Button>
    </Paper>
  );
};

export default EnviarNotificacion;
