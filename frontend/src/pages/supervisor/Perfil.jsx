import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Divider,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate } from "react-router-dom";

const SupervisorPerfil = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <Box sx={{ p: 3, maxWidth: 600 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Perfil del Supervisor
      </Typography>

      <Card sx={{ background: "#0f1c0f", border: "1px solid #1b5e20" }}>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <PersonIcon sx={{ mr: 1 }} />
            <Typography variant="h6">Datos del usuario</Typography>
          </Box>

          <Divider sx={{ mb: 2 }} />

          <Typography>
            <strong>Usuario:</strong> {user.username}
          </Typography>
          <Typography>
            <strong>Rol:</strong> Supervisor
          </Typography>
          <Typography>
            <strong>Email:</strong> {user.email || "No registrado"}
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Button
            variant="contained"
            color="error"
            startIcon={<LogoutIcon />}
            onClick={cerrarSesion}
          >
            Cerrar sesión
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SupervisorPerfil;
