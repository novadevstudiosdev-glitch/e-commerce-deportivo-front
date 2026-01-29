'use client';

import { Box, CssBaseline, useMediaQuery, useTheme } from '@mui/material';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminTopbar } from '@/components/admin/AdminTopbar';

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type AdminLayoutProps = {
  title: string;
  breadcrumbs?: BreadcrumbItem[];
  children: ReactNode;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
};

export function AdminLayout({
  title,
  breadcrumbs,
  children,
  searchValue,
  onSearchChange,
}: AdminLayoutProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex', bgcolor: 'background.default', minHeight: '100vh', width: '100%' }}>
      <CssBaseline />
      <AdminSidebar open={open} onClose={() => setOpen(false)} isMobile={isMobile} />
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <AdminTopbar
          title={title}
          breadcrumbs={breadcrumbs}
          onMenuClick={() => setOpen(true)}
          isMobile={isMobile}
          searchValue={searchValue}
          onSearchChange={onSearchChange}
        />
        <Box
          component="main"
          sx={{ flex: 1, px: { xs: 2, md: 3 }, pb: 4, pt: 3, width: '100%' }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
