// ============================================
// ADMIN SHELL
// ============================================

'use client';

import { Box } from '@mui/material';
import type { ReactNode } from 'react';
import { AdminTopbar } from './AdminTopbar';

type AdminShellProps = {
  title: string;
  children: ReactNode;
  onMenuClick: () => void;
  isMobile: boolean;
};

export function AdminShell({ title, children, onMenuClick, isMobile }: AdminShellProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', flex: 1 }}>
      <AdminTopbar title={title} onMenuClick={onMenuClick} isMobile={isMobile} />
      <Box component="main" sx={{ p: { xs: 2, md: 3 }, flex: 1 }}>
        {children}
      </Box>
    </Box>
  );
}
