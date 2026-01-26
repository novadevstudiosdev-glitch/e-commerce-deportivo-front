// ============================================
// STATUS CHIP
// ============================================

'use client';

import { Chip } from '@mui/material';

type StatusChipProps = {
  label: string;
  color?: 'default' | 'success' | 'warning' | 'error' | 'info';
};

export function StatusChip({ label, color = 'default' }: StatusChipProps) {
  return <Chip label={label} color={color} size="small" />;
}
