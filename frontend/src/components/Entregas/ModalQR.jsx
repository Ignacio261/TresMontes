import React from "react";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";

export default function ModalQR({ open, onClose, image }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs">
      <DialogTitle>QR del Trabajador</DialogTitle>
      <DialogContent sx={{ textAlign: "center" }}>
        {image ? (
          <img src={image} alt="QR" style={{ width: "100%" }} />
        ) : (
          <p>No disponible</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
