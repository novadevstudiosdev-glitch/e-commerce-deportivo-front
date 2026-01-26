// ============================================
// PRODUCT FORM
// ============================================

'use client';

import { Button, Grid, Paper, Stack, TextField, Typography, Checkbox, FormControlLabel } from '@mui/material';
import type { AdminProductForm } from '@/types/admin';

type ProductFormProps = {
  value: AdminProductForm;
  onChange: (next: AdminProductForm) => void;
  onSubmit: () => void;
  isLoading?: boolean;
  submitLabel?: string;
};

export function ProductForm({
  value,
  onChange,
  onSubmit,
  isLoading = false,
  submitLabel = 'Guardar',
}: ProductFormProps) {
  const imagesValue = value.images.join('\n');

  const updateField = (field: keyof AdminProductForm, fieldValue: string | number | boolean) => {
    onChange({ ...value, [field]: fieldValue });
  };

  return (
    <Paper sx={{ p: 3 }}>
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
            fullWidth
            value={value.category}
            onChange={(e) => updateField('category', e.target.value)}
          />
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
        <Grid item xs={12} md={4}>
          <TextField
            label="Precio"
            fullWidth
            type="number"
            value={value.price}
            onChange={(e) => updateField('price', Number(e.target.value))}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label="Moneda"
            fullWidth
            value={value.currency}
            onChange={(e) => updateField('currency', e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label="Stock"
            fullWidth
            type="number"
            value={value.stock}
            onChange={(e) => updateField('stock', Number(e.target.value))}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Imagenes (una por linea)"
            fullWidth
            multiline
            rows={3}
            value={imagesValue}
            onChange={(e) =>
              updateField(
                'images',
                e.target.value
                  .split(/\n|,/)
                  .map((item) => item.trim())
                  .filter(Boolean)
              )
            }
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={value.is_featured}
                onChange={(e) => updateField('is_featured', e.target.checked)}
              />
            }
            label="Destacado"
          />
        </Grid>
      </Grid>

      <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3 }}>
        <Button variant="contained" onClick={onSubmit} disabled={isLoading}>
          {submitLabel}
        </Button>
      </Stack>
    </Paper>
  );
}
