// ============================================
// ADMIN SHELL
// ============================================

'use client';

import { Box, IconButton } from '@mui/material';
import type { ReactNode } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import { Navbar } from '@/components/layout/Navbar';

type AdminShellProps = {
  title: string;
  children: ReactNode;
  onMenuClick: () => void;
  isMobile: boolean;
};

export function AdminShell({ title, children, onMenuClick, isMobile }: AdminShellProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', flex: 1 }}>
      <Navbar />
      <Box component="main" aria-label={title} sx={{ p: { xs: 2, md: 3 }, flex: 1 }}>
        {isMobile && (
          <Box sx={{ mb: 2 }}>
            <IconButton onClick={onMenuClick} aria-label="Abrir menu">
              <MenuIcon />
            </IconButton>
          </Box>
        )}
        {children}
      </Box>
    </Box>
  );
}
