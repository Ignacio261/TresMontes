import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import ConfigService from "../../services/config.service";

const BeneficiosList = () => {
  const [beneficios, setBeneficios] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    activo: true,
  });

  const loadData = async () => {
    try {
      const res = await ConfigService.beneficios.list();
      setBeneficios(res);
    } catch (err) {
      console.error("Error cargando beneficios:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async () => {
    try {
      if (editing) {
        await ConfigService.beneficios.update(editing.id, form);
      } else {
        await ConfigService.beneficios.create(form);
      }
      setOpen(false);
      setEditing(null);
      setForm({ nombre: "", descripcion: "", activo: true });
      loadData();
    } catch (err) {
      console.error("Error guardando beneficio:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar beneficio?")) return;
    try {
      await ConfigService.beneficios.delete(id);
      loadData();
    } catch (err) {
      console.error("Error eliminando beneficio:", err);
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Beneficios
      </Typography>

      <Button
        variant="contained"
        startIcon={<Add />}
        sx={{ mb: 2 }}
        onClick={() => setOpen(true)}
      >
        Nuevo Beneficio
      </Button>

      {/* Tabla */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Activo</TableCell>
              <TableCell width={120}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {beneficios.map((b) => (
              <TableRow key={b.id}>
                <TableCell>{b.nombre}</TableCell>
                <TableCell>{b.descripcion}</TableCell>
                <TableCell>{b.activo ? "Sí" : "No"}</TableCell>
                <TableCell>
                  <IconButton
                    color="warning"
                    onClick={() => {
                      setEditing(b);
                      setForm(b);
                      setOpen(true);
                    }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(b.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {beneficios.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No hay beneficios registrados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>
          {editing ? "Editar Beneficio" : "Nuevo Beneficio"}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Nombre"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          />
          <TextField
            fullWidth
            margin="dense"
            multiline
            label="Descripción"
            value={form.descripcion}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BeneficiosList;
