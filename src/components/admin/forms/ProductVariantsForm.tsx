// ============================================
// PRODUCT VARIANTS FORM (ADMIN)
// ============================================

'use client';

import {
  Alert,
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import type {
  AdminProductCreatePayload,
  AdminProductImageInput,
  AdminProductVariantInput,
  CatalogBrand,
  CatalogCategory,
  CatalogColor,
  CatalogSize,
  CatalogSport,
} from '@/types/admin';

type ProductVariantsFormProps = {
  value: AdminProductCreatePayload;
  onChange: (next: AdminProductCreatePayload) => void;
  onSubmit: () => void;
  isLoading?: boolean;
  submitLabel?: string;
  sizes: CatalogSize[];
  colors: CatalogColor[];
  categories: CatalogCategory[];
  brands: CatalogBrand[];
  sports: CatalogSport[];
};

const defaultVariant: AdminProductVariantInput = {
  size_id: null,
  color_id: null,
  base_price: 0,
  discount_percentage: 0,
  stock: 0,
  low_stock_threshold: 0,
  is_active: true,
};

const defaultImage: AdminProductImageInput = {
  url: '',
  is_main: true,
  sort_order: 1,
};

export function ProductVariantsForm({
  value,
  onChange,
  onSubmit,
  isLoading = false,
  submitLabel = 'Guardar',
  sizes,
  colors,
  categories,
  brands,
  sports,
}: ProductVariantsFormProps) {
  const updateField = <K extends keyof AdminProductCreatePayload>(
    field: K,
    fieldValue: AdminProductCreatePayload[K],
  ) => {
    onChange({ ...value, [field]: fieldValue });
  };

  const updateVariants = (next: AdminProductVariantInput[]) => {
    onChange({ ...value, variants: next });
  };

  const updateImages = (next: AdminProductImageInput[]) => {
    const normalized = next.map((image, index) => ({
      ...image,
      sort_order: index + 1,
    }));
    onChange({ ...value, images: normalized });
  };

  const handleSetMain = (index: number) => {
    const next = (value.images ?? []).map((image, idx) => ({
      ...image,
      is_main: idx === index,
    }));
    updateImages(next);
  };

  const addVariant = () => {
    updateVariants([...(value.variants ?? []), { ...defaultVariant }]);
  };

  const removeVariant = (index: number) => {
    if ((value.variants ?? []).length <= 1) {
      return;
    }
    updateVariants(value.variants.filter((_, idx) => idx !== index));
  };

  const addImage = () => {
    const next = [...(value.images ?? []), { ...defaultImage, is_main: false }];
    if (next.length === 1) {
      next[0].is_main = true;
    }
    updateImages(next);
  };

  const removeImage = (index: number) => {
    const next = (value.images ?? []).filter((_, idx) => idx !== index);
    if (next.length > 0 && !next.some((image) => image.is_main)) {
      next[0].is_main = true;
    }
    updateImages(next);
  };

  return (
    <Paper
      sx={{
        p: { xs: 2, md: 3 },
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: '0 14px 30px rgba(15, 23, 42, 0.08)',
      }}
    >
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
        Datos del producto
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            label="Nombre"
            fullWidth
            value={value.name}
            onChange={(e) => updateField('name', e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Categoria"
            select
            fullWidth
            value={value.category_id}
            onChange={(e) => updateField('category_id', e.target.value)}
            disabled={categories.length === 0}
            helperText={
              categories.length > 0
                ? 'Selecciona la categoria del producto'
                : 'No hay categorias cargadas'
            }
          >
            <MenuItem value="" disabled>
              Selecciona una categoria
            </MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Descripcion"
            fullWidth
            multiline
            rows={3}
            value={value.description}
            onChange={(e) => updateField('description', e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Marca (opcional)"
            select
            fullWidth
            value={value.brand_id ?? ''}
            onChange={(e) => updateField('brand_id', e.target.value || null)}
            disabled={brands.length === 0}
            helperText={brands.length > 0 ? 'Selecciona una marca' : 'Sin marcas cargadas'}
          >
            <MenuItem value="">Sin marca</MenuItem>
            {brands.map((brand) => (
              <MenuItem key={brand.id} value={brand.id}>
                {brand.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Deporte (opcional)"
            select
            fullWidth
            value={value.sport_id ?? ''}
            onChange={(e) => updateField('sport_id', e.target.value || null)}
            disabled={sports.length === 0}
            helperText={sports.length > 0 ? 'Selecciona un deporte' : 'Sin deportes cargados'}
          >
            <MenuItem value="">Sin deporte</MenuItem>
            {sports.map((sport) => (
              <MenuItem key={sport.id} value={sport.id}>
                {sport.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <Stack direction="row" spacing={2}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={Boolean(value.is_active)}
                  onChange={(e) => updateField('is_active', e.target.checked)}
                />
              }
              label="Activo"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={Boolean(value.is_featured)}
                  onChange={(e) => updateField('is_featured', e.target.checked)}
                />
              }
              label="Destacado"
            />
          </Stack>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      <Stack spacing={2}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight={700}>
            Imagenes
          </Typography>
          <Button variant="outlined" startIcon={<AddOutlinedIcon />} onClick={addImage}>
            Agregar imagen
          </Button>
        </Stack>

        {(value.images ?? []).length === 0 && (
          <Alert severity="info">No hay imagenes cargadas.</Alert>
        )}

        {(value.images ?? []).map((image, index) => (
          <Box
            key={`image-${index}`}
            sx={{
              p: 2,
              border: '1px solid #E5E7EB',
              borderRadius: 2,
              bgcolor: '#F8FAFC',
            }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={8}>
                <TextField
                  label="URL"
                  fullWidth
                  value={image.url}
                  onChange={(e) => {
                    const next = [...(value.images ?? [])];
                    next[index] = { ...next[index], url: e.target.value };
                    updateImages(next);
                  }}
                />
              </Grid>
              <Grid item xs={8} md={3}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={image.is_main ?? false}
                      onChange={() => handleSetMain(index)}
                    />
                  }
                  label="Principal"
                />
              </Grid>
              <Grid item xs={4} md={1}>
                <IconButton onClick={() => removeImage(index)} size="small" color="error">
                  <DeleteOutlineOutlinedIcon fontSize="small" />
                </IconButton>
              </Grid>
            </Grid>
            <Typography variant="caption" color="text.secondary">
              Orden: {image.sort_order ?? index + 1}
            </Typography>
          </Box>
        ))}
      </Stack>

      <Divider sx={{ my: 3 }} />

      <Stack spacing={2}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight={700}>
            Variantes
          </Typography>
          <Button variant="outlined" startIcon={<AddOutlinedIcon />} onClick={addVariant}>
            Agregar variante
          </Button>
        </Stack>

        {(value.variants ?? []).map((variant, index) => (
          <Box
            key={`variant-${index}`}
            sx={{
              p: 2,
              border: '1px solid #E5E7EB',
              borderRadius: 2,
              bgcolor: '#FFFFFF',
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <TextField
                  label="Talle"
                  select
                  fullWidth
                  value={variant.size_id ?? ''}
                  onChange={(e) => {
                    const next = [...value.variants];
                    next[index] = { ...next[index], size_id: e.target.value || null };
                    updateVariants(next);
                  }}
                >
                  <MenuItem value="">Sin talle</MenuItem>
                  {sizes.map((size) => (
                    <MenuItem key={size.id} value={size.id}>
                      {size.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  label="Color"
                  select
                  fullWidth
                  value={variant.color_id ?? ''}
                  onChange={(e) => {
                    const next = [...value.variants];
                    next[index] = { ...next[index], color_id: e.target.value || null };
                    updateVariants(next);
                  }}
                >
                  <MenuItem value="">Sin color</MenuItem>
                  {colors.map((color) => (
                    <MenuItem key={color.id} value={color.id}>
                      <Box
                        component="span"
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          display: 'inline-block',
                          mr: 1,
                          bgcolor: color.hex ?? '#E5E7EB',
                          border: '1px solid #CBD5E1',
                          verticalAlign: 'middle',
                        }}
                      />
                      {color.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  label="Precio base"
                  type="number"
                  fullWidth
                  value={variant.base_price}
                  onChange={(e) => {
                    const next = [...value.variants];
                    next[index] = { ...next[index], base_price: Number(e.target.value) };
                    updateVariants(next);
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  label="Descuento %"
                  type="number"
                  fullWidth
                  value={variant.discount_percentage ?? 0}
                  onChange={(e) => {
                    const next = [...value.variants];
                    next[index] = { ...next[index], discount_percentage: Number(e.target.value) };
                    updateVariants(next);
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  label="Stock"
                  type="number"
                  fullWidth
                  value={variant.stock}
                  onChange={(e) => {
                    const next = [...value.variants];
                    next[index] = { ...next[index], stock: Number(e.target.value) };
                    updateVariants(next);
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  label="Stock minimo"
                  type="number"
                  fullWidth
                  value={variant.low_stock_threshold ?? 0}
                  onChange={(e) => {
                    const next = [...value.variants];
                    next[index] = { ...next[index], low_stock_threshold: Number(e.target.value) };
                    updateVariants(next);
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="SKU (opcional)"
                  fullWidth
                  value={variant.sku ?? ''}
                  onChange={(e) => {
                    const next = [...value.variants];
                    next[index] = { ...next[index], sku: e.target.value };
                    updateVariants(next);
                  }}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={variant.is_active ?? true}
                      onChange={(e) => {
                        const next = [...value.variants];
                        next[index] = { ...next[index], is_active: e.target.checked };
                        updateVariants(next);
                      }}
                    />
                  }
                  label="Activo"
                />
              </Grid>
              <Grid item xs={12} md={1}>
                <IconButton
                  onClick={() => removeVariant(index)}
                  size="small"
                  color="error"
                  disabled={(value.variants ?? []).length <= 1}
                >
                  <DeleteOutlineOutlinedIcon fontSize="small" />
                </IconButton>
              </Grid>
            </Grid>
          </Box>
        ))}
      </Stack>

      <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3 }}>
        <Button variant="contained" onClick={onSubmit} disabled={isLoading}>
          {submitLabel}
        </Button>
      </Stack>
    </Paper>
  );
}
