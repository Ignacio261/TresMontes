import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box
} from "@mui/material";

import NotifService from "../../services/notificaciones.service";
import { trabajadoresService } from "../../services/trabajadoresService";
import ConfigService from "../../services/config.service";

const EnviarNotificacionModal = ({ open, onClose, onSuccess }) => {
  const [tipoEnvio, setTipoEnvio] = useState("individual");

  const [trabajadores, setTrabajadores] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);

  const [form, setForm] = useState({
    trabajador_id: "",
    sucursal_id: "",
    departamento_id: "",
    titulo: "Tu beneficio está disponible",
    mensaje: "Estimado trabajador, ya puedes retirar su beneficio."
  });

  // ============================================================
  // CARGAR TRABAJADORES (corrección definitiva)
  // ============================================================
  const loadTrabajadores = async () => {
    try {
      const res = await trabajadoresService.list();

      // DRF paginado → usar res.results
      let lista = [];
      if (res && Array.isArray(res.results)) lista = res.results;
      else if (Array.isArray(res)) lista = res;
      else lista = [];

      setTrabajadores(lista);
    } catch (e) {
      console.error("Error cargando trabajadores", e);
      setTrabajadores([]);
    }
  };

  const loadSucursales = async () => {
    try {
      const res = await ConfigService.sucursales.list();
      setSucursales(Array.isArray(res) ? res : []);
    } catch {
      setSucursales([]);
    }
  };

  const loadDepartamentos = async () => {
    try {
      const res = await ConfigService.areas.list();
      setDepartamentos(Array.isArray(res) ? res : []);
    } catch {
      setDepartamentos([]);
    }
  };

  useEffect(() => {
    if (open) {
      loadTrabajadores();
      loadSucursales();
      loadDepartamentos();
    }
  }, [open]);

  // ============================================================
  // ENVIAR NOTIFICACIÓN
  // ============================================================
  const enviar = async () => {
    try {
      const payload = {
        tipo: tipoEnvio,
        trabajador_id: form.trabajador_id,
        sucursal_id: form.sucursal_id,
        departamento_id: form.departamento_id,
        titulo: form.titulo,
        mensaje: form.mensaje,
      };

      await NotifService.enviar(payload);

      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error("Error enviando notificación", error);
      alert("Error al enviar la notificación.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Enviar Notificación</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 1 }}>

          {/* Tipo de envío */}
          <TextField
            select
            fullWidth
            label="Enviar a"
            value={tipoEnvio}
            onChange={(e) => setTipoEnvio(e.target.value)}
            sx={{ mb: 2 }}
          >
            <MenuItem value="individual">Individual</MenuItem>
            <MenuItem value="sucursal">Por Sucursal</MenuItem>
            <MenuItem value="departamento">Por Departamento</MenuItem>
          </TextField>

          {/* Campos dinámicos */}
          {tipoEnvio === "individual" && (
            <TextField
              select
              fullWidth
              label="Trabajador"
              sx={{ mb: 2 }}
              value={form.trabajador_id}
              onChange={(e) => setForm({ ...form, trabajador_id: e.target.value })}
            >
              {trabajadores.map((t) => (
                <MenuItem key={t.id} value={t.id}>
                  {t.nombre} {t.apellido} ({t.rut})
                </MenuItem>
              ))}
            </TextField>
          )}

          {tipoEnvio === "sucursal" && (
            <TextField
              select
              fullWidth
              label="Sucursal"
              sx={{ mb: 2 }}
              value={form.sucursal_id}
              onChange={(e) => setForm({ ...form, sucursal_id: e.target.value })}
            >
              {sucursales.map((s) => (
                <MenuItem key={s.id} value={s.id}>
                  {s.nombre}
                </MenuItem>
              ))}
            </TextField>
          )}

          {tipoEnvio === "departamento" && (
            <TextField
              select
              fullWidth
              label="Departamento"
              sx={{ mb: 2 }}
              value={form.departamento_id}
              onChange={(e) => setForm({ ...form, departamento_id: e.target.value })}
            >
              {departamentos.map((d) => (
                <MenuItem key={d.id} value={d.id}>
                  {d.nombre}
                </MenuItem>
              ))}
            </TextField>
          )}

          {/* Título */}
          <TextField
            fullWidth
            label="Título"
            sx={{ mb: 2 }}
            value={form.titulo}
            onChange={(e) => setForm({ ...form, titulo: e.target.value })}
          />

          {/* Mensaje */}
          <TextField
            fullWidth
            multiline
            minRows={3}
            label="Mensaje"
            value={form.mensaje}
            onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
          />

        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={enviar}>
          Enviar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EnviarNotificacionModal;
