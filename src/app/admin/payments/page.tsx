// ============================================
// ADMIN PAYMENTS
// ============================================

'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Paper,
  Stack,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Button,
} from '@mui/material';
import { adminService } from '@/services/admin/admin.service';
import type { PaymentDTO } from '@/types/admin';
import { DataTable } from '@/components/admin/DataTable';
import { StatusChip } from '@/components/admin/StatusChip';
import { formatCurrency } from '@/lib/utils';

type TabKey = 'all' | 'pending';

export default function AdminPaymentsPage() {
  const [tab, setTab] = useState<TabKey>('all');
  const [payments, setPayments] = useState<PaymentDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const parseNumber = (value: unknown): number | undefined => {
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    if (typeof value === 'string') {
      const parsed = Number(value.replace(',', '.'));
      return Number.isFinite(parsed) ? parsed : undefined;
    }
    return undefined;
  };

  const normalizePayments = (value: unknown): PaymentDTO[] => {
    let items: unknown[] = [];
    if (Array.isArray(value)) {
      items = value;
    } else if (value && typeof value === 'object') {
      const payload = value as { data?: unknown; items?: unknown };
      if (Array.isArray(payload.data)) items = payload.data;
      if (Array.isArray(payload.items)) items = payload.items;
    }

    return items.map((raw) => {
      const item = raw as Record<string, unknown>;
      const order = item.order as Record<string, unknown> | undefined;
      const status = String(item.status ?? '').toLowerCase();
      const normalizedStatus =
        status === 'aprobado' || status === 'rechazado' || status === 'reembolsado'
          ? status
          : status === 'pendiente'
            ? 'pendiente'
            : undefined;

      return {
        id: String(item.id ?? ''),
        orderId: (item.orderId ?? item.order_id ?? order?.id) as string | undefined,
        userEmail: (item.userEmail ?? item.user_email) as string | undefined,
        amount: parseNumber(item.amount ?? item.total ?? order?.total),
        status: normalizedStatus,
        method: (item.method ?? item.provider) as string | undefined,
        createdAt: (item.createdAt ?? item.created_at) as string | undefined,
      } satisfies PaymentDTO;
    });
  };

  const loadPayments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const result =
      tab === 'pending' ? await adminService.getPendingPayments() : await adminService.getPayments();
    if (!result.ok) {
      setError(result.error || 'No se pudieron cargar pagos.');
      setIsLoading(false);
      return;
    }
    setPayments(normalizePayments(result.data));
    setIsLoading(false);
  }, [tab]);

  useEffect(() => {
    void loadPayments();
  }, [loadPayments]);

  const filtered = useMemo(() => {
    if (!search.trim()) return payments;
    const query = search.toLowerCase();
    return payments.filter(
      (item) =>
        item.id.toLowerCase().includes(query) ||
        item.orderId?.toLowerCase().includes(query) ||
        item.userEmail?.toLowerCase().includes(query)
    );
  }, [payments, search]);

  return (
    <Stack spacing={2}>
      <Paper sx={{ p: 2 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
          <Tabs value={tab} onChange={(_, value) => setTab(value)}>
            <Tab label="Todos" value="all" />
            <Tab label="Pendientes" value="pending" />
          </Tabs>
          <Box sx={{ flex: 1 }} />
          <TextField
            size="small"
            placeholder="Buscar por ID o email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ minWidth: 280 }}
          />
        </Stack>
      </Paper>

      {error && (
        <Alert severity="error" action={<Button onClick={loadPayments}>Reintentar</Button>}>
          {error}
        </Alert>
      )}

      <DataTable
        title="Pagos"
        isLoading={isLoading}
        isEmpty={!isLoading && filtered.length === 0}
        emptyTitle="Sin pagos para mostrar"
        emptyDescription="Cuando se registren pagos, apareceran aqui."
      >
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Orden</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Monto</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Metodo</TableCell>
              <TableCell>Fecha</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{payment.id}</TableCell>
                <TableCell>{payment.orderId ?? '-'}</TableCell>
                <TableCell>{payment.userEmail ?? '-'}</TableCell>
                <TableCell>
                  {typeof payment.amount === 'number'
                    ? formatCurrency(payment.amount)
                    : '-'}
                </TableCell>
                <TableCell>
                  <StatusChip
                    label={payment.status ?? 'sin estado'}
                    color={
                      payment.status === 'aprobado'
                        ? 'success'
                        : payment.status === 'rechazado'
                          ? 'error'
                          : payment.status === 'reembolsado'
                            ? 'info'
                            : 'warning'
                    }
                  />
                </TableCell>
                <TableCell>{payment.method ?? '-'}</TableCell>
                <TableCell>
                  {payment.createdAt
                    ? new Date(payment.createdAt).toLocaleDateString('es-AR')
                    : '-'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DataTable>
    </Stack>
  );
}
