import React, { useEffect, useState } from "react";
import { Grid, Card, CardContent, Typography } from "@mui/material";
import api from "../../../services/api";

export default function SupervisorStats({ filtros }) {
  const [stats, setStats] = useState({
    total: 0,
    activos: 0,
    inactivos: 0,
  });

  const cargar = async () => {
    try {
      const res = await api.get("/trabajadores/", { params: filtros });
      const data = res.data.results || res.data;

      setStats({
        total: data.length,
        activos: data.filter((t) => t.estado === "activo").length,
        inactivos: data.filter((t) => t.estado === "inactivo").length,
      });
    } catch (err) {
      console.error("Error stats supervisor:", err);
    }
  };

  useEffect(() => {
    cargar();
  }, [filtros]);

  const cardStyle = {
    backgroundColor: "#0f1c0f",
    border: "1px solid #1b5e20",
    color: "white",
  };

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      <Grid item xs={12} md={4}>
        <Card sx={cardStyle}>
          <CardContent>
            <Typography variant="h6">Total Trabajadores</Typography>
            <Typography variant="h4">{stats.total}</Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card sx={cardStyle}>
          <CardContent>
            <Typography variant="h6">Activos</Typography>
            <Typography variant="h4">{stats.activos}</Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card sx={cardStyle}>
          <CardContent>
            <Typography variant="h6">Inactivos</Typography>
            <Typography variant="h4">{stats.inactivos}</Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
