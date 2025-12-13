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

const PeriodosList = () => {
  const [periodos, setPeriodos] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    clave: "",
    fecha_inicio: "",
    fecha_fin: "",
    activo: true,
  });

  const loadData = async () => {
    try {
      const res = await ConfigService.periodos.list();
      setPeriodos(res);
    } catch (err) {
      console.error("Error cargando períodos:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async () => {
    try {
      if (editing) {
        await ConfigService.periodos.update(editing.id, form);
      } else {
        await ConfigService.periodos.create(form);
      }
      setOpen(false);
      setEditing(null);
      setForm({
        clave: "",
        fecha_inicio: "",
        fecha_fin: "",
        activo: true,
      });
      loadData();
    } catch (err) {
      console.error("Error guardando período:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar período?")) return;
    try {
      await ConfigService.periodos.delete(id);
      loadData();
    } catch (err) {
      console.error("Error eliminando período:", err);
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Períodos
      </Typography>

      <Button
        variant="contained"
        startIcon={<Add />}
        sx={{ mb: 2 }}
        onClick={() => setOpen(true)}
      >
        Nuevo Período
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Clave</TableCell>
              <TableCell>Fecha Inicio</TableCell>
              <TableCell>Fecha Fin</TableCell>
              <TableCell>Activo</TableCell>
              <TableCell width={120}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {periodos.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.clave}</TableCell>
                <TableCell>{p.fecha_inicio}</TableCell>
                <TableCell>{p.fecha_fin}</TableCell>
                <TableCell>{p.activo ? "Sí" : "No"}</TableCell>
                <TableCell>
                  <IconButton
                    color="warning"
                    onClick={() => {
                      setEditing(p);
                      setForm(p);
                      setOpen(true);
                    }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(p.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {periodos.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No hay períodos registrados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>
          {editing ? "Editar Período" : "Nuevo Período"}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Clave"
            margin="dense"
            value={form.clave}
            onChange={(e) => setForm({ ...form, clave: e.target.value })}
          />

          <TextField
            fullWidth
            margin="dense"
            type="date"
            label="Fecha Inicio"
            InputLabelProps={{ shrink: true }}
            value={form.fecha_inicio}
            onChange={(e) =>
              setForm({ ...form, fecha_inicio: e.target.value })
            }
          />

          <TextField
            fullWidth
            margin="dense"
            type="date"
            label="Fecha Fin"
            InputLabelProps={{ shrink: true }}
            value={form.fecha_fin}
            onChange={(e) => setForm({ ...form, fecha_fin: e.target.value })}
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

export default PeriodosList;
