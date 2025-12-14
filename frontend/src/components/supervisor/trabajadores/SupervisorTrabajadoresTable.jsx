import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  CircularProgress,
  Box,
  Typography,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";

import SupervisorFiltrosTrabajadores from "./SupervisorFiltrosTrabajadores";
import api from "../../../services/api";
import { useNavigate } from "react-router-dom";

export default function SupervisorTrabajadoresTable() {
  const [trabajadores, setTrabajadores] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const [filtros, setFiltros] = useState({
    sucursal: "",
    departamento: "",
  });

  const cargar = async () => {
    setLoading(true);
    try {
      const res = await api.get("/trabajadores/", {
        params: filtros,
      });

      setTrabajadores(res.data.results || res.data);
    } catch (err) {
      console.error("Error cargando trabajadores:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, [filtros]);

  return (
    <>
      {/* FILTROS */}
      <Card
        sx={{
          mb: 3,
          backgroundColor: "#0f1c0f",
          border: "1px solid #1b5e20",
        }}
      >
        <CardContent>
          <SupervisorFiltrosTrabajadores
            filtros={filtros}
            onChange={(k, v) => setFiltros({ ...filtros, [k]: v })}
            onClear={() =>
              setFiltros({ sucursal: "", departamento: "" })
            }
          />
        </CardContent>
      </Card>

      {/* TABLA */}
      <Card
        sx={{
          backgroundColor: "#0f1c0f",
          border: "1px solid #1b5e20",
        }}
      >
        <CardContent>
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
                  <TableCell sx={{ color: "white" }}>Estado</TableCell>
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
                        {t.sucursal?.nombre || "-"}
                      </TableCell>
                      <TableCell sx={{ color: "white" }}>{t.estado}</TableCell>
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
        </CardContent>
      </Card>

      <Typography variant="caption" color="text.secondary" sx={{ mt: 2 }}>
        * Vista solo lectura para Supervisor
      </Typography>
    </>
  );
}
