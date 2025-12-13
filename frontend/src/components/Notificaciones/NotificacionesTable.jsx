import React, { useEffect, useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  Box,
} from "@mui/material";

import DoneIcon from "@mui/icons-material/Done";

import NotifService from "../../services/notificaciones.service";

const NotificacionesTable = () => {
  const [lista, setLista] = useState([]);

  const cargar = async () => {
    try {
      const data = await NotifService.listar();

      // SEGURIDAD: siempre garantizar que lista sea array
      if (Array.isArray(data)) setLista(data);
      else {
        console.warn("Respuesta inesperada en notificaciones:", data);
        setLista([]);
      }

    } catch (error) {
      console.error("Error cargando notificaciones", error);
      setLista([]);
    }
  };

  const marcarLeído = async (id) => {
    try {
      await NotifService.marcarLeido(id);
      cargar();
    } catch (error) {
      console.error("Error marcando leído", error);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Historial de Notificaciones
      </Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Mensaje</TableCell>
            <TableCell>Fecha</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell align="right">Acción</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {lista.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.mensaje}</TableCell>
              <TableCell>{new Date(item.creado_en).toLocaleString()}</TableCell>
              <TableCell>{item.leido ? "Leído" : "No leído"}</TableCell>
              <TableCell align="right">
                {!item.leido && (
                  <IconButton onClick={() => marcarLeído(item.id)}>
                    <DoneIcon />
                  </IconButton>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {lista.length === 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography>No hay notificaciones.</Typography>
        </Box>
      )}
    </Paper>
  );
};

export default NotificacionesTable;
