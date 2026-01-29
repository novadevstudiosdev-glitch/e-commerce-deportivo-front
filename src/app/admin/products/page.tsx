// ============================================
// ADMIN PRODUCTS
// ============================================

'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Alert,
  Button,
  Box,
  Paper,
  Stack,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Snackbar,
  Divider,
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { adminProductsService } from '@/services/admin/products.service';
import type { AdminProductDTO } from '@/types/admin';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { DataTable } from '@/components/admin/DataTable';

type RecentProduct = Pick<
  AdminProductDTO,
  'id' | 'name' | 'category' | 'price' | 'stock' | 'is_active'
>;

const RECENT_KEY = 'admin_recent_products';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProductDTO[]>([]);
  const [recentProducts, setRecentProducts] = useState<RecentProduct[]>([]);
  const [listAvailable, setListAvailable] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchId, setSearchId] = useState('');
  const [selected, setSelected] = useState<AdminProductDTO | null>(null);
  const [deleteId, setDeleteId] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [snack, setSnack] = useState<{ message: string; severity: 'success' | 'error' } | null>(
    null
  );

  const normalizeProducts = (value: unknown): AdminProductDTO[] => {
    if (Array.isArray(value)) {
      return value as AdminProductDTO[];
    }
    if (value && typeof value === 'object') {
      const payload = value as { data?: unknown; items?: unknown };
      if (Array.isArray(payload.data)) return payload.data as AdminProductDTO[];
      if (Array.isArray(payload.items)) return payload.items as AdminProductDTO[];
    }
    return [];
  };

  const loadProducts = async () => {
    setIsLoading(true);
    setError(null);
    const result = await adminProductsService.list();
    if (!result.ok) {
      if (result.status === 404) {
        setListAvailable(false);
        setProducts([]);
        setIsLoading(false);
        return;
      }
      setError(result.error || 'No se pudo cargar productos.');
      setIsLoading(false);
      return;
    }
    setListAvailable(true);
    setProducts(normalizeProducts(result.data));
    setIsLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const raw = window.localStorage.getItem(RECENT_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as RecentProduct[];
      if (Array.isArray(parsed)) {
        setRecentProducts(parsed);
      }
    } catch {
      window.localStorage.removeItem(RECENT_KEY);
    }
  }, []);

  const persistRecent = (items: RecentProduct[]) => {
    setRecentProducts(items);
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(RECENT_KEY, JSON.stringify(items));
  };

  const pushRecent = (product: AdminProductDTO) => {
    const entry: RecentProduct = {
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      is_active: product.is_active,
    };
    const next = [entry, ...recentProducts.filter((item) => item.id !== product.id)].slice(0, 8);
    persistRecent(next);
  };

  const handleSearch = async () => {
    if (!searchId) return;
    setError(null);
    setSearchLoading(true);
    const result = await adminProductsService.getById(searchId);
    if (!result.ok || !result.data) {
      setSelected(null);
      setError(result.error || 'No se encontro el producto.');
      setSearchLoading(false);
      return;
    }
    setSelected(result.data);
    pushRecent(result.data);
    setSearchLoading(false);
  };

  const handleDeactivate = async (id?: string) => {
    const targetId = id ?? deleteId;
    if (!targetId) return;
    setConfirmOpen(false);
    const result = await adminProductsService.deactivate(targetId);
    if (!result.ok) {
      setSnack({ message: result.error || 'No se pudo desactivar.', severity: 'error' });
      return;
    }
    setDeleteId('');
    setSnack({ message: 'Producto desactivado', severity: 'success' });
    loadProducts();
  };

  const recentEmptyState = useMemo(() => recentProducts.length === 0, [recentProducts.length]);
  const formatPrice = (value: unknown) => {
    const numeric = typeof value === 'number' ? value : Number(value);
    if (Number.isFinite(numeric)) {
      return `$${numeric.toFixed(2)}`;
    }
    return '-';
  };

  return (
    <Stack spacing={3}>
      <Paper sx={{ p: 3 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
          <div>
            <Typography variant="h6" fontWeight={700}>
              Gestion de productos
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Administra productos, stock y estado de publicacion.
            </Typography>
          </div>
          <Box sx={{ flex: 1 }} />
          <Button variant="contained" component={Link} href="/admin/products/new">
            Crear producto
          </Button>
        </Stack>
        {!listAvailable && (
          <Alert severity="info" sx={{ mt: 2 }}>
            No hay endpoint de listado. Usa acciones por ID o revisa los productos consultados recientemente.
          </Alert>
        )}
      </Paper>

      {error && <Alert severity="error">{error}</Alert>}

      {listAvailable && (
        <DataTable
          title="Listado"
          isLoading={isLoading}
          isEmpty={!isLoading && products.length === 0}
          emptyTitle="Sin productos para mostrar"
          emptyDescription="No se encontraron productos. Crea uno nuevo o busca por ID."
        >
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Categoria</TableCell>
                <TableCell>Precio</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id} hover>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{formatPrice(product.price)}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    <Chip
                      label={product.is_active === false ? 'Inactivo' : 'Activo'}
                      color={product.is_active === false ? 'default' : 'success'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      component={Link}
                      href={`/admin/products/${product.id}`}
                    >
                      <VisibilityOutlinedIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      component={Link}
                      href={`/admin/products/${product.id}`}
                    >
                      <EditOutlinedIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => {
                        setDeleteId(product.id);
                        setConfirmOpen(true);
                      }}
                    >
                      <DeleteOutlineOutlinedIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DataTable>
      )}

      <Paper sx={{ p: 3 }}>
        <Typography variant="subtitle1" fontWeight={700}>
          Buscar producto por ID
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Usa el ID exacto para ver detalle o editar rapidamente.
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 2 }}>
          <TextField
            label="Product ID"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            fullWidth
          />
          <Button variant="outlined" onClick={handleSearch} disabled={searchLoading}>
            Buscar
          </Button>
          {selected && (
            <Button variant="contained" component={Link} href={`/admin/products/${selected.id}`}>
              Editar
            </Button>
          )}
        </Stack>
        {selected && (
          <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
            <Typography fontWeight={600}>{selected.name}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {selected.description}
            </Typography>
            <Divider sx={{ my: 1.5 }} />
            <Stack direction="row" spacing={2} flexWrap="wrap">
              <Chip label={`Stock: ${selected.stock}`} />
              <Chip label={`Categoria: ${selected.category}`} variant="outlined" />
              <Chip
                label={selected.is_active === false ? 'Inactivo' : 'Activo'}
                color={selected.is_active === false ? 'default' : 'success'}
              />
            </Stack>
            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
              <Button variant="outlined" component={Link} href={`/admin/products/${selected.id}`}>
                Ver detalle
              </Button>
              <Button variant="contained" component={Link} href={`/admin/products/${selected.id}`}>
                Editar
              </Button>
              <Button
                color="error"
                variant="contained"
                onClick={() => {
                  setDeleteId(selected.id);
                  setConfirmOpen(true);
                }}
              >
                Desactivar
              </Button>
            </Stack>
          </Paper>
        )}
      </Paper>

      <DataTable
        title="Consultados recientemente"
        isEmpty={recentEmptyState}
        emptyTitle="Aun no consultaste productos"
        emptyDescription="Busca un producto por ID y apareceran aqui."
      >
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Categoria</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recentProducts.map((product) => (
              <TableRow key={product.id} hover>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{formatPrice(product.price)}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>
                  <Chip
                    label={product.is_active === false ? 'Inactivo' : 'Activo'}
                    color={product.is_active === false ? 'default' : 'success'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" component={Link} href={`/admin/products/${product.id}`}>
                    <VisibilityOutlinedIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" component={Link} href={`/admin/products/${product.id}`}>
                    <EditOutlinedIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => {
                      setDeleteId(product.id);
                      setConfirmOpen(true);
                    }}
                  >
                    <DeleteOutlineOutlinedIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DataTable>

      <ConfirmDialog
        open={confirmOpen}
        title="Desactivar producto"
        description="Esta accion desactivara el producto. Confirmar?"
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => handleDeactivate()}
      />

      <Snackbar open={Boolean(snack)} autoHideDuration={3000} onClose={() => setSnack(null)}>
        {snack ? <Alert severity={snack.severity}>{snack.message}</Alert> : null}
      </Snackbar>
    </Stack>
  );
}


