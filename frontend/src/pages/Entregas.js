import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import { LocalShipping as ShippingIcon } from '@mui/icons-material';
import { useState } from 'react';

const Entregas = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        <ShippingIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
        Gestión de Entregas
      </Typography>

      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Entrega Masiva" />
        <Tab label="Entrega por Grupo" />
        <Tab label="Historial" />
        <Tab label="Reportes" />
      </Tabs>

      <Alert severity="info" sx={{ mb: 3 }}>
        Este módulo está en desarrollo. Próximamente: Sistema completo de entregas con tracking, validación y reportes.
      </Alert>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Módulos de Entrega:
        </Typography>
        
        {tabValue === 0 && (
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Entrega General (Masiva)
            </Typography>
            <ul>
              <li>Endpoint: POST /api/entregas/masiva</li>
              <li>Parámetros: sucursal_id, beneficio_id, area_id</li>
              <li>Validación previa de trabajadores afectados</li>
              <li>Proceso asíncrono con WebSocket</li>
              <li>Confirmación con resumen</li>
            </ul>
          </Box>
        )}
        
        {tabValue === 1 && (
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Entrega por Grupo
            </Typography>
            <ul>
              <li>Endpoint: POST /api/entregas/grupo</li>
              <li>Sistema de selección dinámica</li>
              <li>Por departamento, tipo de contrato, rango de fechas</li>
              <li>Asignación múltiple de beneficios</li>
              <li>Preview antes de confirmar</li>
            </ul>
          </Box>
        )}
        
        {tabValue === 2 && (
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Historial de Entregas
            </Typography>
            <ul>
              <li>Tracking completo con estados</li>
              <li>Evidencias: fotos, firmas digitales</li>
              <li>Geolocalización del punto de entrega</li>
              <li>Timestamp de QR scan</li>
            </ul>
          </Box>
        )}
        
        {tabValue === 3 && (
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Reportes de Entregas
            </Typography>
            <ul>
              <li>Filtros por fecha, sucursal, supervisor</li>
              <li>Exportación Excel, CSV, PDF</li>
              <li>Dashboard de métricas en tiempo real</li>
              <li>Reportes programados automáticos</li>
            </ul>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default Entregas;