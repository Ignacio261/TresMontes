import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  Divider,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Alert,
  Snackbar
} from "@mui/material";

import api from "../../services/api";

const EntregaGeneral = () => {
  const [filtros, setFiltros] = useState({
    sucursal: "",
    area: "",
    estado: "",
  });

  const [beneficio, setBeneficio] = useState("");
  const [periodo, setPeriodo] = useState("");

  const [sucursales, setSucursales] = useState([]);
  const [areas, setAreas] = useState([]);
  const [beneficios, setBeneficios] = useState([]);
  const [periodos, setPeriodos] = useState([]);

  const [trabajadores, setTrabajadores] = useState([]);
  const [loading, setLoading] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [resultOpen, setResultOpen] = useState(false);
  const [resultado, setResultado] = useState(null);

  const [snack, setSnack] = useState({ open: false, msg: "", type: "info" });

  // --- CARGA PARAMETROS ---
  useEffect(() => {
    cargarConfiguraciones();
  }, []);

  const cargarConfiguraciones = async () => {
    try {
      const resSuc = await api.get("/configuracion/sucursales/");
      const resAreas = await api.get("/configuracion/areas/");
      const resBen = await api.get("/configuracion/beneficios/");
      const resPer = await api.get("/configuracion/periodos/");

      setSucursales(resSuc.data);
      setAreas(resAreas.data);
      setBeneficios(resBen.data);
      setPeriodos(resPer.data);
    } catch (err) {
      console.error(err);
      setSnack({ open: true, msg: "Error cargando configuraciones", type: "error" });
    }
  };

  const buscarTrabajadores = async () => {
    setLoading(true);
    try {
      const res = await api.get("/trabajadores/", {
        params: {
          sucursal: filtros.sucursal,
          departamento: filtros.area,
          estado: filtros.estado,
          page_size: 9999,
        },
      });
      setTrabajadores(res.data.results || []);
    } catch (err) {
      console.error(err);
      setSnack({ open: true, msg: "Error cargando trabajadores", type: "error" });
    }
    setLoading(false);
  };

  const enviarEntregaMasiva = async () => {
    setConfirmOpen(false);
    setLoading(true);

    try {
      const res = await api.post("/entregas/masiva/", {
        beneficio,
        periodo,
        sucursal: filtros.sucursal,
        area: filtros.area,
        estado_trabajador: filtros.estado,
      });

      setResultado(res.data);
      setResultOpen(true);

    } catch (err) {
      console.error(err);
      setSnack({ open: true, msg: "Error al generar entregas", type: "error" });
    }

    setLoading(false);
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Entrega General
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6">Filtrar trabajadores</Typography>

        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          <TextField
            select
            label="Sucursal"
            value={filtros.sucursal}
            onChange={(e) => setFiltros({ ...filtros, sucursal: e.target.value })}
            fullWidth
          >
            <MenuItem value="">Todas</MenuItem>
            {sucursales.map((s) => (
              <MenuItem key={s.id} value={s.nombre}>{s.nombre}</MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Área"
            value={filtros.area}
            onChange={(e) => setFiltros({ ...filtros, area: e.target.value })}
            fullWidth
          >
            <MenuItem value="">Todas</MenuItem>
            {areas.map((a) => (
              <MenuItem key={a.id} value={a.nombre}>{a.nombre}</MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Estado"
            value={filtros.estado}
            onChange={(e) => setFiltros({ ...filtros, estado: e.target.value })}
            fullWidth
          >
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="activo">Activo</MenuItem>
            <MenuItem value="licencia">Licencia</MenuItem>
            <MenuItem value="inactivo">Inactivo</MenuItem>
          </TextField>
        </Box>

        <Button variant="contained" sx={{ mt: 2 }} onClick={buscarTrabajadores}>
          Buscar trabajadores
        </Button>

        <Divider sx={{ my: 3 }} />

        <Typography variant="body1">
          <strong>Trabajadores encontrados:</strong> {trabajadores.length}
        </Typography>

        <Divider sx={{ my: 3 }} />

        {/* BENEFICIO Y PERIODO */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            select
            fullWidth
            label="Beneficio"
            value={beneficio}
            onChange={(e) => setBeneficio(e.target.value)}
          >
            {beneficios.map((b) => (
              <MenuItem key={b.id} value={b.nombre}>{b.nombre}</MenuItem>
            ))}
          </TextField>

          <TextField
            select
            fullWidth
            label="Periodo"
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
          >
            {periodos.map((p) => (
              <MenuItem key={p.id} value={p.clave}>{p.clave}</MenuItem>
            ))}
          </TextField>
        </Box>

        <Button
          variant="contained"
          color="success"
          sx={{ mt: 3 }}
          disabled={trabajadores.length === 0}
          onClick={() => setConfirmOpen(true)}
        >
          Generar entrega masiva
        </Button>
      </Paper>

      {/* CONFIRM MODAL */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirmar entrega masiva</DialogTitle>
        <DialogContent>
          <Typography>
            Se crearán entregas para <b>{trabajadores.length}</b> trabajadores.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancelar</Button>
          <Button variant="contained" color="success" onClick={enviarEntregaMasiva}>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      {/* RESULT MODAL */}
      <Dialog open={resultOpen} onClose={() => setResultOpen(false)}>
        <DialogTitle>Entrega masiva completada</DialogTitle>
        <DialogContent>
          <Typography>
            Entregas creadas: <b>{resultado?.creadas}</b>
          </Typography>
          <Typography>
            Trabajadores afectados: <b>{resultado?.trabajadores}</b>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResultOpen(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      {loading && (
        <Box sx={{ textAlign: "center", mt: 3 }}>
          <CircularProgress />
        </Box>
      )}

      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack({ ...snack, open: false })}
      >
        <Alert severity={snack.type}>{snack.msg}</Alert>
      </Snackbar>
    </Box>
  );
};

export default EntregaGeneral;
