import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  Typography
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import NotifService from "../../services/notificaciones.service.js";

const HistorialNotificaciones = ({ open, onClose }) => {
  const [items, setItems] = useState([]);

  const cargar = async () => {
    const data = await NotifService.listar();
    setItems(data);
  };

  useEffect(() => {
    if (open) cargar();
  }, [open]);

  const formatearFecha = (f) => {
    if (!f) return "";
    return new Date(f).toLocaleString("es-CL");
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6">Historial de notificaciones</Typography>
        <IconButton onClick={onClose}><CloseIcon /></IconButton>
      </DialogTitle>

      <DialogContent>
        <List>
          {items.map(n => (
            <React.Fragment key={n.id}>
              <ListItem alignItems="flex-start">
                <ListItemText
                  primary={
                    <>
                      {!n.leido && "🟢 "}
                      <b>{n.titulo}</b>
                    </>
                  }
                  secondary={
                    <>
                      {n.mensaje}
                      <br />
                      <small>{formatearFecha(n.creado_en)}</small>
                    </>
                  }
                />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
};

export default HistorialNotificaciones;
