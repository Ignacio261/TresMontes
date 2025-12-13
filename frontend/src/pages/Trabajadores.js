// src/pages/Trabajadores.jsx
import React, { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";

import NuevoTrabajadorModal from "../components/Trabajadores/NuevoTrabajadorModal";

export default function Trabajadores() {
  const [openModal, setOpenModal] = useState(false);

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4">Gestión de Trabajadores</Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenModal(true)}
        >
          Nuevo Trabajador
        </Button>
      </Box>

      {/* Aquí irá la tabla real en tu siguiente fase */}
      <Typography>Próximamente: Lista completa de trabajadores.</Typography>

      {/* Modal principal */}
      <NuevoTrabajadorModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSuccess={() => {
          console.log("Nuevo trabajador registrado");
        }}
      />
    </Box>
  );
}
