import React, { useState } from "react";
import { IconButton, Menu, MenuItem, Typography } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";

import NotifService from "../../services/notificaciones.service.js";

const NotificacionesIcon = ({ onOpenHistorial }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleMarcarTodas = async () => {
    try {
      await NotifService.marcarTodas();
    } catch (err) {
      console.error("Error marcar todas:", err);
    } finally {
      handleClose();
    }
  };

  const handleVerHistorial = () => {
    handleClose();
    if (typeof onOpenHistorial === "function") onOpenHistorial();
  };

  return (
    <>
      <IconButton color="inherit" onClick={handleOpen}>
        <NotificationsIcon />
      </IconButton>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={handleVerHistorial}>
          <Typography>Ver historial</Typography>
        </MenuItem>

        <MenuItem onClick={handleMarcarTodas}>
          <Typography>Marcar todas como leídas</Typography>
        </MenuItem>
      </Menu>
    </>
  );
};

export default NotificacionesIcon;
