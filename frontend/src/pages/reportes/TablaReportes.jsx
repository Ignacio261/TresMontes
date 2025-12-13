import React from "react";
import { Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";

const TablaReportes = ({ datos }) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Fecha</TableCell>
          <TableCell>RUT</TableCell>
          <TableCell>Nombre</TableCell>
          <TableCell>Beneficio</TableCell>
          <TableCell>Sede</TableCell>
          <TableCell>Estado</TableCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {datos.map((d) => (
          <TableRow key={d.id}>
            <TableCell>{d.fecha_entrega}</TableCell>
            <TableCell>{d.trabajador_rut}</TableCell>
            <TableCell>{d.trabajador_nombre} {d.trabajador_apellidos}</TableCell>
            <TableCell>{d.beneficio}</TableCell>
            <TableCell>{d.sede}</TableCell>
            <TableCell>{d.estado}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TablaReportes;
