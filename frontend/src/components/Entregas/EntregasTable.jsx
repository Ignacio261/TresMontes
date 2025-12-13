import React, { useEffect, useState } from "react";
import {
  Table, TableHead, TableRow, TableCell, TableBody,
  IconButton, Chip
} from "@mui/material";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HistoryIcon from "@mui/icons-material/History";

import EntregasService from "../../services/entregas.service";

export default function EntregasTable({ filtros }) {
  const [rows, setRows] = useState([]);

  const load = async () => {
    const data = await EntregasService.listar(filtros);
    setRows(data);
  };

  useEffect(() => { load(); }, [filtros]);

  return (
    <Table sx={{ background: "#0f1f0f" }}>
      <TableHead>
        <TableRow>
          <TableCell>Trabajador</TableCell>
          <TableCell>Sucursal</TableCell>
          <TableCell>Área</TableCell>
          <TableCell>Periodo</TableCell>
          <TableCell>Estado</TableCell>
          <TableCell>Acciones</TableCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {rows.map((e) => (
          <TableRow key={e.id}>
            <TableCell>{e.trabajador_info.nombre_completo}</TableCell>
            <TableCell>{e.sucursal}</TableCell>
            <TableCell>{e.area}</TableCell>
            <TableCell>{e.periodo}</TableCell>

            <TableCell>
              <Chip
                label={e.estado}
                color={e.estado === "retirado" ? "success" : "warning"}
              />
            </TableCell>

            <TableCell>
              <IconButton color="primary" onClick={() => e.onQR(e)}>
                <QrCode2Icon />
              </IconButton>

              <IconButton color="success" onClick={() => e.onEvidencia(e)}>
                <CheckCircleIcon />
              </IconButton>

              <IconButton onClick={() => e.onHistorial(e)}>
                <HistoryIcon />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
