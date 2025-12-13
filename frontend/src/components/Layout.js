import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';

import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  QrCode as QrCodeIcon,
  LocalShipping as ShippingIcon,
  Notifications as NotificationsIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  ChevronLeft as ChevronLeftIcon,
} from '@mui/icons-material';

// 🔔 NUEVOS COMPONENTES
import NotificacionesIcon from "./Notificaciones/NotificacionesIcon";
import HistorialNotificaciones from "./Notificaciones/HistorialNotificaciones";

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'Trabajadores', icon: <PeopleIcon />, path: '/trabajadores' },
  { text: 'Gestión QR', icon: <QrCodeIcon />, path: '/qr' },
  { text: 'Entregas', icon: <ShippingIcon />, path: '/entregas' },
  { text: 'Notificaciones', icon: <NotificationsIcon />, path: '/notificaciones' },
  { text: 'Reportes', icon: <AssessmentIcon />, path: '/reportes' },
  { text: 'Configuración', icon: <SettingsIcon />, path: '/configuracion' },
];

const Layout = () => {
  const [open, setOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openHistorial, setOpenHistorial] = useState(false); // 🔔 HISTORIAL MODAL

  const navigate = useNavigate();

  const handleDrawerToggle = () => setOpen(!open);
  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('token'); // fallback
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleNavigation = (path) => navigate(path);

  const user = JSON.parse(localStorage.getItem('user') || '{"username":"admin","rol":"rrhh_admin","nombre":"Administrador"}');

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {/* ===========================
          TOPBAR
      ============================ */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>

          <IconButton color="inherit" onClick={handleDrawerToggle} edge="start" sx={{ mr: 2 }}>
            {open ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>

          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            TRESMONTES • RRHH
          </Typography>

          {/* 🔔 CAMPANA DE NOTIFICACIONES */}
          <NotificacionesIcon onOpenHistorial={() => setOpenHistorial(true)} />

          {/* PERFIL */}
          <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
            <Avatar sx={{ bgcolor: 'secondary.main', width: 40, height: 40 }}>
              {user.username?.charAt(0).toUpperCase() || 'A'}
            </Avatar>
          </IconButton>

          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem disabled>
              <Box>
                <Typography variant="body1" fontWeight="medium">
                  {user.nombre || user.username}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user.rol?.toUpperCase()}
                </Typography>
              </Box>
            </MenuItem>

            <Divider />

            <MenuItem onClick={() => { handleMenuClose(); handleNavigation('/configuracion'); }}>
              <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
              Configuración
            </MenuItem>

            <MenuItem onClick={() => { handleMenuClose(); handleLogout(); }}>
              <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
              Cerrar Sesión
            </MenuItem>
          </Menu>

        </Toolbar>
      </AppBar>

      {/* ===========================
          SIDEBAR
      ============================ */}
      <Drawer
        variant="permanent"
        sx={{
          width: open ? drawerWidth : 60,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: open ? drawerWidth : 60,
            transition: "0.3s",
            overflowX: 'hidden',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
                <ListItemButton
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                    '&:hover': {
                      bgcolor: 'primary.light',
                      color: 'white',
                    }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto' }}>
                    {item.icon}
                  </ListItemIcon>

                  <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>

        {open && (
          <Box sx={{ p: 2, mt: 'auto', textAlign: 'center', borderTop: 1, borderColor: 'divider' }}>
            <Typography variant="caption">Sistema RRHH v1.0</Typography>
            <Typography variant="caption" display="block">© 2025 Tresmontes</Typography>
          </Box>
        )}
      </Drawer>

      {/* ===========================
          MAIN CONTENT
      ============================ */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>

      {/* 🔔 Modal Historial */}
      <HistorialNotificaciones
        open={openHistorial}
        onClose={() => setOpenHistorial(false)}
      />
    </Box>
  );
};

export default Layout;
