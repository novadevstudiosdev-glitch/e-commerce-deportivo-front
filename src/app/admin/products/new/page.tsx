// ============================================
// ADMIN NEW PRODUCT
// ============================================

'use client';

import { useState } from 'react';
import { Alert, Snackbar, Stack } from '@mui/material';
import { useRouter } from 'next/navigation';
import { ProductForm } from '@/components/admin/forms/ProductForm';
import type { AdminProductForm } from '@/types/admin';
import { adminProductsService } from '@/services/admin/products.service';

const initialForm: AdminProductForm = {
  name: '',
  description: '',
  price: 0,
  currency: 'ARS',
  stock: 0,
  category: '',
  images: [],
  is_featured: false,
};

export default function AdminNewProductPage() {
  const router = useRouter();
  const [form, setForm] = useState<AdminProductForm>(initialForm);
  const [isLoading, setIsLoading] = useState(false);
  const [snack, setSnack] = useState<{ message: string; severity: 'success' | 'error' } | null>(
    null
  );

  const handleSubmit = async () => {
    setIsLoading(true);
    const result = await adminProductsService.create(form);
    if (!result.ok) {
      setSnack({ message: result.error || 'No se pudo crear el producto', severity: 'error' });
      setIsLoading(false);
      return;
    }
    setSnack({ message: 'Producto creado', severity: 'success' });
    setIsLoading(false);
    if (result.data?.id) {
      router.push(`/admin/products/${result.data.id}`);
    }
  };

  return (
    <Stack spacing={2}>
      <ProductForm value={form} onChange={setForm} onSubmit={handleSubmit} isLoading={isLoading} submitLabel="Crear" />
      <Snackbar
        open={Boolean(snack)}
        autoHideDuration={3000}
        onClose={() => setSnack(null)}
      >
        {snack ? <Alert severity={snack.severity}>{snack.message}</Alert> : null}
      </Snackbar>
    </Stack>
  );
}
