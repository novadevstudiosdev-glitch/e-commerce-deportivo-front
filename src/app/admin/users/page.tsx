'use client';
//....
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { DataTable } from '@/components/admin/DataTable';
import { adminUsersService } from '@/services/admin/users.service';
import type { AdminUserDTO, AdminUserRole, AdminUsersListResponse } from '@/types/admin';

const ROLE_OPTIONS: AdminUserRole[] = ['usuario', 'vendedor', 'admin'];
const STATUS_OPTIONS = [
  { label: 'Todos', value: '' },
  { label: 'Activos', value: 'true' },
  { label: 'Inactivos', value: 'false' },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUserDTO[]>([]);
  const [meta, setMeta] = useState<Pick<AdminUsersListResponse, 'page' | 'limit' | 'total'>>({
    page: 1,
    limit: 20,
    total: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    q: '',
    role: '' as AdminUserRole | '',
    is_active: '' as '' | 'true' | 'false',
  });
  const [roleDrafts, setRoleDrafts] = useState<Record<string, AdminUserRole>>({});
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const normalizeUsers = (value: unknown): AdminUserDTO[] => {
    if (Array.isArray(value)) return value as AdminUserDTO[];
    if (value && typeof value === 'object') {
      const payload = value as { data?: unknown; items?: unknown; users?: unknown };
      if (Array.isArray(payload.data)) return payload.data as AdminUserDTO[];
      if (Array.isArray(payload.items)) return payload.items as AdminUserDTO[];
      if (Array.isArray(payload.users)) return payload.users as AdminUserDTO[];
    }
    return [];
  };

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const result = await adminUsersService.getUsers({
      page: meta.page,
      limit: meta.limit,
      q: filters.q || undefined,
      role: filters.role || undefined,
      is_active: filters.is_active === '' ? undefined : filters.is_active === 'true',
    });

    if (!result.ok) {
      setError(result.error || 'No se pudieron cargar usuarios.');
      setUsers([]);
      setIsLoading(false);
      return;
    }

    const normalized = normalizeUsers(result.data?.data ?? result.data);
    setUsers(normalized);
    setMeta((prev) => ({
      ...prev,
      page: result.data?.page ?? prev.page,
      limit: result.data?.limit ?? prev.limit,
      total: result.data?.total ?? normalized.length,
    }));
    setIsLoading(false);
  }, [filters.is_active, filters.q, filters.role, meta.limit, meta.page]);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  const mergedUsers = useMemo(() => {
    return users.map((user) => ({
      ...user,
      role: roleDrafts[user.id] ?? user.role ?? 'usuario',
    }));
  }, [users, roleDrafts]);

  const handleRoleChange = (id: string, role: AdminUserRole) => {
    setRoleDrafts((prev) => ({ ...prev, [id]: role }));
  };

  const handleSaveRole = async (user: AdminUserDTO) => {
    const nextRole = roleDrafts[user.id] ?? user.role;
    if (!nextRole) {
      setSnackbar({ open: true, message: 'Selecciona un rol antes de guardar.', severity: 'error' });
      return;
    }

    const result = await adminUsersService.updateUser(user.id, { role: nextRole });
    if (!result.ok) {
      setSnackbar({ open: true, message: result.error || 'No se pudo actualizar el rol.', severity: 'error' });
      return;
    }

    setUsers((prev) =>
      prev.map((item) => (item.id === user.id ? { ...item, role: nextRole } : item))
    );
    setSnackbar({ open: true, message: 'Rol actualizado.', severity: 'success' });
  };

  const totalPages = Math.max(1, Math.ceil(meta.total / meta.limit));

  return (
    <Stack spacing={2}>
      <Paper sx={{ p: 2.5 }}>
        <Stack spacing={1}>
          <Typography variant="h6" fontWeight={700}>
            Usuarios
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gestiona roles y accesos del sistema.
          </Typography>
        </Stack>
      </Paper>

      <Paper sx={{ p: 2.5 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
          <TextField
            size="small"
            label="Buscar por email o nombre"
            value={filters.q}
            onChange={(e) => setFilters((prev) => ({ ...prev, q: e.target.value }))}
            sx={{ minWidth: 260 }}
          />
          <TextField
            size="small"
            label="Rol"
            select
            value={filters.role}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, role: e.target.value as AdminUserRole | '' }))
            }
            sx={{ minWidth: 160 }}
          >
            <MenuItem value="">Todos</MenuItem>
            {ROLE_OPTIONS.map((role) => (
              <MenuItem key={role} value={role}>
                {role}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            size="small"
            label="Estado"
            select
            value={filters.is_active}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, is_active: e.target.value as '' | 'true' | 'false' }))
            }
            sx={{ minWidth: 140 }}
          >
            {STATUS_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <Box sx={{ flex: 1 }} />
          <Button variant="outlined" onClick={loadUsers}>
            Actualizar
          </Button>
        </Stack>
      </Paper>

      {error && (
        <Alert severity="error" action={<Button onClick={loadUsers}>Reintentar</Button>}>
          {error}
        </Alert>
      )}

      <DataTable
        title="Listado de usuarios"
        isLoading={isLoading}
        isEmpty={!isLoading && mergedUsers.length === 0}
        emptyTitle="Sin usuarios para mostrar"
        emptyDescription="Prueba con otro filtro o revisa los parametros de busqueda."
      >
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mergedUsers.map((user) => {
              const profileName =
                user.profile?.first_name || user.profile?.last_name
                  ? `${user.profile?.first_name ?? ''} ${user.profile?.last_name ?? ''}`.trim()
                  : undefined;
              const fallbackName =
                user.firstName || user.lastName ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() : undefined;
              return (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.email ?? '-'}</TableCell>
                  <TableCell>{profileName || fallbackName || '-'}</TableCell>
                  <TableCell>
                    <Select
                      size="small"
                      value={(roleDrafts[user.id] ?? user.role ?? 'usuario') as AdminUserRole}
                      onChange={(e) => handleRoleChange(user.id, e.target.value as AdminUserRole)}
                    >
                      {ROLE_OPTIONS.map((role) => (
                        <MenuItem key={role} value={role}>
                          {role}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={user.is_active === false ? 'Inactivo' : 'Activo'}
                      color={user.is_active === false ? 'default' : 'success'}
                    />
                  </TableCell>
                  <TableCell>
                    <Button size="small" variant="outlined" onClick={() => handleSaveRole(user)}>
                      Guardar
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </DataTable>

      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Pagination
          count={totalPages}
          page={meta.page}
          onChange={(_, page) => setMeta((prev) => ({ ...prev, page }))}
          color="primary"
          shape="rounded"
        />
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Stack>
  );
}
