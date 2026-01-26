'use client';

import { useState } from 'react';
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
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import { useCart, useAuth } from '@/hooks';
import { ProfileMenu } from './ProfileMenu';
import Link from 'next/link';

interface TopbarProps {
  title: string;
  onMenuClick: () => void;
  isMobile: boolean;
}

export function Topbar({ title, onMenuClick, isMobile }: TopbarProps) {
  const { totalItems } = useCart();
  const { session } = useAuth();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const initials = session?.user
    ? `${session.user.firstName?.[0] || ''}${session.user.lastName?.[0] || ''}`.toUpperCase()
    : 'SS';

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

        <Typography variant="h6" fontWeight={700} sx={{ minWidth: 140 }}>
          {title}
        </Typography>

        <Box sx={{ flex: 1, maxWidth: 520 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Buscar en el dashboard"
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
          <IconButton component={Link} href="/" aria-label="Ir al inicio">
            <HomeOutlinedIcon />
          </IconButton>
          <IconButton>
            <Badge badgeContent={totalItems} color="primary">
              <ShoppingCartOutlinedIcon />
            </Badge>
          </IconButton>
          <IconButton>
            <Badge variant="dot" color="primary">
              <NotificationsNoneOutlinedIcon />
            </Badge>
          </IconButton>
          <IconButton onClick={(event) => setAnchorEl(event.currentTarget)}>
            <Avatar sx={{ bgcolor: '#1E88E5', width: 36, height: 36, fontWeight: 700 }}>
              {initials}
            </Avatar>
          </IconButton>
        </Box>
      </Toolbar>

      <ProfileMenu anchorEl={anchorEl} onClose={() => setAnchorEl(null)} />
    </AppBar>
  );
}
