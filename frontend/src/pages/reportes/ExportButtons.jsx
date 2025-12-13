import React from "react";
import { Button, Stack } from "@mui/material";
import ReportesService from "../../services/reportes.service";

const ExportButtons = () => {
  
  const descargar = (res, nombre) => {
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const a = document.createElement("a");
    a.href = url;
    a.download = nombre;
    a.click();
  };

  return (
    <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
      <Button variant="outlined" onClick={async () => {
        const res = await ReportesService.exportExcel();
        descargar(res, "reporte.xlsx");
      }}>
        Excel
      </Button>

      <Button variant="outlined" onClick={async () => {
        const res = await ReportesService.exportCSV();
        descargar(res, "reporte.csv");
      }}>
        CSV
      </Button>

      <Button variant="outlined" onClick={async () => {
        const res = await ReportesService.exportPDF();
        descargar(res, "reporte.pdf");
      }}>
        PDF
      </Button>
    </Stack>
  );
};

export default ExportButtons;
