'use client';

import { Box, Card, CardContent, FormControlLabel, Switch, Typography } from '@mui/material';

export default function SettingsPage() {
  return (
    <Card elevation={0} sx={{ borderRadius: 2, border: '1px solid #E5E7EB', boxShadow: '0 10px 30px rgba(0,0,0,0.06)' }}>
      <CardContent>
        <Typography variant="h6" fontWeight={700}>
          Configuracion
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Preferencias generales (solo UI).
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <FormControlLabel control={<Switch defaultChecked />} label="Notificaciones por email" />
          <FormControlLabel control={<Switch />} label="Tema oscuro" />
          <FormControlLabel control={<Switch defaultChecked />} label="Privacidad mejorada" />
        </Box>
      </CardContent>
    </Card>
  );
}
