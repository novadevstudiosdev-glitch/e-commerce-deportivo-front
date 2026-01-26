// ============================================
// ADMIN ORDERS (QUICK ACTIONS)
// ============================================

'use client';

import { useState } from 'react';
import {
  Alert,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
  Snackbar,
  MenuItem,
} from '@mui/material';
import { adminOrdersService } from '@/services/admin/orders.service';
import type { OrderStatus, PaymentStatus } from '@/types/admin';

export default function AdminOrdersPage() {
  const [orderId, setOrderId] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('pending');
  const [orderStatus, setOrderStatus] = useState<OrderStatus>('processing');
  const [snack, setSnack] = useState<{ message: string; severity: 'success' | 'error' } | null>(
    null
  );

  const handlePayment = async () => {
    if (!orderId) return;
    const result = await adminOrdersService.updatePayment(orderId, { status: paymentStatus });
    if (!result.ok) {
      setSnack({ message: result.error || 'No se pudo actualizar el pago', severity: 'error' });
      return;
    }
    setSnack({ message: 'Pago actualizado', severity: 'success' });
  };

  const handleStatus = async () => {
    if (!orderId) return;
    const result = await adminOrdersService.updateStatus(orderId, { status: orderStatus });
    if (!result.ok) {
      setSnack({ message: result.error || 'No se pudo actualizar el envio', severity: 'error' });
      return;
    }
    setSnack({ message: 'Envio actualizado', severity: 'success' });
  };

  return (
    <Stack spacing={2}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
          Acciones rapidas
        </Typography>
        <Typography variant="body2" color="text.secondary">
          No hay endpoint de listado. Usa el ID de orden para actualizar pago o estado.
        </Typography>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Stack spacing={2}>
          <TextField
            label="Order ID"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            fullWidth
          />

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              select
              label="Estado de pago"
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
              fullWidth
            >
              {['pending', 'paid', 'failed', 'refunded', 'cancelled'].map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </TextField>
            <Button variant="contained" onClick={handlePayment}>
              Actualizar pago
            </Button>
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              select
              label="Estado de envio"
              value={orderStatus}
              onChange={(e) => setOrderStatus(e.target.value as OrderStatus)}
              fullWidth
            >
              {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </TextField>
            <Button variant="contained" onClick={handleStatus}>
              Actualizar envio
            </Button>
          </Stack>
        </Stack>
      </Paper>

      <Snackbar open={Boolean(snack)} autoHideDuration={3000} onClose={() => setSnack(null)}>
        {snack ? <Alert severity={snack.severity}>{snack.message}</Alert> : null}
      </Snackbar>
    </Stack>
  );
}
