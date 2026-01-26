'use client';

import { Card, CardContent, Stack, Typography, Box } from '@mui/material';

interface KpiCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  accentColor?: string;
}

export function KpiCard({ title, value, icon, accentColor = '#1E88E5' }: KpiCardProps) {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 2,
        border: '1px solid #E5E7EB',
        boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
      }}
    >
      <CardContent>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
          <Box>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
            <Typography variant="h5" fontWeight={700} sx={{ mt: 1 }}>
              {value}
            </Typography>
          </Box>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '16px',
              bgcolor: `${accentColor}1A`,
              color: accentColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
