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

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      // RRHH
      if (username === "rrhh123" && password === "rrhh123") {
        localStorage.setItem("access_token", "demo-token");
        localStorage.setItem(
          "user",
          JSON.stringify({
            username: "rrhh123",
            rol: "rrhh_admin",
            nombre: "Administrador RRHH",
          })
        );
        navigate("/");
        return;
      }

      // SUPERVISOR
      if (username === "supervisor123" && password === "supervisor123") {
        localStorage.setItem("access_token", "demo-token");
        localStorage.setItem(
          "user",
          JSON.stringify({
            username: "supervisor123",
            rol: "supervisor",
            nombre: "Supervisor General",
          })
        );
        navigate("/supervisor");
        return;
      }

      setError("Credenciales incorrectas");
      setLoading(false);
    }, 600);
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 10 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Sistema GESENT
          </Typography>

          {error && <Alert severity="error">{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Usuario"
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <TextField
              fullWidth
              type="password"
              label="Contraseña"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3 }}
              disabled={loading}
              type="submit"
            >
              {loading ? <CircularProgress size={24} /> : "Ingresar"}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
