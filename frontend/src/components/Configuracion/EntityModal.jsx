import React, { useState, useEffect } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField
} from "@mui/material";

export default function EntityModal({ open, onClose, title, initial = {}, onSave }) {
  const [form, setForm] = useState(initial);

  useEffect(() => setForm(initial), [initial, open]);

  const handleSave = () => onSave(form);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>

      <DialogContent>
        <TextField
          fullWidth
          label="Nombre / Clave"
          value={form.nombre || form.clave || ""}
          onChange={(e) => setForm({ ...form, nombre: e.target.value, clave: e.target.value })}
          sx={{ mt: 1 }}
        />

        <TextField
          fullWidth
          label="Descripción / Dirección"
          value={form.descripcion || form.direccion || ""}
          onChange={(e) => setForm({ ...form, descripcion: e.target.value, direccion: e.target.value })}
          sx={{ mt: 2 }}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleSave}>Guardar</Button>
      </DialogActions>
    </Dialog>
  );
}
