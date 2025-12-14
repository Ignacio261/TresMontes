import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  CircularProgress,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";

import api from "../../services/api";
import FiltrosTrabajadores from "./FiltrosTrabajadores";

export default function TrabajadoresTable({ reload }) {
  const [trabajadores, setTrabajadores] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filtros, setFiltros] = useState({
    search: "",
    sucursal: "",
    tipo_contrato: "",
    estado: "",
  });

  const loadTrabajadores = async () => {
    setLoading(true);
    try {
      const res = await api.get("/trabajadores/", {
        params: {
          search: filtros.search || undefined,
          sucursal: filtros.sucursal || undefined,
          tipo_contrato: filtros.tipo_contrato || undefined,
          estado: filtros.estado || undefined,
        },
      });

      // Soporta paginación DRF o lista directa
      const data = res.data.results || res.data;
      setTrabajadores(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error cargando trabajadores:", err);
      setTrabajadores([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadTrabajadores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtros, reload]);

  const updateFiltro = (campo, valor) => {
    setFiltros((prev) => ({ ...prev, [campo]: valor }));
  };

  const clearFiltros = () => {
    setFiltros({
      search: "",
      sucursal: "",
      tipo_contrato: "",
      estado: "",
    });
  };

  return (
    <Box>
      {/* Filtros */}
      <Card
        sx={{
          mb: 3,
          backgroundColor: "#0f1c0f",
          border: "1px solid #1b5e20",
        }}
      >
        <CardContent>
          <FiltrosTrabajadores
            filtros={filtros}
            onChange={updateFiltro}
            onClear={clearFiltros}
          />
        </CardContent>
      </Card>

      {/* Tabla */}
      <Card
        sx={{
          backgroundColor: "#0f1c0f",
          border: "1px solid #1b5e20",
        }}
      >
        <CardContent>
          {loading ? (
            <Box sx={{ textAlign: "center", p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: "white" }}>RUT</TableCell>
                  <TableCell sx={{ color: "white" }}>Nombre</TableCell>
                  <TableCell sx={{ color: "white" }}>Cargo</TableCell>
                  <TableCell sx={{ color: "white" }}>Sucursal</TableCell>
                  <TableCell sx={{ color: "white" }}>Estado</TableCell>
                  <TableCell sx={{ color: "white" }} align="center">
                    Acciones
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {trabajadores.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      align="center"
                      sx={{ color: "gray" }}
                    >
                      No hay trabajadores registrados.
                    </TableCell>
                  </TableRow>
                ) : (
                  trabajadores.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell sx={{ color: "white" }}>
                        {t.rut}
                      </TableCell>

                      <TableCell sx={{ color: "white" }}>
                        {t.nombre} {t.apellido}
                      </TableCell>

                      <TableCell sx={{ color: "white" }}>
                        {t.cargo || "-"}
                      </TableCell>

                      <TableCell sx={{ color: "white" }}>
                        {t.sucursal?.nombre || "-"}
                      </TableCell>

                      <TableCell sx={{ color: "white" }}>
                        {t.estado}
                      </TableCell>

                      <TableCell align="center">
                        <IconButton
                          color="primary"
                          onClick={() =>
                            window.location.href = `/trabajadores/${t.id}`
                          }
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
