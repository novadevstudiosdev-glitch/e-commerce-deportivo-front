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
  Grid,
} from '@mui/material';
import { adminOrdersService } from '@/services/admin/orders.service';
import type { OrderStatus, PaymentStatus } from '@/types/admin';

export default function AdminOrdersPage() {
  const [orderId, setOrderId] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('aprobado');
  const [orderStatus, setOrderStatus] = useState<OrderStatus>('en_preparacion');
  const [isLoading, setIsLoading] = useState(false);
  const [snack, setSnack] = useState<{ message: string; severity: 'success' | 'error' } | null>(
    null
  );

  const handlePayment = async () => {
    if (!orderId) return;
    setIsLoading(true);
    const result = await adminOrdersService.updatePayment(orderId, { status: paymentStatus });
    if (!result.ok) {
      setSnack({ message: result.error || 'No se pudo actualizar el pago', severity: 'error' });
      setIsLoading(false);
      return;
    }
    setSnack({ message: 'Pago actualizado', severity: 'success' });
    setIsLoading(false);
  };

  const handleStatus = async () => {
    if (!orderId) return;
    setIsLoading(true);
    const result = await adminOrdersService.updateStatus(orderId, { status: orderStatus });
    if (!result.ok) {
      setSnack({ message: result.error || 'No se pudo actualizar el envio', severity: 'error' });
      setIsLoading(false);
      return;
    }
    setSnack({ message: 'Envio actualizado', severity: 'success' });
    setIsLoading(false);
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

          {!orderId && <Alert severity="info">Ingresa un ID para habilitar las acciones.</Alert>}

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography fontWeight={600} sx={{ mb: 1 }}>
                  Estado de pago
                </Typography>
                <Stack spacing={2}>
                  <TextField
                    select
                    label="Estado de pago"
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
                    fullWidth
                  >
                    <MenuItem value="aprobado">Aprobado</MenuItem>
                    <MenuItem value="rechazado">Rechazado</MenuItem>
                    <MenuItem value="reembolsado">Reembolsado</MenuItem>
                  </TextField>
                  <Button
                    variant="contained"
                    onClick={handlePayment}
                    disabled={!orderId || isLoading}
                  >
                    Actualizar pago
                  </Button>
                </Stack>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography fontWeight={600} sx={{ mb: 1 }}>
                  Estado de envio
                </Typography>
                <Stack spacing={2}>
                  <TextField
                    select
                    label="Estado de envio"
                    value={orderStatus}
                    onChange={(e) => setOrderStatus(e.target.value as OrderStatus)}
                    fullWidth
                  >
                    <MenuItem value="en_preparacion">En preparacion</MenuItem>
                    <MenuItem value="enviado">Enviado</MenuItem>
                    <MenuItem value="entregado">Entregado</MenuItem>
                  </TextField>
                  <Button
                    variant="contained"
                    onClick={handleStatus}
                    disabled={!orderId || isLoading}
                  >
                    Actualizar envio
                  </Button>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Stack>
      </Paper>

      <Snackbar open={Boolean(snack)} autoHideDuration={3000} onClose={() => setSnack(null)}>
        {snack ? <Alert severity={snack.severity}>{snack.message}</Alert> : null}
      </Snackbar>
    </Stack>
  );
}
