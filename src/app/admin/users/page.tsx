// ============================================
// ADMIN USERS (PLACEHOLDER - NO ENDPOINT)
// ============================================

'use client';

import { Alert, Paper, Stack, Typography } from '@mui/material';
import { EmptyState } from '@/components/admin/EmptyState';

export default function AdminUsersPage() {
  return (
    <Stack spacing={2}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={700}>
          Usuarios
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Gestiona usuarios y roles del sistema.
        </Typography>
      </Paper>

      <Alert severity="info">
        No hay endpoints de admin para listar usuarios o cambiar roles. Para habilitar esta seccion
        se necesita un endpoint del backend (por ejemplo: GET /api/admin/users y PATCH
        /api/admin/users/:id/role).
      </Alert>

      <EmptyState
        title="Sin datos de usuarios"
        description="Cuando exista el endpoint, aca podremos listar usuarios y cambiar roles."
      />
    </Stack>
  );
}
