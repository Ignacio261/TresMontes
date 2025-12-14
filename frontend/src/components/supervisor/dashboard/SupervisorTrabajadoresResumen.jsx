import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import api from "../../../services/api";

export default function SupervisorTrabajadoresResumen({ filtros }) {
  const [lista, setLista] = useState([]);

  const cargar = async () => {
    try {
      const res = await api.get("/trabajadores/", { params: filtros });
      setLista(res.data.results || res.data);
    } catch (err) {
      console.error("Error resumen trabajadores:", err);
    }
  };

  useEffect(() => {
    cargar();
  }, [filtros]);

  return (
    <Card
      sx={{
        backgroundColor: "#0f1c0f",
        border: "1px solid #1b5e20",
      }}
    >
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2, color: "white" }}>
          Trabajadores (vista rápida)
        </Typography>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: "white" }}>Nombre</TableCell>
              <TableCell sx={{ color: "white" }}>Cargo</TableCell>
              <TableCell sx={{ color: "white" }}>Sucursal</TableCell>
              <TableCell sx={{ color: "white" }}>Estado</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {lista.slice(0, 5).map((t) => (
              <TableRow key={t.id}>
                <TableCell sx={{ color: "white" }}>
                  {t.nombre} {t.apellido}
                </TableCell>
                <TableCell sx={{ color: "white" }}>{t.cargo}</TableCell>
                <TableCell sx={{ color: "white" }}>
                  {t.sucursal?.nombre || "-"}
                </TableCell>
                <TableCell sx={{ color: "white" }}>{t.estado}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {lista.length > 5 && (
          <Typography variant="caption" color="text.secondary">
            Mostrando 5 de {lista.length} trabajadores
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
