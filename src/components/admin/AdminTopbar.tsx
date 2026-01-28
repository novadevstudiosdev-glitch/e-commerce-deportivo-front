// ============================================
// ADMIN TOPBAR
// ============================================

'use client';

import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Breadcrumbs,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  Link as MUILink,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
  Chip,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { useAuthStore } from '@/store';
import type { ChangeEvent, MouseEvent } from 'react';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type AdminTopbarProps = {
  title: string;
  breadcrumbs?: { label: string; href?: string }[];
  onMenuClick: () => void;
  isMobile: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
};

export function AdminTopbar({
  title,
  breadcrumbs,
  onMenuClick,
  isMobile,
  searchValue,
  onSearchChange,
}: AdminTopbarProps) {
  const { session, logout } = useAuthStore();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const initials = session?.user
    ? `${session.user.firstName?.[0] || ''}${session.user.lastName?.[0] || ''}`.toUpperCase()
    : 'AD';

  const roleLabel = useMemo(() => {
    if (!session?.role) return 'Admin';
    if (session.role === 'vendedor') return 'Vendedor';
    if (session.role === 'usuario') return 'Usuario';
    return session.role === 'admin' ? 'Admin' : session.role;
  }, [session?.role]);

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    onSearchChange?.(event.target.value);
  };

  const handleMenuOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: 'background.paper',
        borderBottom: '1px solid rgba(0,0,0,0.08)',
        color: 'text.primary',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        boxShadow: '0 6px 16px rgba(15, 23, 42, 0.06)',
      }}
    >
      <Toolbar sx={{ minHeight: { xs: 64, md: 72 }, px: { xs: 2, md: 3 }, gap: 2 }}>
        {isMobile && (
          <IconButton onClick={onMenuClick} edge="start" aria-label="Abrir menu">
            <MenuIcon />
          </IconButton>
        )}

        <Stack spacing={0.2} sx={{ minWidth: 180 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="h6" fontWeight={700}>
              {title}
            </Typography>
            {!isMobile && (
              <Chip
                size="small"
                label={roleLabel}
                variant="outlined"
                sx={{ fontWeight: 600 }}
              />
            )}
          </Stack>
          {!isMobile && breadcrumbs && breadcrumbs.length > 0 && (
            <Breadcrumbs aria-label="breadcrumb" sx={{ fontSize: 13, color: 'text.secondary' }}>
              {breadcrumbs.map((item, index) =>
                item.href ? (
                  <MUILink key={`${item.label}-${index}`} href={item.href} underline="hover">
                    {item.label}
                  </MUILink>
                ) : (
                  <Typography key={`${item.label}-${index}`} color="text.secondary">
                    {item.label}
                  </Typography>
                )
              )}
            </Breadcrumbs>
          )}
        </Stack>

        {onSearchChange && !isMobile && (
          <Box sx={{ flex: 1, maxWidth: 520 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Buscar..."
              value={searchValue ?? ''}
              onChange={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
                sx: { bgcolor: '#F6F7FB', borderRadius: 2 },
              }}
            />
          </Box>
        )}

        <Box sx={{ flex: 1 }} />

        <Stack direction="row" alignItems="center" spacing={1}>
          <Tooltip title="Volver a la tienda">
            {isMobile ? (
              <IconButton
                onClick={() => router.push('/')}
                aria-label="Volver a la tienda"
                sx={{
                  border: '1px solid rgba(0,0,0,0.08)',
                  bgcolor: '#F8FAFC',
                  '&:hover': { bgcolor: '#EEF2FF' },
                }}
              >
                <StorefrontOutlinedIcon fontSize="small" />
              </IconButton>
            ) : (
              <Button
                onClick={() => router.push('/')}
                variant="outlined"
                size="small"
                startIcon={<StorefrontOutlinedIcon fontSize="small" />}
                sx={{ borderRadius: 2 }}
              >
                Volver a la tienda
              </Button>
            )}
          </Tooltip>

          <Tooltip title="Notificaciones">
            <IconButton
              aria-label="Notificaciones"
              sx={{
                border: '1px solid rgba(0,0,0,0.08)',
                bgcolor: '#F8FAFC',
                '&:hover': { bgcolor: '#EEF2FF' },
              }}
            >
              <Badge variant="dot" color="primary">
                <NotificationsNoneOutlinedIcon fontSize="small" />
              </Badge>
            </IconButton>
          </Tooltip>

          <IconButton onClick={handleMenuOpen} aria-label="Abrir menu de usuario">
            <Avatar sx={{ bgcolor: '#0ea5e9', width: 36, height: 36, fontWeight: 700 }}>
              {initials}
            </Avatar>
          </IconButton>
        </Stack>
      </Toolbar>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem component={Link} href="/account/profile" onClick={handleMenuClose}>
          <AccountCircleOutlinedIcon fontSize="small" style={{ marginRight: 8 }} />
          Perfil
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            handleMenuClose();
            logout();
          }}
        >
          <LogoutOutlinedIcon fontSize="small" style={{ marginRight: 8 }} />
          Cerrar sesion
        </MenuItem>
      </Menu>
    </AppBar>
  );
}
