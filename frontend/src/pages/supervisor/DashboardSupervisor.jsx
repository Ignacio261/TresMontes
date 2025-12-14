// src/pages/supervisor/DashboardSupervisor.jsx
import React, { useEffect, useState } from "react";
import { Grid, Card, CardContent, Typography } from "@mui/material";
import api from "../../services/api";

export default function DashboardSupervisor() {
  const [stats, setStats] = useState(null);

  const loadStats = async () => {
    try {
      const res = await api.get("/trabajadores/estadisticas/");
      setStats(res.data);
    } catch (err) {
      console.error("Error cargando estadísticas", err);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (!stats) return <Typography>Cargando...</Typography>;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={4}>
        <Card>
          <CardContent>
            <Typography variant="h6">Total Trabajadores</Typography>
            <Typography variant="h4">{stats.total}</Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={4}>
        <Card>
          <CardContent>
            <Typography variant="h6">Por Sucursal</Typography>
            {stats.por_sucursal.map((s) => (
              <Typography key={s.sucursal__nombre}>
                {s.sucursal__nombre}: {s.total}
              </Typography>
            ))}
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={4}>
        <Card>
          <CardContent>
            <Typography variant="h6">Por Estado</Typography>
            {stats.por_estado.map((e) => (
              <Typography key={e.estado}>
                {e.estado}: {e.total}
              </Typography>
            ))}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
