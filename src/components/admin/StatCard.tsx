'use client';

import { Paper, Stack, Typography, Chip, Box } from '@mui/material';
import type { ReactNode } from 'react';

type StatCardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
  chipLabel?: string;
  icon?: ReactNode;
};

export function StatCard({ title, value, subtitle, chipLabel, icon }: StatCardProps) {
  return (
    <Paper sx={{ p: 2.5 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
        <Box>
          <Typography variant="caption" color="text.secondary">
            {title}
          </Typography>
          <Typography variant="h5" fontWeight={800} sx={{ mt: 0.5 }}>
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        <Stack spacing={1} alignItems="flex-end">
          {chipLabel && <Chip size="small" label={chipLabel} />}
          {icon && (
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 2,
                bgcolor: '#EAF2FD',
                color: 'primary.main',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              {icon}
            </Box>
          )}
        </Stack>
      </Stack>
    </Paper>
  );
}
