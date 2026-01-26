// ============================================
// CHECKOUT SUCCESS PAGE
// ============================================

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Alert,
  Button,
  Container,
  Divider,
  Grid,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { ROUTES } from '@/lib/routes';
import { formatCurrency } from '@/lib/format';
import type { CheckoutOrderSummary } from '@/types/checkout';

const ORDER_KEY = 'checkout-last-order';

export default function CheckoutSuccessPage() {
  const [order, setOrder] = useState<CheckoutOrderSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(ORDER_KEY);
    if (stored) {
      try {
        setOrder(JSON.parse(stored) as CheckoutOrderSummary);
      } catch {
        setOrder(null);
      }
    }
    const id = setTimeout(() => setIsLoading(false), 200);
    return () => clearTimeout(id);
  }, []);

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper sx={{ p: { xs: 3, md: 4 } }}>
        <Stack spacing={2} alignItems="center" textAlign="center">
          <CheckCircleOutlineIcon color="success" sx={{ fontSize: 48 }} />
          <Typography variant="h5" fontWeight={700}>
            Compra confirmada
          </Typography>
          <Typography color="text.secondary">
            Gracias por tu compra. Te enviamos un correo con los detalles.
          </Typography>
        </Stack>

        <Divider sx={{ my: 3 }} />

        {isLoading ? (
          <Stack spacing={2}>
            <Skeleton height={28} />
            <Skeleton height={28} />
            <Skeleton height={120} />
          </Stack>
        ) : order ? (
          <Stack spacing={2}>
            <Alert severity="success">
              Orden {order.id} - {new Date(order.createdAt).toLocaleDateString('es-AR')}
            </Alert>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                  <Typography fontWeight={600}>Direccion</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {order.address.street} {order.address.number}, {order.address.city},{' '}
                    {order.address.province} ({order.address.postalCode})
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                  <Typography fontWeight={600}>Envio</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {order.shippingMethod} -{' '}
                    {order.shippingCost === 0 ? 'Gratis' : formatCurrency(order.shippingCost)}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                  <Typography fontWeight={600}>Items</Typography>
                  <Stack spacing={1} sx={{ mt: 1 }}>
                    {order.items.map((item) => (
                      <Stack key={item.id} direction="row" justifyContent="space-between">
                        <Typography variant="body2">
                          {item.product.name} x {item.quantity}
                        </Typography>
                        <Typography variant="body2">
                          {formatCurrency(item.product.price * item.quantity)}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                </Paper>
              </Grid>
            </Grid>

            <Divider />
            <Stack spacing={1}>
              <Row label="Subtotal" value={formatCurrency(order.subtotal)} />
              <Row
                label="Envio"
                value={order.shippingCost === 0 ? 'Gratis' : formatCurrency(order.shippingCost)}
              />
              <Row label="Total" value={formatCurrency(order.total)} strong />
            </Stack>
          </Stack>
        ) : (
          <Alert severity="info">
            No encontramos el resumen de la orden. Podes volver a la tienda para seguir comprando.
          </Alert>
        )}

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 4 }}>
          <Button variant="contained" component={Link} href={ROUTES.PRODUCTS} fullWidth>
            Seguir comprando
          </Button>
          <Button variant="outlined" component={Link} href={ROUTES.HOME} fullWidth>
            Volver al inicio
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <Stack direction="row" justifyContent="space-between">
      <Typography color="text.secondary" fontWeight={strong ? 700 : 400}>
        {label}
      </Typography>
      <Typography fontWeight={strong ? 700 : 500}>{value}</Typography>
    </Stack>
  );
}
