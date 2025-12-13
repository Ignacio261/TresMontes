// src/components/Trabajadores/NuevoTrabajadorModal.jsx
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Tabs,
  Tab,
  Box,
  IconButton
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";

import TrabajadorForm from "./TrabajadorForm";
import CargaMasiva from "./CargaMasiva";

export default function NuevoTrabajadorModal({ open, onClose, onSuccess }) {
  const [tab, setTab] = useState(0);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Nuevo Trabajador
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 10, top: 10 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 0 }}>
        {/* Tabs */}
        <Tabs
          value={tab}
          onChange={(e, v) => setTab(v)}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Ingreso Manual" />
          <Tab label="Carga Masiva" />
        </Tabs>

        <Box sx={{ mt: 2 }}>
          {tab === 0 && (
            <TrabajadorForm
              open={true}
              onClose={onClose}
              onSaved={onSuccess}
            />
          )}

          {tab === 1 && (
            <CargaMasiva
              open={true}
              onClose={onClose}
              onSuccess={onSuccess}
            />
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
