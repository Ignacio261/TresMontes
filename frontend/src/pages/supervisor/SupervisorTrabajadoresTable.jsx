// src/components/supervisor/SupervisorTrabajadoresTable.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  CircularProgress,
  Typography,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";

import api from "../../services/api";
import SupervisorFiltrosTrabajadores from "./SupervisorFiltrosTrabajadores";
import { useNavigate } from "react-router-dom";

export default function SupervisorTrabajadoresTable() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [trabajadores, setTrabajadores] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);

  const [filtros, setFiltros] = useState({
    search: "",
    sucursal: "",
    departamento: "",
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [tRes, sRes, dRes] = await Promise.all([
        api.get("/trabajadores/", { params: filtros }),
        api.get("/configuracion/sucursales/"),
        api.get("/configuracion/areas/"),
      ]);

      setTrabajadores(tRes.data.results || tRes.data);
      setSucursales(sRes.data);
      setDepartamentos(dRes.data);
    } catch (e) {
      console.error("Error cargando trabajadores supervisor:", e);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [filtros]);

  const updateFiltro = (campo, valor) => {
    setFiltros({ ...filtros, [campo]: valor });
  };

  const clearFiltros = () => {
    setFiltros({ search: "", sucursal: "", departamento: "" });
  };

  return (
    <Card sx={{ background: "#0f1c0f", border: "1px solid #1b5e20" }}>
      <CardContent>
        <SupervisorFiltrosTrabajadores
          filtros={filtros}
          onChange={updateFiltro}
          onClear={clearFiltros}
          sucursales={sucursales}
          departamentos={departamentos}
        />

        <Box sx={{ mt: 3 }}>
          {loading ? (
            <Box sx={{ textAlign: "center", p: 3 }}>
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
                  <TableCell sx={{ color: "white" }}>Área</TableCell>
                  <TableCell sx={{ color: "white" }}>Acción</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {trabajadores.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ color: "gray" }}>
                      No hay trabajadores para mostrar
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
                      <TableCell sx={{ color: "white" }}>
                        {t.sucursal?.nombre}
                      </TableCell>
                      <TableCell sx={{ color: "white" }}>
                        {t.departamento?.nombre}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          color="primary"
                          onClick={() =>
                            navigate(`/supervisor/trabajadores/${t.id}`)
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
        </Box>
      </CardContent>
    </Card>
  );
}
