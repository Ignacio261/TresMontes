import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  MenuItem,
  Chip,
} from "@mui/material";
import api from "../../services/api";

const estadoColor = {
  NO_GENERADO: "default",
  GENERADO: "warning",
  ENVIADO: "success",
};

const SupervisorQR = () => {
  const [registros, setRegistros] = useState([]);
  const [filtroSucursal, setFiltroSucursal] = useState("");
  const [filtroArea, setFiltroArea] = useState("");

  const cargar = async () => {
    try {
      const res = await api.get("/qr/");
      setRegistros(res.data);
    } catch (err) {
      console.error("Error cargando QR supervisor", err);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const filtrados = registros.filter((r) => {
    if (
      filtroSucursal &&
      r.trabajador?.sucursal?.nombre !== filtroSucursal
    )
      return false;

    if (
      filtroArea &&
      r.trabajador?.departamento?.nombre !== filtroArea
    )
      return false;

    return true;
  });

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Estado QR de Trabajadores
      </Typography>

      {/* Filtros */}
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <TextField
          select
          label="Sucursal"
          value={filtroSucursal}
          onChange={(e) => setFiltroSucursal(e.target.value)}
          sx={{ minWidth: 220 }}
        >
          <MenuItem value="">Todas</MenuItem>
          <MenuItem value="Casablanca">Casablanca</MenuItem>
          <MenuItem value="Valparaíso Planta BIF">Valparaíso Planta BIF</MenuItem>
          <MenuItem value="Valparaíso Planta BIC">Valparaíso Planta BIC</MenuItem>
        </TextField>

        <TextField
          select
          label="Área"
          value={filtroArea}
          onChange={(e) => setFiltroArea(e.target.value)}
          sx={{ minWidth: 220 }}
        >
          <MenuItem value="">Todas</MenuItem>
          <MenuItem value="Producción">Producción</MenuItem>
          <MenuItem value="Logística">Logística</MenuItem>
          <MenuItem value="Administración">Administración</MenuItem>
          <MenuItem value="Recursos Humanos">Recursos Humanos</MenuItem>
          <MenuItem value="Mantención">Mantención</MenuItem>
        </TextField>
      </Box>

      {/* Tabla */}
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Trabajador</TableCell>
              <TableCell>Sucursal</TableCell>
              <TableCell>Área</TableCell>
              <TableCell>Estado QR</TableCell>
              <TableCell>Generado</TableCell>
              <TableCell>Enviado</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filtrados.map((r) => (
              <TableRow key={r.id}>
                <TableCell>
                  {r.trabajador?.nombre} {r.trabajador?.apellido}
                </TableCell>
                <TableCell>
                  {r.trabajador?.sucursal?.nombre}
                </TableCell>
                <TableCell>
                  {r.trabajador?.departamento?.nombre}
                </TableCell>
                <TableCell>
                  <Chip
                    label={r.estado}
                    color={estadoColor[r.estado] || "default"}
                  />
                </TableCell>
                <TableCell>
                  {r.fecha_generado
                    ? new Date(r.fecha_generado).toLocaleDateString()
                    : "-"}
                </TableCell>
                <TableCell>
                  {r.fecha_enviado
                    ? new Date(r.fecha_enviado).toLocaleDateString()
                    : "-"}
                </TableCell>
              </TableRow>
            ))}

            {filtrados.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No hay registros QR
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default SupervisorQR;
