'use client';

import {
  Divider,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';

interface ProfileMenuProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
}

export function ProfileMenu({ anchorEl, onClose }: ProfileMenuProps) {
  const open = Boolean(anchorEl);
  const router = useRouter();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    onClose();
    router.push('/login');
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      PaperProps={{
        sx: {
          mt: 1,
          borderRadius: 2,
          border: '1px solid #E5E7EB',
          boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
          minWidth: 220,
        },
      }}
    >
      <Typography variant="subtitle2" sx={{ px: 2, pt: 1, pb: 0.5, color: 'text.secondary' }}>
        Mi cuenta
      </Typography>

      <MenuItem component={Link} href="/dashboard/profile" onClick={onClose}>
        <ListItemIcon>
          <PersonOutlineIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Mi perfil" />
      </MenuItem>
      <MenuItem component={Link} href="/dashboard/orders" onClick={onClose}>
        <ListItemIcon>
          <LocalMallOutlinedIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Mis pedidos" />
      </MenuItem>
      <MenuItem component={Link} href="/dashboard/favorites" onClick={onClose}>
        <ListItemIcon>
          <FavoriteBorderOutlinedIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Favoritos" />
      </MenuItem>
      <MenuItem component={Link} href="/dashboard/settings" onClick={onClose}>
        <ListItemIcon>
          <SettingsOutlinedIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Configuracion" />
      </MenuItem>

      <Divider sx={{ my: 1 }} />

      <MenuItem onClick={handleLogout}>
        <ListItemIcon>
          <LogoutOutlinedIcon fontSize="small" color="error" />
        </ListItemIcon>
        <ListItemText
          primary={<Typography color="error">Cerrar sesion</Typography>}
        />
      </MenuItem>
    </Menu>
  );
}
