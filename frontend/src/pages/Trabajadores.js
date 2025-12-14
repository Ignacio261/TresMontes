// src/pages/Trabajadores.jsx
import React, { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";

import TrabajadoresTable from "../components/Trabajadores/TrabajadorTable";
import NuevoTrabajadorModal from "../components/Trabajadores/NuevoTrabajadorModal";
import CargaMasiva from "../components/Trabajadores/CargaMasiva";

export default function Trabajadores() {
  const [openNuevo, setOpenNuevo] = useState(false);
  const [openCarga, setOpenCarga] = useState(false);
  const [reload, setReload] = useState(false);

  const refrescar = () => setReload(!reload);

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4">Gestión de Trabajadores</Typography>

        <Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ mr: 2 }}
            onClick={() => setOpenNuevo(true)}
          >
            Nuevo Trabajador
          </Button>

          <Button
            variant="outlined"
            onClick={() => setOpenCarga(true)}
          >
            Carga Masiva
          </Button>
        </Box>
      </Box>

      {/* Tabla */}
      <TrabajadoresTable reload={reload} />

      {/* Modales */}
      <NuevoTrabajadorModal
        open={openNuevo}
        onClose={() => setOpenNuevo(false)}
        onSuccess={() => {
          refrescar();
          setOpenNuevo(false);
        }}
      />

      <CargaMasiva
        open={openCarga}
        onClose={() => setOpenCarga(false)}
        onSuccess={() => {
          refrescar();
          setOpenCarga(false);
        }}
      />
    </Box>
  );
}
