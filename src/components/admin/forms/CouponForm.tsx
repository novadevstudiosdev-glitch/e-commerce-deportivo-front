// ============================================
// COUPON FORM
// ============================================

'use client';

import { Button, Grid, Paper, Stack, TextField, Typography, FormControlLabel, Checkbox, MenuItem } from '@mui/material';
import type { CouponForm as CouponFormType } from '@/types/admin';

type CouponFormProps = {
  value: CouponFormType;
  onChange: (next: CouponFormType) => void;
  onSubmit: () => void;
  isLoading?: boolean;
  submitLabel?: string;
};

export function CouponForm({
  value,
  onChange,
  onSubmit,
  isLoading = false,
  submitLabel = 'Guardar',
}: CouponFormProps) {
  const updateField = (field: keyof CouponFormType, fieldValue: string | number | boolean) => {
    onChange({ ...value, [field]: fieldValue });
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
        Cupon
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            label="Codigo"
            fullWidth
            value={value.code}
            onChange={(e) => updateField('code', e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Tipo"
            select
            fullWidth
            value={value.type}
            onChange={(e) => updateField('type', e.target.value)}
          >
            <MenuItem value="percent">Porcentaje</MenuItem>
            <MenuItem value="fixed">Fijo</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label="Valor"
            fullWidth
            type="number"
            value={value.value}
            onChange={(e) => updateField('value', Number(e.target.value))}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label="Inicio"
            fullWidth
            type="date"
            value={value.starts_at || ''}
            onChange={(e) => updateField('starts_at', e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label="Fin"
            fullWidth
            type="date"
            value={value.ends_at || ''}
            onChange={(e) => updateField('ends_at', e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={value.active}
                onChange={(e) => updateField('active', e.target.checked)}
              />
            }
            label="Activo"
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
