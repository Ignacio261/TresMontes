import React, { useState } from "react";
import { Button, Stack } from "@mui/material";

import FiltrosEntregas from "../components/Entregas/FiltrosEntregas";
import EntregasTable from "../components/Entregas/EntregasTable";

import ModalQR from "../components/Entregas/ModalQR";
import ModalEvidencia from "../components/Entregas/ModalEvidencia";
import ModalHistorial from "../components/Entregas/ModalHistorial";

import EntregasService from "../services/entregas.service";
import QRService from "../services/qr.service";

export default function Entregas() {
  const [filtros, setFiltros] = useState({
    search: "",
    sucursal: "",
    estado: "",
  });

  const [qrOpen, setQrOpen] = useState(false);
  const [qrImage, setQrImage] = useState(null);

  const [evidOpen, setEvidOpen] = useState(false);
  const [actualEntrega, setActualEntrega] = useState(null);

  const [histOpen, setHistOpen] = useState(false);
  const [historial, setHistorial] = useState([]);

  const onChange = (c, v) => setFiltros({ ...filtros, [c]: v });
  const clearFiltros = () => setFiltros({ search: "", sucursal: "", estado: "" });

  const acciones = {
    onQR: async (e) => {
      const data = await QRService.obtener(e.trabajador);
      setQrImage(data.qr_base64);
      setQrOpen(true);
    },

    onEvidencia: (e) => {
      setActualEntrega(e);
      setEvidOpen(true);
    },

    onHistorial: async (e) => {
      const data = await EntregasService.historial(e.id);
      setHistorial(data);
      setHistOpen(true);
    },
  };

  return (
    <>
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Button variant="contained" onClick={EntregasService.exportExcel}>
          Exportar Excel
        </Button>

        <Button variant="contained" color="secondary" onClick={EntregasService.exportPDF}>
          Exportar PDF
        </Button>
      </Stack>

      <FiltrosEntregas filtros={filtros} onChange={onChange} onClear={clearFiltros} />

      <EntregasTable filtros={filtros} acciones={acciones} />

      <ModalQR open={qrOpen} onClose={() => setQrOpen(false)} image={qrImage} />

      <ModalEvidencia
        open={evidOpen}
        onClose={() => setEvidOpen(false)}
        onConfirm={async (file) => {
          await EntregasService.marcarRetirado(actualEntrega.id, file);
          setEvidOpen(false);
        }}
      />

      <ModalHistorial
        open={histOpen}
        onClose={() => setHistOpen(false)}
        historial={historial}
      />
    </>
  );
}
