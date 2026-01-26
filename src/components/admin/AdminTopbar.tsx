// ============================================
// ADMIN TOPBAR
// ============================================

'use client';

import {
  AppBar,
  Avatar,
  Badge,
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { useAuthStore } from '@/store';
import type { ChangeEvent } from 'react';

type AdminTopbarProps = {
  title: string;
  onMenuClick: () => void;
  isMobile: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
};

export function AdminTopbar({
  title,
  onMenuClick,
  isMobile,
  searchValue,
  onSearchChange,
}: AdminTopbarProps) {
  const { session, logout } = useAuthStore();
  const initials = session?.user
    ? `${session.user.firstName?.[0] || ''}${session.user.lastName?.[0] || ''}`.toUpperCase()
    : 'AD';

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    onSearchChange?.(event.target.value);
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: '#FFFFFF',
        borderBottom: '1px solid #E5E7EB',
        color: 'text.primary',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ gap: 2 }}>
        {isMobile && (
          <IconButton onClick={onMenuClick} edge="start">
            <MenuIcon />
          </IconButton>
        )}

        <Typography variant="h6" fontWeight={700} sx={{ minWidth: 160 }}>
          {title}
        </Typography>

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

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton onClick={logout} aria-label="Cerrar sesion">
            <Badge color="primary" variant="dot">
              <LogoutOutlinedIcon />
            </Badge>
          </IconButton>
          <Avatar sx={{ bgcolor: '#0ea5e9', width: 36, height: 36, fontWeight: 700 }}>
            {initials}
          </Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
