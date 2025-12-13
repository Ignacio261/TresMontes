import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  MenuItem,
  Typography
} from "@mui/material";

const tipos = [
  { value: "string", label: "Texto" },
  { value: "number", label: "Número" },
  { value: "boolean", label: "Booleano" },
  { value: "json", label: "JSON" },
];

const ParametroForm = ({
  open,
  onClose,
  onSave,
  editing = null,
}) => {
  const [form, setForm] = useState({
    clave: "",
    valor: "",
    descripcion: "",
    tipo: "string",
  });

  // Cargar valores si se edita
  useEffect(() => {
    if (editing) {
      setForm({
        clave: editing.clave || "",
        valor: editing.valor || "",
        descripcion: editing.descripcion || "",
        tipo: editing.tipo || "string",
      });
    } else {
      setForm({
        clave: "",
        valor: "",
        descripcion: "",
        tipo: "string",
      });
    }
  }, [editing]);

  const handleSave = () => {
    // Validación básica
    if (!form.clave.trim()) {
      alert("La clave es obligatoria");
      return;
    }

    if (form.tipo === "number" && isNaN(Number(form.valor))) {
      alert("El valor debe ser un número válido");
      return;
    }

    if (form.tipo === "json") {
      try {
            JSON.parse(form.valor);
      } catch (e) {
            alert("JSON inválido");
            return;
      }
    }

    onSave(form); // backend lo recibe limpio
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {editing ? "Editar Parámetro" : "Nuevo Parámetro"}
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mt: 1 }}>
          <TextField
            fullWidth
            margin="dense"
            label="Clave"
            value={form.clave}
            disabled={Boolean(editing)} 
            onChange={(e) => setForm({ ...form, clave: e.target.value })}
          />

          <TextField
            select
            fullWidth
            margin="dense"
            label="Tipo de Valor"
            value={form.tipo}
            onChange={(e) => setForm({ ...form, tipo: e.target.value })}
          >
            {tipos.map((t) => (
              <MenuItem key={t.value} value={t.value}>
                {t.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            margin="dense"
            label="Valor"
            multiline={form.tipo === "json"}
            minRows={form.tipo === "json" ? 3 : 1}
            value={form.valor}
            onChange={(e) => setForm({ ...form, valor: e.target.value })}
          />

          <TextField
            fullWidth
            margin="dense"
            label="Descripción"
            multiline
            minRows={2}
            value={form.descripcion}
            onChange={(e) =>
              setForm({ ...form, descripcion: e.target.value })
            }
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleSave}>
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ParametroForm;
