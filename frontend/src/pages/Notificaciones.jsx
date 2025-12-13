import React, { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";

import NotifService from "../services/notificaciones.service";

import EnviarNotificacionModal from "../components/Notificaciones/EnviarNotificacionModal";
import NotificacionesTable from "../components/Notificaciones/NotificacionesTable";

const Notificaciones = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Notificaciones
      </Typography>

      <Button variant="contained" sx={{ mb: 2 }} onClick={() => setModalOpen(true)}>
        Enviar Notificación
      </Button>

      <EnviarNotificacionModal open={modalOpen} onClose={() => setModalOpen(false)} />

      <NotificacionesTable />
    </Box>
  );
};

export default Notificaciones;
