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
  Typography,
  Chip,
  Button,
} from '@mui/material';
import { adminService } from '@/services/admin/admin.service';
import type { PaymentDTO } from '@/types/admin';
import { EmptyState } from '@/components/admin/EmptyState';

type TabKey = 'all' | 'pending';

export default function AdminPaymentsPage() {
  const [tab, setTab] = useState<TabKey>('all');
  const [payments, setPayments] = useState<PaymentDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

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
    setPayments(result.data ?? []);
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

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
          Pagos
        </Typography>
        {isLoading ? (
          <Typography color="text.secondary">Cargando...</Typography>
        ) : filtered.length === 0 ? (
          <EmptyState title="Sin pagos para mostrar" />
        ) : (
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Orden</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Monto</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Metodo</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{payment.id}</TableCell>
                  <TableCell>{payment.orderId ?? '-'}</TableCell>
                  <TableCell>{payment.userEmail ?? '-'}</TableCell>
                  <TableCell>{payment.amount ?? '-'}</TableCell>
                  <TableCell>
                    <Chip
                      label={payment.status ?? 'sin estado'}
                      color={payment.status === 'paid' ? 'success' : 'warning'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{payment.method ?? '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>
    </Stack>
  );
}
