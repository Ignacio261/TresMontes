import React from 'react';
import { Chip, Tooltip } from '@mui/material';

export default function QRStatusBadge({ qr }) {
  if (!qr) return <Chip label="QR: N/D" size="small" />;
  const { estado_simplificado, qr_id } = qr;
  const map = {
    no_generado: { label: 'No generado', color: 'default' },
    generado: { label: 'Generado', color: 'warning' },
    enviado: { label: 'Enviado', color: 'success' },
    no_disponible: { label: 'QR no instalado', color: 'default' },
    otro: { label: 'Otro', color: 'default' }
  };
  const m = map[estado_simplificado] || map['otro'];
  return (
    <Tooltip title={qr_id ? `QR id: ${qr_id}` : ''}>
      <Chip label={`QR: ${m.label}`} color={m.color} size="small" />
    </Tooltip>
  );
}