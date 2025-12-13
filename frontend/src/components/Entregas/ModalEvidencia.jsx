import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Stack
} from "@mui/material";

export default function ModalEvidencia({ open, onClose, onConfirm }) {
  const [file, setFile] = useState(null);

  const enviar = () => {
    if (file) onConfirm(file);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Subir evidencia</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />

          <Button variant="contained" onClick={enviar} disabled={!file}>
            Guardar
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
