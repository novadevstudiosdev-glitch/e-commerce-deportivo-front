// ============================================
// ADMIN PRODUCTS
// ============================================

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Alert,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { adminProductsService } from '@/services/admin/products.service';
import type { AdminProductDTO } from '@/types/admin';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { EmptyState } from '@/components/admin/EmptyState';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProductDTO[]>([]);
  const [listAvailable, setListAvailable] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchId, setSearchId] = useState('');
  const [selected, setSelected] = useState<AdminProductDTO | null>(null);
  const [deleteId, setDeleteId] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);

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
    setProducts(result.data ?? []);
    setIsLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleSearch = async () => {
    if (!searchId) return;
    setError(null);
    const result = await adminProductsService.getById(searchId);
    if (!result.ok || !result.data) {
      setSelected(null);
      setError(result.error || 'No se encontro el producto.');
      return;
    }
    setSelected(result.data);
  };

  const handleDeactivate = async () => {
    if (!deleteId) return;
    setConfirmOpen(false);
    const result = await adminProductsService.deactivate(deleteId);
    if (!result.ok) {
      setError(result.error || 'No se pudo desactivar.');
      return;
    }
    setDeleteId('');
    loadProducts();
  };

  return (
    <Stack spacing={3}>
      <Paper sx={{ p: 3 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between">
          <div>
            <Typography variant="h6" fontWeight={700}>
              Gestion de productos
            </Typography>
            {!listAvailable && (
              <Alert severity="info" sx={{ mt: 2 }}>
                No hay endpoint de listado. Usa acciones por ID o crea un producto nuevo.
              </Alert>
            )}
          </div>
          <Button variant="contained" component={Link} href="/admin/products/new">
            Crear producto
          </Button>
        </Stack>
      </Paper>

      {error && <Alert severity="error">{error}</Alert>}

      {listAvailable && (
        <Paper sx={{ p: 2 }}>
          {isLoading ? (
            <Typography color="text.secondary">Cargando productos...</Typography>
          ) : products.length === 0 ? (
            <EmptyState title="Sin productos para mostrar" />
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Stock</TableCell>
                  <TableCell>Categoria</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id} hover>
                    <TableCell>{product.id}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>{product.category}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Paper>
      )}

      <Paper sx={{ p: 3 }}>
        <Typography variant="subtitle1" fontWeight={600}>
          Buscar producto por ID
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 2 }}>
          <TextField
            label="Product ID"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            fullWidth
          />
          <Button variant="outlined" onClick={handleSearch}>
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
            <Typography variant="body2" color="text.secondary">
              {selected.description}
            </Typography>
          </Paper>
        )}
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="subtitle1" fontWeight={600}>
          Desactivar producto por ID
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 2 }}>
          <TextField
            label="Product ID"
            value={deleteId}
            onChange={(e) => setDeleteId(e.target.value)}
            fullWidth
          />
          <Button color="error" variant="contained" onClick={() => setConfirmOpen(true)}>
            Desactivar
          </Button>
        </Stack>
      </Paper>

      <ConfirmDialog
        open={confirmOpen}
        title="Desactivar producto"
        description="Esta accion desactivara el producto. Confirmar?"
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDeactivate}
      />
    </Stack>
  );
}
