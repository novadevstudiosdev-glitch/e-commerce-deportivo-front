'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { ordersService, OrdersListItem } from '@/services/orders.service';
import { ApiOrderStatus } from '@/services/orders.service';

const STATUS_OPTIONS: Array<{ label: string; value: ApiOrderStatus | 'all' }> = [
  { label: 'Todos', value: 'all' },
  { label: 'Pagado', value: 'pagado' },
  { label: 'En preparacion', value: 'en_preparacion' },
  { label: 'Enviado', value: 'enviado' },
  { label: 'Entregado', value: 'entregado' },
  { label: 'Pendiente', value: 'pendiente_pago' },
];

const STATUS_LABELS: Record<ApiOrderStatus, { label: string; color: 'success' | 'warning' | 'info' | 'default' }> = {
  pagado: { label: 'Pagado', color: 'success' },
  en_preparacion: { label: 'En preparacion', color: 'warning' },
  enviado: { label: 'Enviado', color: 'info' },
  entregado: { label: 'Entregado', color: 'success' },
  pendiente_pago: { label: 'Pendiente', color: 'default' },
};

export default function OrdersPage() {
  const [status, setStatus] = useState<ApiOrderStatus | 'all'>('all');
  const [orders, setOrders] = useState<OrdersListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const response = await ordersService.getMyOrders({
          page: 1,
          limit: 20,
          sort: 'newest',
          orderStatus: status === 'all' ? undefined : status,
        });
        setOrders(response.data || []);
      } catch (error) {
        console.error('Error loading orders', error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [status]);

  const formatted = useMemo(() => {
    return orders.map((order) => ({
      ...order,
      createdDate: new Date(order.created_at).toLocaleDateString('es-AR'),
    }));
  }, [orders]);

  return (
    <Card elevation={0} sx={{ borderRadius: 2, border: '1px solid #E5E7EB', boxShadow: '0 10px 30px rgba(0,0,0,0.06)' }}>
      <CardContent>
        <Typography variant="h6" fontWeight={700}>
          Mis pedidos
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Filtra tus pedidos por estado.
        </Typography>

        <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: 'wrap' }}>
          {STATUS_OPTIONS.map((option) => (
            <Chip
              key={option.value}
              label={option.label}
              onClick={() => setStatus(option.value)}
              color={status === option.value ? 'primary' : 'default'}
              variant={status === option.value ? 'filled' : 'outlined'}
            />
          ))}
        </Stack>

        {loading ? (
          <Typography variant="body2" color="text.secondary">
            Cargando pedidos...
          </Typography>
        ) : (
          <Box sx={{ overflowX: 'auto' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {formatted.map((order) => {
                  const statusInfo = STATUS_LABELS[order.status] || STATUS_LABELS.pendiente_pago;
                  return (
                    <TableRow key={order.id} hover>
                      <TableCell>{order.id}</TableCell>
                      <TableCell>{order.createdDate}</TableCell>
                      <TableCell>
                        <Chip size="small" label={statusInfo.label} color={statusInfo.color} />
                      </TableCell>
                      <TableCell>${Number(order.total).toFixed(2)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            {formatted.length === 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
                No hay pedidos para mostrar.
              </Typography>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
