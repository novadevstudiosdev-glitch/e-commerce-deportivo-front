'use client';

import {
  Box,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Button,
} from '@mui/material';
import Link from 'next/link';
import { ApiOrderStatus } from '@/services/orders.service';

export interface DashboardOrder {
  id: string;
  date: string;
  status: ApiOrderStatus;
  total: number;
  createdAt?: string;
}

const STATUS_MAP: Record<
  ApiOrderStatus,
  { label: string; color: 'success' | 'warning' | 'info' | 'default' }
> = {
  pagado: { label: 'Pagado', color: 'success' },
  en_preparacion: { label: 'En preparacion', color: 'warning' },
  enviado: { label: 'Enviado', color: 'info' },
  entregado: { label: 'Entregado', color: 'success' },
  pendiente_pago: { label: 'Pendiente', color: 'default' },
};

export function OrdersTable({ orders }: { orders: DashboardOrder[] }) {
  return (
    <Box sx={{ overflowX: 'auto' }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Fecha</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Total</TableCell>
            <TableCell align="right">Accion</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => {
            const status = STATUS_MAP[order.status] || STATUS_MAP.pendiente_pago;
            return (
              <TableRow key={order.id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight={600}>
                    {order.id}
                  </Typography>
                </TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell>
                  <Chip label={status.label} color={status.color} size="small" sx={{ fontWeight: 600 }} />
                </TableCell>
                <TableCell>${order.total.toFixed(2)}</TableCell>
                <TableCell align="right">
                  <Button
                    component={Link}
                    href="/dashboard/orders"
                    size="small"
                    variant="text"
                    sx={{ textTransform: 'none', fontWeight: 600 }}
                  >
                    Ver
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {orders.length === 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
          No hay pedidos recientes.
        </Typography>
      )}
    </Box>
  );
}
