// ============================================
// ADMIN EDIT PRODUCT
// ============================================

'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Alert, Snackbar, Stack } from '@mui/material';
import { ProductVariantsForm } from '@/components/admin/forms/ProductVariantsForm';
import type {
  AdminProductCreatePayload,
  AdminProductDetail,
  CatalogBrand,
  CatalogCategory,
  CatalogColor,
  CatalogSize,
  CatalogSport,
} from '@/types/admin';
import { adminProductsService } from '@/services/admin/products.service';
import { adminCatalogService } from '@/services/admin/catalog.service';

const emptyForm: AdminProductCreatePayload = {
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

export default function AdminEditProductPage() {
  const params = useParams<{ id: string }>();
  const productId = params?.id ?? '';
  const [form, setForm] = useState<AdminProductCreatePayload>(emptyForm);
  const [sizes, setSizes] = useState<CatalogSize[]>([]);
  const [colors, setColors] = useState<CatalogColor[]>([]);
  const [categories, setCategories] = useState<CatalogCategory[]>([]);
  const [brands, setBrands] = useState<CatalogBrand[]>([]);
  const [sports, setSports] = useState<CatalogSport[]>([]);
  const [catalogError, setCatalogError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [snack, setSnack] = useState<{ message: string; severity: 'success' | 'error' } | null>(
    null
  );

  useEffect(() => {
    if (!productId) return;
    const loadData = async () => {
      setIsLoading(true);
      const [
        sizesRes,
        colorsRes,
        categoriesRes,
        brandsRes,
        sportsRes,
        productRes,
      ] = await Promise.all([
        adminCatalogService.listSizes(),
        adminCatalogService.listColors(),
        adminCatalogService.listCategories(),
        adminCatalogService.listBrands(),
        adminCatalogService.listSports(),
        adminProductsService.getById(productId),
      ]);

      const catalogMessage =
        sizesRes.error ||
        colorsRes.error ||
        categoriesRes.error ||
        brandsRes.error ||
        sportsRes.error;

      if (catalogMessage) {
        setCatalogError(catalogMessage);
      } else {
        setCatalogError(null);
      }

      if (sizesRes.ok) setSizes(sizesRes.data ?? []);
      if (colorsRes.ok) setColors(colorsRes.data ?? []);
      if (categoriesRes.ok) setCategories(categoriesRes.data ?? []);
      if (brandsRes.ok) setBrands(brandsRes.data ?? []);
      if (sportsRes.ok) setSports(sportsRes.data ?? []);

      if (!productRes.ok || !productRes.data) {
        setSnack({ message: productRes.error || 'No se pudo cargar el producto', severity: 'error' });
        setIsLoading(false);
        return;
      }

      const data: AdminProductDetail = productRes.data;
      setForm({
        name: data.name,
        description: data.description,
        category_id: data.category_id ?? '',
        brand_id: data.brand_id ?? null,
        sport_id: data.sport_id ?? null,
        is_active: Boolean(data.is_active),
        is_featured: Boolean(data.is_featured),
        images: (data.images ?? []).map((image) => ({
          url: image.url,
          is_main: image.is_main,
          sort_order: image.sort_order,
        })),
        variants:
          data.variants?.map((variant) => ({
            size_id: variant.size?.id ?? null,
            color_id: variant.color?.id ?? null,
            base_price: variant.base_price,
            discount_percentage: variant.discount_percentage ?? 0,
            stock: variant.stock,
            low_stock_threshold: variant.low_stock_threshold ?? 0,
            sku: variant.sku,
            is_active: variant.is_active,
          })) ?? emptyForm.variants,
      });

      if (
        !data.category_id &&
        categoriesRes.ok &&
        (categoriesRes.data ?? []).length > 0
      ) {
        setForm((prev) => ({
          ...prev,
          category_id: categoriesRes.data?.[0]?.id ?? '',
        }));
      }

      setIsLoading(false);
    };

    void loadData();
  }, [productId]);

  const handleSubmit = async () => {
    if (!productId) return;
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

    const result = await adminProductsService.update(productId, payload);
    if (!result.ok) {
      setSnack({ message: result.error || 'No se pudo guardar', severity: 'error' });
      return;
    }
    setSnack({ message: 'Producto actualizado', severity: 'success' });
  };

  return (
    <Stack spacing={2}>
      {catalogError && <Alert severity="warning">{catalogError}</Alert>}
      {isLoading ? (
        <Alert severity="info">Cargando...</Alert>
      ) : (
        <ProductVariantsForm
          value={form}
          onChange={setForm}
          onSubmit={handleSubmit}
          submitLabel="Guardar cambios"
          sizes={sizes}
          colors={colors}
          categories={categories}
          brands={brands}
          sports={sports}
        />
      )}
      <Snackbar open={Boolean(snack)} autoHideDuration={3000} onClose={() => setSnack(null)}>
        {snack ? <Alert severity={snack.severity}>{snack.message}</Alert> : null}
      </Snackbar>
    </Stack>
  );
}
