import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  IconButton,
} from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import api from "../../../services/api";

export default function SupervisorNotificacionesTable() {
  const [lista, setLista] = useState([]);

  const cargar = async () => {
    try {
      const res = await api.get("/notificaciones/");
      setLista(res.data);
    } catch (err) {
      console.error("Error notificaciones supervisor:", err);
    }
  };

  const marcarLeida = async (id) => {
    await api.post(`/notificaciones/${id}/leer/`);
    cargar();
  };

  useEffect(() => {
    cargar();
  }, []);

  return (
    <Card sx={{ background: "#0f1c0f", border: "1px solid #1b5e20" }}>
      <CardContent>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: "white" }}>Título</TableCell>
              <TableCell sx={{ color: "white" }}>Mensaje</TableCell>
              <TableCell sx={{ color: "white" }}>Estado</TableCell>
              <TableCell sx={{ color: "white" }}>Acción</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {lista.map((n) => (
              <TableRow key={n.id}>
                <TableCell sx={{ color: "white" }}>{n.titulo}</TableCell>
                <TableCell sx={{ color: "white" }}>{n.mensaje}</TableCell>
                <TableCell sx={{ color: "white" }}>
                  {n.leido ? "Leída" : "No leída"}
                </TableCell>
                <TableCell>
                  {!n.leido && (
                    <IconButton onClick={() => marcarLeida(n.id)}>
                      <DoneIcon />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {lista.length === 0 && (
          <Typography sx={{ mt: 2 }} color="text.secondary">
            No hay notificaciones.
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
