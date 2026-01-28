// ============================================
// ADMIN COUPONS
// ============================================

'use client';

import { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
} from '@mui/material';
import type { CouponDTO, CouponForm as CouponFormType } from '@/types/admin';
import { adminCouponsService } from '@/services/admin/coupons.service';
import { CouponForm } from '@/components/admin/forms/CouponForm';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { DataTable } from '@/components/admin/DataTable';

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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [snack, setSnack] = useState<{ message: string; severity: 'success' | 'error' } | null>(
    null
  );
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const normalizeCoupons = (value: unknown): CouponDTO[] => {
    if (Array.isArray(value)) {
      return value as CouponDTO[];
    }
    if (value && typeof value === 'object') {
      const payload = value as { data?: unknown; items?: unknown };
      if (Array.isArray(payload.data)) return payload.data as CouponDTO[];
      if (Array.isArray(payload.items)) return payload.items as CouponDTO[];
    }
    return [];
  };

  const loadCoupons = async () => {
    setIsLoading(true);
    setError(null);
    const result = await adminCouponsService.list();
    if (!result.ok) {
      setError(result.error || 'No se pudieron cargar cupones.');
      setIsLoading(false);
      return;
    }
    setCoupons(normalizeCoupons(result.data));
    setIsLoading(false);
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(initialForm);
    setDialogOpen(true);
  };

  const openEdit = (coupon: CouponDTO) => {
    setEditingId(coupon.id);
    setForm({
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      starts_at: coupon.starts_at || '',
      ends_at: coupon.ends_at || '',
      active: Boolean(coupon.active),
    });
    setDialogOpen(true);
  };

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
    setDialogOpen(false);
    loadCoupons();
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
      {error && (
        <Alert severity="error" action={<Button onClick={loadCoupons}>Reintentar</Button>}>
          {error}
        </Alert>
      )}

      <DataTable
        title="Cupones"
        action={
          <Button variant="contained" onClick={openCreate}>
            Crear cupon
          </Button>
        }
        isLoading={isLoading}
        isEmpty={!isLoading && coupons.length === 0}
        emptyTitle="Sin cupones"
        emptyDescription="Crea un cupon para promociones."
      >
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Codigo</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Valor</TableCell>
              <TableCell>Activo</TableCell>
              <TableCell>Vigencia</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {coupons.map((coupon) => (
              <TableRow key={coupon.id} hover>
                <TableCell>{coupon.code}</TableCell>
                <TableCell>{coupon.type}</TableCell>
                <TableCell>{coupon.value}</TableCell>
                <TableCell>
                  <Chip
                    label={coupon.active ? 'Activo' : 'Inactivo'}
                    color={coupon.active ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {coupon.starts_at || '-'} / {coupon.ends_at || '-'}
                </TableCell>
                <TableCell>
                  <Button size="small" onClick={() => openEdit(coupon)}>
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
      </DataTable>

      <ConfirmDialog
        open={Boolean(confirmId)}
        title="Desactivar cupon"
        description="Esta accion desactivara el cupon. Confirmar?"
        onClose={() => setConfirmId(null)}
        onConfirm={handleDeactivate}
      />

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>{editingId ? 'Editar cupon' : 'Nuevo cupon'}</DialogTitle>
        <DialogContent dividers>
          <CouponForm
            value={form}
            onChange={setForm}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            submitLabel={editingId ? 'Guardar cambios' : 'Crear cupon'}
            variant="plain"
            showActions={false}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={isLoading}>
            {editingId ? 'Guardar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={Boolean(snack)} autoHideDuration={3000} onClose={() => setSnack(null)}>
        {snack ? <Alert severity={snack.severity}>{snack.message}</Alert> : null}
      </Snackbar>
    </Stack>
  );
}
