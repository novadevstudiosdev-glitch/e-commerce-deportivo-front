'use client';

import { Box, Divider, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  isMobile: boolean;
}

const items = [
  { label: 'Dashboard', href: '/dashboard', icon: <DashboardOutlinedIcon /> },
  { label: 'Mi perfil', href: '/dashboard/profile', icon: <PersonOutlineOutlinedIcon /> },
  { label: 'Pedidos', href: '/dashboard/orders', icon: <LocalMallOutlinedIcon /> },
  { label: 'Favoritos', href: '/dashboard/favorites', icon: <FavoriteBorderOutlinedIcon /> },
  { label: 'Configuracion', href: '/dashboard/settings', icon: <SettingsOutlinedIcon /> },
];

export function Sidebar({ open, onClose, isMobile }: SidebarProps) {
  const pathname = usePathname();

  const content = (
    <Box sx={{ width: 280, p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box>
        <Typography variant="h6" fontWeight={800} color="primary">
          SportShop
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Panel del cliente
        </Typography>
      </Box>

      <Divider />

      <List sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href);
          return (
            <ListItemButton
              key={item.label}
              component={Link}
              href={item.href}
              onClick={isMobile ? onClose : undefined}
              sx={{
                borderRadius: 2,
                border: '1px solid transparent',
                bgcolor: active ? '#1E88E5' : 'transparent',
                color: active ? '#FFFFFF' : 'text.primary',
                '&:hover': {
                  bgcolor: active ? '#1976D2' : '#F6F7FB',
                },
              }}
            >
              <ListItemIcon sx={{ color: active ? '#FFFFFF' : 'text.secondary' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            borderRadius: '0 16px 16px 0',
            borderRight: '1px solid #E5E7EB',
          },
        }}
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Box
      sx={{
        width: 280,
        minHeight: '100vh',
        bgcolor: '#FFFFFF',
        borderRight: '1px solid #E5E7EB',
      }}
    >
      {content}
    </Box>
  );
}
