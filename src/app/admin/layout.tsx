// ============================================
// ADMIN LAYOUT
// ============================================

'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Box, Button, Paper, ThemeProvider, Typography } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import { adminService } from '@/services/admin/admin.service';
import { LoadingBlock } from '@/components/admin/LoadingBlock';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { adminTheme } from '@/theme';
import { useAuth } from '@/hooks';

const titleEntries = [
  { path: '/admin', title: 'Dashboard' },
  { path: '/admin/products', title: 'Productos' },
  { path: '/admin/payments', title: 'Pagos' },
  { path: '/admin/stock-alerts', title: 'Stock Alerts' },
  { path: '/admin/coupons', title: 'Cupones' },
  { path: '/admin/orders', title: 'Ordenes' },
  { path: '/admin/users', title: 'Usuarios' },
];

type GuardState = 'loading' | 'authorized' | 'unauthorized' | 'error';

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { role } = useAuth();
  const [guardState, setGuardState] = useState<GuardState>('loading');
  const [guardMessage, setGuardMessage] = useState<string | null>(null);
  const isSeller = role === 'vendedor';
  const sellerAllowedPaths = ['/admin/products', '/admin/orders'];
  const isSellerAllowedRoute = sellerAllowedPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
  const isRoleBlocked = isSeller && !isSellerAllowedRoute;

  const title = useMemo(() => {
    const match = titleEntries.find(
      (entry) => pathname === entry.path || pathname.startsWith(`${entry.path}/`)
    );
    return match?.title || 'Admin';
  }, [pathname]);

  const checkAccess = useCallback(async () => {
    setGuardState('loading');
    setGuardMessage(null);
    const result = await adminService.ping();
    if (!result.ok) {
      if (result.status === 401 || result.status === 403) {
        setGuardState('unauthorized');
        return;
      }
      setGuardState('error');
      setGuardMessage(result.error || 'No se pudo conectar con el servidor.');
      return;
    }
    setGuardState('authorized');
  }, []);

  useEffect(() => {
    void checkAccess();
  }, [checkAccess]);

  return (
    <ThemeProvider theme={adminTheme}>
      <Box sx={{ display: 'flex', bgcolor: '#F6F7FB', minHeight: '100vh', width: '100%' }}>
        {guardState === 'authorized' && !isRoleBlocked && (
          <AdminLayout
            title={title}
            breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: title }]}
          >
            {children}
          </AdminLayout>
        )}

        {(guardState === 'unauthorized' || isRoleBlocked) && (
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3 }}>
            <Paper sx={{ p: 4, textAlign: 'center', maxWidth: 420 }}>
              <Typography variant="h5" fontWeight={700} gutterBottom>
                No autorizado
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                No tienes permisos para acceder a esta seccion.
              </Typography>
              <Button variant="contained" onClick={() => router.push('/login')}>
                Volver al login
              </Button>
            </Paper>
          </Box>
        )}

        {guardState === 'error' && (
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3 }}>
            <Paper sx={{ p: 4, textAlign: 'center', maxWidth: 420 }}>
              <Typography variant="h5" fontWeight={700} gutterBottom>
                Error de servidor
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                {guardMessage || 'No se pudo validar el acceso.'}
              </Typography>
              <Button variant="contained" onClick={checkAccess}>
                Reintentar
              </Button>
            </Paper>
          </Box>
        )}

        {guardState === 'loading' && (
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3 }}>
            <Box sx={{ width: { xs: '100%', sm: 480 } }}>
              <LoadingBlock rows={4} />
            </Box>
          </Box>
        )}
      </Box>
    </ThemeProvider>
  );
}
