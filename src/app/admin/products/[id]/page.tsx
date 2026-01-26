// ============================================
// ADMIN EDIT PRODUCT
// ============================================

'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Alert, Snackbar, Stack } from '@mui/material';
import { ProductForm } from '@/components/admin/forms/ProductForm';
import type { AdminProductForm } from '@/types/admin';
import { adminProductsService } from '@/services/admin/products.service';

const emptyForm: AdminProductForm = {
  name: '',
  description: '',
  price: 0,
  currency: 'ARS',
  stock: 0,
  category: '',
  images: [],
  is_featured: false,
};

export default function AdminEditProductPage() {
  const params = useParams<{ id: string }>();
  const productId = params?.id ?? '';
  const [form, setForm] = useState<AdminProductForm>(emptyForm);
  const [isLoading, setIsLoading] = useState(true);
  const [snack, setSnack] = useState<{ message: string; severity: 'success' | 'error' } | null>(
    null
  );

  const loadProduct = useCallback(async () => {
    if (!productId) return;
    setIsLoading(true);
    const result = await adminProductsService.getById(productId);
    if (!result.ok || !result.data) {
      setSnack({ message: result.error || 'No se pudo cargar el producto', severity: 'error' });
      setIsLoading(false);
      return;
    }
    const data = result.data;
    setForm({
      name: data.name,
      description: data.description,
      price: data.price,
      currency: data.currency,
      stock: data.stock,
      category: data.category,
      images: data.images ?? [],
      is_featured: Boolean(data.is_featured),
    });
    setIsLoading(false);
  }, [productId]);

  useEffect(() => {
    void loadProduct();
  }, [loadProduct]);

  const handleSubmit = async () => {
    if (!productId) return;
    const result = await adminProductsService.update(productId, form);
    if (!result.ok) {
      setSnack({ message: result.error || 'No se pudo guardar', severity: 'error' });
      return;
    }
    setSnack({ message: 'Producto actualizado', severity: 'success' });
  };

  return (
    <Stack spacing={2}>
      {isLoading ? (
        <Alert severity="info">Cargando...</Alert>
      ) : (
        <ProductForm value={form} onChange={setForm} onSubmit={handleSubmit} submitLabel="Guardar" />
      )}
      <Snackbar open={Boolean(snack)} autoHideDuration={3000} onClose={() => setSnack(null)}>
        {snack ? <Alert severity={snack.severity}>{snack.message}</Alert> : null}
      </Snackbar>
    </Stack>
  );
}
