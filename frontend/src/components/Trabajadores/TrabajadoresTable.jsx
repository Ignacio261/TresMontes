import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
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

import api from "../../services/api";
import FiltrosTrabajadores from "./FiltrosTrabajadores";
import CargaMasiva from "./CargaMasiva";

import VisibilityIcon from "@mui/icons-material/Visibility";

export default function TrabajadoresTable() {
  const [trabajadores, setTrabajadores] = useState([]);
  const [loading, setLoading] = useState(false);

  // Estados para filtros
  const [filtros, setFiltros] = useState({
    search: "",
    sucursal: "",
    tipo_contrato: "",
    estado: "",
  });

  // Estado carga masiva
  const [openCarga, setOpenCarga] = useState(false);

  // Cargar trabajadores desde API
  const loadTrabajadores = async () => {
    setLoading(true);

    try {
      const res = await api.get("/trabajadores/", {
        params: {
          search: filtros.search,
          sucursal: filtros.sucursal,
          tipo_contrato: filtros.tipo_contrato,
          estado: filtros.estado,
        },
      });
      setTrabajadores(res.data.results || res.data);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  // Cargar lista al inicio y en cada cambio de filtros
  useEffect(() => {
    loadTrabajadores();
  }, [filtros]);

  // Manejo de filtros
  const updateFiltro = (campo, valor) => {
    setFiltros({ ...filtros, [campo]: valor });
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
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Gestión de Trabajadores
      </Typography>

      {/* Filtros */}
      <Card sx={{ mb: 3, background: "#0f1c0f", border: "1px solid #1b5e20" }}>
        <CardContent>
          <FiltrosTrabajadores
            filtros={filtros}
            onChange={updateFiltro}
            onClear={clearFiltros}
          />
        </CardContent>
      </Card>

      {/* Botones superiores */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          sx={{ mr: 2 }}
          onClick={() => (window.location.href = "/trabajadores/nuevo")}
        >
          + Nuevo Trabajador
        </Button>

        <Button
          variant="contained"
          color="secondary"
          onClick={() => setOpenCarga(true)}
        >
          📥 Carga Masiva
        </Button>
      </Box>

      {/* Tabla de trabajadores */}
      <Card sx={{ background: "#0f1c0f", border: "1px solid #1b5e20" }}>
        <CardContent>
          {loading ? (
            <Box sx={{ textAlign: "center", p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell style={{ color: "white" }}>RUT</TableCell>
                  <TableCell style={{ color: "white" }}>Nombre</TableCell>
                  <TableCell style={{ color: "white" }}>Cargo</TableCell>
                  <TableCell style={{ color: "white" }}>Sucursal</TableCell>
                  <TableCell style={{ color: "white" }}>Estado</TableCell>
                  <TableCell style={{ color: "white" }}>Acciones</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {trabajadores.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ color: "gray" }}>
                      No hay trabajadores registrados.
                    </TableCell>
                  </TableRow>
                ) : (
                  trabajadores.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell sx={{ color: "white" }}>{t.rut}</TableCell>
                      <TableCell sx={{ color: "white" }}>
                        {t.nombre} {t.apellido}
                      </TableCell>
                      <TableCell sx={{ color: "white" }}>{t.cargo}</TableCell>
                      <TableCell sx={{ color: "white" }}>{t.sucursal}</TableCell>
                      <TableCell sx={{ color: "white" }}>{t.estado}</TableCell>

                      <TableCell>
                        <IconButton
                          color="primary"
                          onClick={() =>
                            (window.location.href = `/trabajadores/${t.id}`)
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

      {/* Modal carga masiva */}
      <CargaMasiva
        open={openCarga}
        onClose={() => setOpenCarga(false)}
        onSuccess={loadTrabajadores}
      />
    </Box>
  );
}
