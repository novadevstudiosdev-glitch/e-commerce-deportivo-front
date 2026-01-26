// ============================================
// ADMIN DASHBOARD
// ============================================

'use client';

import { useEffect, useState } from 'react';
import {
  Alert,
  Grid,
  Paper,
  Stack,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  Button,
} from '@mui/material';
import { adminService } from '@/services/admin/admin.service';
import type { AdminSummaryDTO, StockAlertDTO, TopProductDTO } from '@/types/admin';
import { LoadingBlock } from '@/components/admin/LoadingBlock';
import { EmptyState } from '@/components/admin/EmptyState';

export default function AdminDashboardPage() {
  const [summary, setSummary] = useState<AdminSummaryDTO | null>(null);
  const [topProducts, setTopProducts] = useState<TopProductDTO[]>([]);
  const [alerts, setAlerts] = useState<StockAlertDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const normalizeTopProducts = (value: unknown): TopProductDTO[] => {
    if (Array.isArray(value)) {
      return value as TopProductDTO[];
    }
    if (value && typeof value === 'object') {
      const payload = value as { data?: unknown; items?: unknown };
      if (Array.isArray(payload.data)) return payload.data as TopProductDTO[];
      if (Array.isArray(payload.items)) return payload.items as TopProductDTO[];
    }
    return [];
  };

  const normalizeAlerts = (value: unknown): StockAlertDTO[] => {
    if (Array.isArray(value)) {
      return value as StockAlertDTO[];
    }
    if (value && typeof value === 'object') {
      const payload = value as { data?: unknown; items?: unknown };
      if (Array.isArray(payload.data)) return payload.data as StockAlertDTO[];
      if (Array.isArray(payload.items)) return payload.items as StockAlertDTO[];
    }
    return [];
  };

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    const [summaryRes, topRes, alertsRes] = await Promise.all([
      adminService.getSummary(),
      adminService.getTopProducts(),
      adminService.getStockAlerts(),
    ]);

    if (!summaryRes.ok) setError(summaryRes.error || 'No se pudo cargar el resumen.');
    if (!topRes.ok) setError(topRes.error || 'No se pudo cargar top productos.');
    if (!alertsRes.ok) setError(alertsRes.error || 'No se pudo cargar alertas.');

    setSummary(summaryRes.ok ? summaryRes.data ?? null : null);
    setTopProducts(topRes.ok ? normalizeTopProducts(topRes.data) : []);
    setAlerts(alertsRes.ok ? normalizeAlerts(alertsRes.data) : []);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  if (isLoading) {
    return <LoadingBlock rows={5} />;
  }

  if (error) {
    return (
      <Alert severity="error" action={<Button onClick={loadData}>Reintentar</Button>}>
        {error}
      </Alert>
    );
  }

  return (
    <Stack spacing={3}>
      <Grid container spacing={2}>
        {['totalSales', 'totalOrders', 'pendingPayments', 'totalProducts'].map((key) => (
          <Grid item xs={12} sm={6} md={3} key={key}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="caption" color="text.secondary">
                {key}
              </Typography>
              <Typography variant="h5" fontWeight={700}>
                {summary?.[key] ?? 0}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
          Top productos
        </Typography>
        {topProducts.length === 0 ? (
          <EmptyState title="Sin datos de top productos" />
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Producto</TableCell>
                <TableCell>Categoria</TableCell>
                <TableCell>Ventas</TableCell>
                <TableCell>Stock</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {topProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.category || '-'}</TableCell>
                  <TableCell>{product.sales ?? '-'}</TableCell>
                  <TableCell>{product.stock ?? '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
          Alertas de stock
        </Typography>
        {alerts.length === 0 ? (
          <EmptyState title="Sin alertas de stock" />
        ) : (
          <Stack spacing={1}>
            {alerts.map((alertItem) => (
              <Paper key={alertItem.productId} variant="outlined" sx={{ p: 2 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <div>
                    <Typography fontWeight={600}>{alertItem.productName}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Stock actual: {alertItem.stock}
                    </Typography>
                  </div>
                  <Chip
                    color={alertItem.stock === 0 ? 'error' : 'warning'}
                    label={alertItem.stock === 0 ? 'Critico' : 'Bajo'}
                  />
                </Stack>
              </Paper>
            ))}
          </Stack>
        )}
      </Paper>
    </Stack>
  );
}
