// ============================================
// ADMIN NEW PRODUCT
// ============================================

'use client';

import { useEffect, useState } from 'react';
import { Alert, Snackbar, Stack } from '@mui/material';
import { useRouter } from 'next/navigation';
import { ProductVariantsForm } from '@/components/admin/forms/ProductVariantsForm';
import type {
  AdminProductCreatePayload,
  CatalogBrand,
  CatalogCategory,
  CatalogColor,
  CatalogSize,
  CatalogSport,
} from '@/types/admin';
import { adminProductsService } from '@/services/admin/products.service';
import { adminCatalogService } from '@/services/admin/catalog.service';

const initialForm: AdminProductCreatePayload = {
  name: '',
  description: '',
  category_id: '',
  brand_id: null,
  sport_id: null,
  is_active: true,
  is_featured: false,
  images: [],
  variants: [
    {
      size_id: null,
      color_id: null,
      base_price: 0,
      discount_percentage: 0,
      stock: 0,
      low_stock_threshold: 0,
      is_active: true,
    },
  ],
};

export default function AdminNewProductPage() {
  const router = useRouter();
  const [form, setForm] = useState<AdminProductCreatePayload>(initialForm);
  const [sizes, setSizes] = useState<CatalogSize[]>([]);
  const [colors, setColors] = useState<CatalogColor[]>([]);
  const [categories, setCategories] = useState<CatalogCategory[]>([]);
  const [brands, setBrands] = useState<CatalogBrand[]>([]);
  const [sports, setSports] = useState<CatalogSport[]>([]);
  const [catalogError, setCatalogError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [snack, setSnack] = useState<{ message: string; severity: 'success' | 'error' } | null>(
    null
  );

  useEffect(() => {
    const loadCatalog = async () => {
      const [sizesRes, colorsRes, categoriesRes, brandsRes, sportsRes] = await Promise.all([
        adminCatalogService.listSizes(),
        adminCatalogService.listColors(),
        adminCatalogService.listCategories(),
        adminCatalogService.listBrands(),
        adminCatalogService.listSports(),
      ]);

      if (!sizesRes.ok || !colorsRes.ok || !categoriesRes.ok || !brandsRes.ok || !sportsRes.ok) {
        setCatalogError(
          sizesRes.error ||
            colorsRes.error ||
            categoriesRes.error ||
            brandsRes.error ||
            sportsRes.error ||
            'No se pudieron cargar los catalogos.',
        );
        return;
      }

      setSizes(sizesRes.data ?? []);
      setColors(colorsRes.data ?? []);
      setCategories(categoriesRes.data ?? []);
      setBrands(brandsRes.data ?? []);
      setSports(sportsRes.data ?? []);

      if ((categoriesRes.data ?? []).length > 0) {
        setForm((prev) =>
          prev.category_id ? prev : { ...prev, category_id: categoriesRes.data?.[0]?.id ?? '' },
        );
      }
    };

    void loadCatalog();
  }, []);

  const handleSubmit = async () => {
    setIsLoading(true);
    const images = (form.images ?? [])
      .filter((image) => image.url.trim().length > 0)
      .map((image, index) => ({
        url: image.url.trim(),
        is_main: image.is_main ?? false,
        sort_order: index + 1,
      }));

    if (images.length > 0 && !images.some((image) => image.is_main)) {
      images[0].is_main = true;
    }

    const variants = form.variants.map((variant) => ({
      ...variant,
      size_id: variant.size_id || null,
      color_id: variant.color_id || null,
      discount_percentage: variant.discount_percentage ?? 0,
      low_stock_threshold: variant.low_stock_threshold ?? 0,
      is_active: variant.is_active ?? true,
    }));

    const payload: AdminProductCreatePayload = {
      ...form,
      category_id: form.category_id.trim(),
      brand_id: form.brand_id?.trim() ? form.brand_id : null,
      sport_id: form.sport_id?.trim() ? form.sport_id : null,
      images,
      variants,
    };

    const result = await adminProductsService.create(payload);
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
      {catalogError && <Alert severity="error">{catalogError}</Alert>}
      <ProductVariantsForm
        value={form}
        onChange={setForm}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        submitLabel="Crear"
        sizes={sizes}
        colors={colors}
        categories={categories}
        brands={brands}
        sports={sports}
      />
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
