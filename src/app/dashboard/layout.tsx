'use client';

import { useMemo, useState } from 'react';
import { Box, CssBaseline, ThemeProvider, createTheme, useMediaQuery } from '@mui/material';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Topbar } from '@/components/dashboard/Topbar';
import { usePathname } from 'next/navigation';

const dashboardTheme = createTheme({
  palette: {
    primary: { main: '#0ea5e9' },
    background: { default: '#F8FAFC' },
  },
  shape: { borderRadius: 16 },
  typography: {
    fontFamily: '"Sora", "Manrope", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', borderRadius: 12 },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { borderRadius: 16 },
      },
    },
  },
});

const titleMap: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/dashboard/admin': 'Panel de administracion',
  '/dashboard/profile': 'Mi perfil',
  '/dashboard/orders': 'Mis pedidos',
  '/dashboard/favorites': 'Favoritos',
  '/dashboard/settings': 'Configuracion',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMobile = useMediaQuery(dashboardTheme.breakpoints.down('md'));
  const [open, setOpen] = useState(false);

  const title = useMemo(() => {
    return titleMap[pathname] || 'Dashboard';
  }, [pathname]);

  return (
    <ThemeProvider theme={dashboardTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', bgcolor: '#F6F7FB', minHeight: '100vh' }}>
        <Sidebar open={open} onClose={() => setOpen(false)} isMobile={isMobile} />

        <Box sx={{ flex: 1 }}>
          <Topbar title={title} onMenuClick={() => setOpen(true)} isMobile={isMobile} />
          <Box sx={{ p: { xs: 2, md: 3 } }}>{children}</Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
