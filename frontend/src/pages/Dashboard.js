import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  LinearProgress,
  Button,
} from '@mui/material';
import {
  People as PeopleIcon,
  QrCode as QrCodeIcon,
  LocalShipping as ShippingIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Add as AddIcon,
  Email as EmailIcon,
} from '@mui/icons-material';

const StatCard = ({ title, value, icon, color, subtitle }) => (
  <Card elevation={2}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box sx={{ 
          color: 'white', 
          bgcolor: color, 
          p: 1, 
          borderRadius: 1,
          mr: 2 
        }}>
          {icon}
        </Box>
        <Typography color="textSecondary" gutterBottom>
          {title}
        </Typography>
      </Box>
      <Typography variant="h4" component="div" sx={{ mb: 1 }}>
        {value}
      </Typography>
      {subtitle && (
        <Typography variant="body2" color="textSecondary">
          {subtitle}
        </Typography>
      )}
    </CardContent>
  </Card>
);

const QuickAction = ({ icon, title, description, onClick, color }) => (
  <Card 
    elevation={1} 
    sx={{ 
      cursor: 'pointer', 
      '&:hover': { bgcolor: '#f5f5f5' },
      height: '100%'
    }}
    onClick={onClick}
  >
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box sx={{ color, mr: 2 }}>
          {icon}
        </Box>
        <Typography variant="subtitle1" fontWeight="medium">
          {title}
        </Typography>
      </Box>
      <Typography variant="body2" color="textSecondary">
        {description}
      </Typography>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTrabajadores: 156,
    activos: 142,
    inactivos: 14,
    qrGenerados: 23,
    entregasHoy: 18,
    pendientes: 5,
  });

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const quickActions = [
    {
      icon: <AddIcon />,
      title: 'Nuevo Trabajador',
      description: 'Registrar nuevo empleado en el sistema',
      color: '#1976d2',
      path: '/trabajadores'
    },
    {
      icon: <QrCodeIcon />,
      title: 'Generar QR',
      description: 'Crear código QR para entrega',
      color: '#ed6c02',
      path: '/qr'
    },
    {
      icon: <ShippingIcon />,
      title: 'Entrega Masiva',
      description: 'Programar entrega para múltiples trabajadores',
      color: '#2e7d32',
      path: '/entregas'
    },
    {
      icon: <EmailIcon />,
      title: 'Enviar Notificación',
      description: 'Comunicado a todos los trabajadores',
      color: '#9c27b0',
      path: '#'
    },
  ];

  const handleQuickAction = (path) => {
    if (path === '#') {
      alert('Funcionalidad en desarrollo');
    } else {
      window.location.href = path;
    }
  };

  if (loading) {
    return <LinearProgress />;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Dashboard
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Bienvenido, {user.nombre || 'Administrador'}. Aquí tienes un resumen del sistema.
          </Typography>
        </Box>
        <Typography variant="body2" color="textSecondary">
          {new Date().toLocaleDateString('es-ES', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </Typography>
      </Box>

      {/* Estadísticas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Trabajadores"
            value={stats.totalTrabajadores}
            icon={<PeopleIcon />}
            color="#1976d2"
            subtitle={`${stats.activos} activos`}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="QR Generados Hoy"
            value={stats.qrGenerados}
            icon={<QrCodeIcon />}
            color="#ed6c02"
            subtitle="15 min de validez"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Entregas Hoy"
            value={stats.entregasHoy}
            icon={<CheckCircleIcon />}
            color="#2e7d32"
            subtitle={`${stats.pendientes} pendientes`}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Incidencias"
            value={stats.inactivos}
            icon={<WarningIcon />}
            color="#d32f2f"
            subtitle="Requieren atención"
          />
        </Grid>
      </Grid>

      {/* Acciones Rápidas */}
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        Acciones Rápidas
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {quickActions.map((action, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <QuickAction
              icon={action.icon}
              title={action.title}
              description={action.description}
              color={action.color}
              onClick={() => handleQuickAction(action.path)}
            />
          </Grid>
        ))}
      </Grid>

      {/* Información del Sistema */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Actividad Reciente
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {[
                { time: '10:30', action: 'QR generado para Juan Pérez', user: 'admin' },
                { time: '09:45', action: 'Entrega completada - María González', user: 'supervisor1' },
                { time: '09:15', action: 'Nuevo trabajador registrado', user: 'operador' },
                { time: 'Ayer', action: 'Reporte mensual generado', user: 'admin' },
              ].map((item, index) => (
                <Box 
                  key={index} 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    p: 2, 
                    bgcolor: index % 2 === 0 ? '#fafafa' : 'transparent',
                    borderRadius: 1
                  }}
                >
                  <Typography variant="body2" color="textSecondary" sx={{ minWidth: 60 }}>
                    {item.time}
                  </Typography>
                  <Typography variant="body2" sx={{ flex: 1 }}>
                    {item.action}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {item.user}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Información del Sistema
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="textSecondary">Usuario:</Typography>
                <Typography variant="body2">{user.username || 'admin'}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="textSecondary">Rol:</Typography>
                <Typography variant="body2" fontWeight="medium">{user.rol?.toUpperCase() || 'RRHH_ADMIN'}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="textSecondary">Sucursal:</Typography>
                <Typography variant="body2">{user.sucursal || 'Casablanca'}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="textSecondary">Versión:</Typography>
                <Typography variant="body2">1.0.0</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="textSecondary">Estado:</Typography>
                <Typography variant="body2" color="success.main">● En línea</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;