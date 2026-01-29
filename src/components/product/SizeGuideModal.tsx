'use client';

import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useMemo, useState } from 'react';

interface SizeGuideModalProps {
  open: boolean;
  onClose: () => void;
}

type Unit = 'cm' | 'in';

const LABELS = ['Talon - dedo gordo', 'AR', 'UK', 'US - Hombre', 'US - Mujer'] as const;
const CLOTHING_LABELS = ['Pecho', 'Cintura', 'Cadera', 'Largo'] as const;

const SIZE_DATA_CM = [
  { length: '22.1', ar: '34', uk: '3', usm: '4', usw: '5' },
  { length: '22.5', ar: '35', uk: '3.5', usm: '4.5', usw: '5.5' },
  { length: '23.0', ar: '36', uk: '4', usm: '5', usw: '6' },
  { length: '23.5', ar: '37', uk: '4.5', usm: '5.5', usw: '6.5' },
  { length: '24.0', ar: '38', uk: '5', usm: '6', usw: '7' },
  { length: '24.5', ar: '39', uk: '5.5', usm: '6.5', usw: '7.5' },
  { length: '25.0', ar: '40', uk: '6', usm: '7', usw: '8' },
  { length: '25.5', ar: '41', uk: '6.5', usm: '7.5', usw: '8.5' },
  { length: '26.0', ar: '42', uk: '7', usm: '8', usw: '9' },
  { length: '26.5', ar: '43', uk: '8', usm: '9', usw: '10' },
  { length: '27.0', ar: '44', uk: '9', usm: '10', usw: '11' },
];

const CLOTHING_SIZES_CM = [
  { size: 'XS', chest: [82, 86], waist: [64, 68], hip: [88, 92], length: [62, 64] },
  { size: 'S', chest: [86, 90], waist: [68, 72], hip: [92, 96], length: [64, 66] },
  { size: 'M', chest: [90, 96], waist: [72, 78], hip: [96, 102], length: [66, 68] },
  { size: 'L', chest: [96, 102], waist: [78, 86], hip: [102, 110], length: [68, 70] },
  { size: 'XL', chest: [102, 110], waist: [86, 94], hip: [110, 118], length: [70, 72] },
];

function cmToInches(value: string) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return value;
  return (parsed / 2.54).toFixed(1);
}

function formatRange(range: [number, number], unit: Unit) {
  const [min, max] = range;
  if (unit === 'cm') return `${min}-${max}`;
  const minIn = (min / 2.54).toFixed(1);
  const maxIn = (max / 2.54).toFixed(1);
  return `${minIn}-${maxIn}`;
}

export function SizeGuideModal({ open, onClose }: SizeGuideModalProps) {
  const [unit, setUnit] = useState<Unit>('cm');

  const tableData = useMemo(() => {
    if (unit === 'cm') return SIZE_DATA_CM;
    return SIZE_DATA_CM.map((row) => ({
      ...row,
      length: cmToInches(row.length),
    }));
  }, [unit]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle
        sx={{
          pb: 1,
          pr: 6,
          borderBottom: '1px solid #E5E7EB',
          fontWeight: 800,
          letterSpacing: 0.5,
        }}
      >
        GUIA DE TALLES
        <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 0.5, fontWeight: 600 }}>
          TALLES DE CALZADO PARA HOMBRE Y MUJER
        </Typography>
        <IconButton
          aria-label="Cerrar guia de talles"
          onClick={onClose}
          sx={{ position: 'absolute', right: 12, top: 12 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: { xs: 2, md: 3 } }}>
        <Box sx={{ mb: 3 }}>
          <Tabs
            value={unit}
            onChange={(_, next) => setUnit(next)}
            textColor="primary"
            indicatorColor="primary"
            sx={{
              borderBottom: '1px solid #E5E7EB',
              '& .MuiTab-root': { fontWeight: 700, textTransform: 'none' },
            }}
          >
            <Tab value="in" label="Pulgadas" />
            <Tab value="cm" label="cm" />
          </Tabs>
        </Box>

        <Box sx={{ overflowX: 'auto' }}>
          <Table size="small" sx={{ minWidth: 720 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#111827' }}>
                <TableCell sx={{ color: '#fff', fontWeight: 700, position: 'sticky', left: 0, zIndex: 3 }}>
                  {LABELS[0]}
                </TableCell>
                {tableData.map((row) => (
                  <TableCell key={row.length} align="center" sx={{ color: '#fff', fontWeight: 700 }}>
                    {row.length} {unit}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {[
                { label: LABELS[1], key: 'ar' },
                { label: LABELS[2], key: 'uk' },
                { label: LABELS[3], key: 'usm' },
                { label: LABELS[4], key: 'usw' },
              ].map((row) => (
                <TableRow key={row.key}>
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      position: 'sticky',
                      left: 0,
                      backgroundColor: '#fff',
                      zIndex: 2,
                    }}
                  >
                    {row.label}
                  </TableCell>
                  {tableData.map((item) => (
                    <TableCell key={`${row.key}-${item.length}`} align="center">
                      {item[row.key as keyof typeof item]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>

        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          Desliza horizontalmente para ver mas opciones.
        </Typography>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
            TALLES DE ROPA
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Medidas aproximadas para remeras y camperas. Valores en {unit}.
          </Typography>

          <Box sx={{ overflowX: 'auto' }}>
            <Table size="small" sx={{ minWidth: 720 }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#111827' }}>
                  <TableCell sx={{ color: '#fff', fontWeight: 700, position: 'sticky', left: 0, zIndex: 3 }}>
                    Talle
                  </TableCell>
                  {CLOTHING_SIZES_CM.map((row) => (
                    <TableCell key={row.size} align="center" sx={{ color: '#fff', fontWeight: 700 }}>
                      {row.size}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {CLOTHING_LABELS.map((label) => (
                  <TableRow key={label}>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        position: 'sticky',
                        left: 0,
                        backgroundColor: '#fff',
                        zIndex: 2,
                      }}
                    >
                      {label}
                    </TableCell>
                    {CLOTHING_SIZES_CM.map((row) => {
                      const value =
                        label === 'Pecho'
                          ? formatRange(row.chest, unit)
                          : label === 'Cintura'
                            ? formatRange(row.waist, unit)
                            : label === 'Cadera'
                              ? formatRange(row.hip, unit)
                              : formatRange(row.length, unit);

                      return (
                        <TableCell key={`${row.size}-${label}`} align="center">
                          {value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>

          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Desliza horizontalmente para ver mas opciones.
          </Typography>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
            ESTAS ENTRE DOS TALLES?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Para un corte mas ajustado, elegi un talle menos.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Para un corte holgado, elegi un talle mas grande.
          </Typography>
        </Box>

        <Box sx={{ mt: 4, display: 'grid', gap: 2, alignItems: 'center', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
              COMO MEDIR
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Apoya el pie sobre una superficie plana y marca el contorno.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Largo:</strong> Medi la distancia desde la punta del dedo gordo del pie hasta la parte externa
              del talon.
            </Typography>
          </Box>

          <Box
            sx={{
              borderRadius: 2,
              border: '1px solid #E5E7EB',
              bgcolor: '#F9FAFB',
              p: 2,
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <FootIllustration />
          </Box>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
            NO ES EL TALLE O EL COLOR CORRECTO?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Cambios y devoluciones disponibles dentro de los 60 dias de tu compra.
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

function FootIllustration() {
  return (
    <svg width="180" height="120" viewBox="0 0 180 120" fill="none" aria-hidden="true">
      <rect x="10" y="30" width="140" height="60" rx="30" fill="#E5E7EB" />
      <circle cx="140" cy="60" r="30" fill="#D1D5DB" />
      <rect x="30" y="45" width="60" height="30" rx="15" fill="#F3F4F6" />
      <path d="M40 75h90" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
      <path d="M40 45h90" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
