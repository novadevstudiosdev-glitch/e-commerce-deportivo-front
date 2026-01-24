'use client';

import { Box, Typography } from '@mui/material';

interface SalesPoint {
  month: string;
  value: number;
}

export function SalesChart({ data }: { data: SalesPoint[] }) {
  if (!data || data.length === 0) {
    return (
      <Box sx={{ py: 6, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Sin datos de ventas disponibles.
        </Typography>
      </Box>
    );
  }

  const max = Math.max(...data.map((item) => item.value), 1);

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Ventas mensuales
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 220 }}>
        {data.map((item) => {
          const height = Math.round((item.value / max) * 180);
          return (
            <Box key={item.month} sx={{ flex: 1, textAlign: 'center' }}>
              <Box
                sx={{
                  height,
                  borderRadius: 2,
                  bgcolor: '#1E88E5',
                  boxShadow: '0 8px 16px rgba(30,136,229,0.2)',
                }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                {item.month}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
