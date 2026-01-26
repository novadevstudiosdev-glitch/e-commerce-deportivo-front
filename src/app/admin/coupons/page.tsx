// ============================================
// ADMIN COUPONS
// ============================================

'use client';

import { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Snackbar,
} from '@mui/material';
import type { CouponDTO, CouponForm as CouponFormType } from '@/types/admin';
import { adminCouponsService } from '@/services/admin/coupons.service';
import { CouponForm } from '@/components/admin/forms/CouponForm';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { EmptyState } from '@/components/admin/EmptyState';

const initialForm: CouponFormType = {
  code: '',
  type: 'percent',
  value: 0,
  starts_at: '',
  ends_at: '',
  active: true,
};

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<CouponDTO[]>([]);
  const [form, setForm] = useState<CouponFormType>(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [snack, setSnack] = useState<{ message: string; severity: 'success' | 'error' } | null>(
    null
  );
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const loadCoupons = async () => {
    setIsLoading(true);
    setError(null);
    const result = await adminCouponsService.list();
    if (!result.ok) {
      setError(result.error || 'No se pudieron cargar cupones.');
      setIsLoading(false);
      return;
    }
    setCoupons(result.data ?? []);
    setIsLoading(false);
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleSubmit = async () => {
    setIsLoading(true);
    const result = editingId
      ? await adminCouponsService.update(editingId, form)
      : await adminCouponsService.create(form);
    if (!result.ok) {
      setSnack({ message: result.error || 'Error guardando cupon', severity: 'error' });
      setIsLoading(false);
      return;
    }
    setSnack({ message: 'Cupon guardado', severity: 'success' });
    setForm(initialForm);
    setEditingId(null);
    loadCoupons();
  };

  const handleEdit = (coupon: CouponDTO) => {
    setEditingId(coupon.id);
    setForm({
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      starts_at: coupon.starts_at || '',
      ends_at: coupon.ends_at || '',
      active: Boolean(coupon.active),
    });
  };

  const handleDeactivate = async () => {
    if (!confirmId) return;
    const result = await adminCouponsService.deactivate(confirmId);
    if (!result.ok) {
      setSnack({ message: result.error || 'No se pudo desactivar', severity: 'error' });
      return;
    }
    setSnack({ message: 'Cupon desactivado', severity: 'success' });
    setConfirmId(null);
    loadCoupons();
  };

  return (
    <Stack spacing={3}>
      <CouponForm
        value={form}
        onChange={setForm}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        submitLabel={editingId ? 'Guardar cambios' : 'Crear cupon'}
      />

      {error && (
        <Alert severity="error" action={<Button onClick={loadCoupons}>Reintentar</Button>}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
          Cupones
        </Typography>
        {isLoading ? (
          <Typography color="text.secondary">Cargando...</Typography>
        ) : coupons.length === 0 ? (
          <EmptyState title="Sin cupones" />
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Codigo</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Valor</TableCell>
                <TableCell>Activo</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {coupons.map((coupon) => (
                <TableRow key={coupon.id} hover>
                  <TableCell>{coupon.code}</TableCell>
                  <TableCell>{coupon.type}</TableCell>
                  <TableCell>{coupon.value}</TableCell>
                  <TableCell>{coupon.active ? 'Si' : 'No'}</TableCell>
                  <TableCell>
                    <Button size="small" onClick={() => handleEdit(coupon)}>
                      Editar
                    </Button>
                    <Button size="small" color="error" onClick={() => setConfirmId(coupon.id)}>
                      Desactivar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>

      <ConfirmDialog
        open={Boolean(confirmId)}
        title="Desactivar cupon"
        description="Esta accion desactivara el cupon. Confirmar?"
        onClose={() => setConfirmId(null)}
        onConfirm={handleDeactivate}
      />

      <Snackbar open={Boolean(snack)} autoHideDuration={3000} onClose={() => setSnack(null)}>
        {snack ? <Alert severity={snack.severity}>{snack.message}</Alert> : null}
      </Snackbar>
    </Stack>
  );
}
