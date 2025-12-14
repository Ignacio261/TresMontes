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
  CircularProgress,
} from "@mui/material";
import api from "../../../services/api";

export default function SupervisorQRTable() {
  const [lista, setLista] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargar = async () => {
    try {
      const res = await api.get("/trabajadores/");
      setLista(res.data.results || res.data);
    } catch (err) {
      console.error("Error QR supervisor:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  return (
    <Card sx={{ background: "#0f1c0f", border: "1px solid #1b5e20" }}>
      <CardContent>
        {loading ? (
          <CircularProgress />
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: "white" }}>Trabajador</TableCell>
                <TableCell sx={{ color: "white" }}>Sucursal</TableCell>
                <TableCell sx={{ color: "white" }}>Estado QR</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {lista.map((t) => (
                <TableRow key={t.id}>
                  <TableCell sx={{ color: "white" }}>
                    {t.nombre} {t.apellido}
                  </TableCell>
                  <TableCell sx={{ color: "white" }}>
                    {t.sucursal?.nombre || "-"}
                  </TableCell>
                  <TableCell sx={{ color: "white" }}>
                    {t.qr_estado?.estado_simplificado || "No generado"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
