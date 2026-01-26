// ============================================
// ADMIN SIDEBAR
// ============================================

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';

type AdminSidebarProps = {
  open: boolean;
  onClose: () => void;
  isMobile: boolean;
};

const items = [
  { label: 'Dashboard', href: '/admin', icon: <DashboardOutlinedIcon /> },
  { label: 'Productos', href: '/admin/products', icon: <Inventory2OutlinedIcon /> },
  { label: 'Pagos', href: '/admin/payments', icon: <PaymentsOutlinedIcon /> },
  { label: 'Stock Alerts', href: '/admin/stock-alerts', icon: <LocalShippingOutlinedIcon /> },
  { label: 'Cupones', href: '/admin/coupons', icon: <ConfirmationNumberOutlinedIcon /> },
  { label: 'Ordenes', href: '/admin/orders', icon: <ReceiptLongOutlinedIcon /> },
];

export function AdminSidebar({ open, onClose, isMobile }: AdminSidebarProps) {
  const pathname = usePathname();

  const content = (
    <Box sx={{ width: 280, p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box>
        <Typography variant="h6" fontWeight={800} color="primary">
          Panel Admin
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Gestion de tienda
        </Typography>
      </Box>

      <Divider />

      <List sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {items.map((item) => {
          const active =
            item.href === '/admin' ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <ListItemButton
              key={item.label}
              component={Link}
              href={item.href}
              onClick={isMobile ? onClose : undefined}
              sx={{
                borderRadius: 2,
                border: '1px solid transparent',
                bgcolor: active ? '#0ea5e9' : 'transparent',
                color: active ? '#FFFFFF' : 'text.primary',
                '&:hover': {
                  bgcolor: active ? '#0284c7' : '#F6F7FB',
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
