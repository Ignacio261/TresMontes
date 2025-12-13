// src/pages/Login.js

import React, { useState } from "react";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://127.0.0.1:8000/api/token/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const err = await res.json();
        setError(err.detail || "Credenciales inválidas");
        setLoading(false);
        return;
      }

      const data = await res.json();

      // Guardar tokens
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);

      // Guardar datos usuario
      localStorage.setItem(
        "user",
        JSON.stringify({
          username,
          nombre: username,
          rol: "rrhh_admin",
        })
      );

      navigate("/");

    } catch (err) {
      console.error(err);
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ mt: 10, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Paper elevation={4} sx={{ p: 4, width: "100%", textAlign: "center" }}>
          
          <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold" }}>
            LOGIN RRHH
          </Typography>

          {error && <Alert severity="error">{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField fullWidth label="Usuario" margin="normal"
              value={username} onChange={(e) => setUsername(e.target.value)} />

            <TextField fullWidth label="Contraseña" type="password" margin="normal"
              value={password} onChange={(e) => setPassword(e.target.value)} />

            <Button variant="contained" type="submit" fullWidth disabled={loading} sx={{ mt: 3 }}>
              {loading ? <CircularProgress size={24} /> : "Ingresar"}
            </Button>

            <Typography variant="body2" sx={{ mt: 2 }}>
              Usuario de prueba: rrhh123 / rrhh123
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
