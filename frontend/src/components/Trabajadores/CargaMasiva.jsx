// src/components/Trabajadores/CargaMasiva.jsx
import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import api from "../../services/api";

export default function CargaMasiva({ onClose, onSuccess }) {
  const [archivo, setArchivo] = useState(null);
  const [resultado, setResultado] = useState(null);

  const procesar = async () => {
    if (!archivo) return alert("Seleccione un archivo");

    const fd = new FormData();
    fd.append("archivo", archivo);

    const res = await api.post("trabajadores/carga_masiva/", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    setResultado(res.data);
    onSuccess();
  };

  return (
    <Box>
      <Typography>Subir archivo Excel .xlsx</Typography>

      <input type="file" accept=".xlsx" onChange={(e) => setArchivo(e.target.files[0])} />

      <Button variant="contained" sx={{ mt: 2 }} onClick={procesar}>
        Procesar archivo
      </Button>

      {resultado && (
        <Box sx={{ mt: 2 }}>
          <Typography><b>Resultados:</b></Typography>
          <Typography>Creados: {resultado.creados}</Typography>

          {resultado.errores.length > 0 && (
            <ul>
              {resultado.errores.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          )}
        </Box>
      )}
    </Box>
  );
}
