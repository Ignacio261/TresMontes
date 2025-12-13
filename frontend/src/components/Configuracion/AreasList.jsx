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

const AreasList = () => {
  const [areas, setAreas] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ nombre: "", descripcion: "" });

  // ================================
  // Cargar datos (con safeArray)
  // ================================
  const loadData = async () => {
    try {
      const res = await ConfigService.areas.list();

      if (Array.isArray(res)) {
        setAreas(res);
      } else {
        console.warn("Respuesta inesperada:", res);
        setAreas([]);
      }

    } catch (err) {
      console.error("Error cargando áreas:", err);
      setAreas([]);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ================================
  // Guardar / editar área
  // ================================
  const handleSave = async () => {
    try {
      if (editing) {
        await ConfigService.areas.update(editing.id, form);
      } else {
        await ConfigService.areas.create(form);
      }

      setOpen(false);
      setEditing(null);
      setForm({ nombre: "", descripcion: "" });

      loadData();

    } catch (err) {
      console.error("Error guardando área:", err);
    }
  };

  // ================================
  // Eliminar
  // ================================
  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar área?")) return;

    try {
      await ConfigService.areas.remove(id);
      loadData();
    } catch (err) {
      console.error("Error eliminando área:", err);
    }
  };

  // ================================
  // Render
  // ================================
  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Áreas
      </Typography>

      <Button
        variant="contained"
        startIcon={<Add />}
        sx={{ mb: 2 }}
        onClick={() => {
          setEditing(null);
          setForm({ nombre: "", descripcion: "" });
          setOpen(true);
        }}
      >
        Nueva Área
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell width={120}>Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {areas.map((a) => (
              <TableRow key={a.id}>
                <TableCell>{a.nombre}</TableCell>
                <TableCell>{a.descripcion}</TableCell>

                <TableCell>
                  <IconButton
                    color="warning"
                    onClick={() => {
                      setEditing(a);
                      setForm(a);
                      setOpen(true);
                    }}
                  >
                    <Edit />
                  </IconButton>

                  <IconButton
                    color="error"
                    onClick={() => handleDelete(a.id)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}

            {areas.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No hay áreas registradas.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{editing ? "Editar Área" : "Nueva Área"}</DialogTitle>

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
            label="Descripción"
            value={form.descripcion}
            multiline
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

export default AreasList;
