import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Table, TableHead, TableRow, TableCell, TableBody, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfigService from "../../services/config.service";
import EntityModal from "./EntityModal";

export default function SucursalesList() {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    const res = await ConfigService.sucursales.list();
    setData(res.data || res);
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (form) => {
    if (editing) {
      await ConfigService.sucursales.update(editing.id, form);
    } else {
      await ConfigService.sucursales.create(form);
    }
    setOpen(false);
    setEditing(null);
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar sucursal?")) return;
    await ConfigService.sucursales.remove(id);
    load();
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h6">Sucursales</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>Nueva</Button>
      </Box>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Dirección</TableCell>
            <TableCell>Activo</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map(s => (
            <TableRow key={s.id}>
              <TableCell>{s.nombre}</TableCell>
              <TableCell>{s.direccion}</TableCell>
              <TableCell>{s.activo ? "Sí" : "No"}</TableCell>
              <TableCell>
                <IconButton onClick={() => { setEditing(s); setOpen(true); }}><EditIcon/></IconButton>
                <IconButton onClick={() => handleDelete(s.id)}><DeleteIcon/></IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <EntityModal
        open={open}
        onClose={() => { setOpen(false); setEditing(null); }}
        title={editing ? "Editar Sucursal" : "Nueva Sucursal"}
        initial={editing || {}}
        onSave={handleSave}
      />
    </Box>
  );
}
