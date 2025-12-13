import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText
} from "@mui/material";

export default function ModalHistorial({ open, onClose, historial }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm">
      <DialogTitle>Historial</DialogTitle>
      <DialogContent>
        <List>
          {historial.map((h) => (
            <ListItem key={h.id}>
              <ListItemText
                primary={h.descripcion}
                secondary={`${h.realizado_por_nombre || "Sistema"} — ${h.fecha}`}
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
}
