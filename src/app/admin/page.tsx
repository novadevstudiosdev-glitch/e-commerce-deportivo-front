// ============================================
// ADMIN DASHBOARD
// ============================================

'use client';

import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
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
  Divider,
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
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Stack spacing={3}>
            <Paper sx={{ p: 3 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" fontWeight={700}>
                  Overview
                </Typography>
                <Button variant="outlined" size="small">
                  All Time
                </Button>
              </Stack>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {[
                  { label: 'Clientes', value: summary?.totalCustomers ?? 0 },
                  { label: 'Ingresos', value: summary?.totalSales ?? 0 },
                  { label: 'Ordenes', value: summary?.totalOrders ?? 0 },
                  { label: 'Pagos pendientes', value: summary?.pendingPayments ?? 0 },
                ].map((item) => (
                  <Grid item xs={12} sm={6} key={item.label}>
                    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                      <Typography variant="caption" color="text.secondary">
                        {item.label}
                      </Typography>
                      <Typography variant="h5" fontWeight={700}>
                        {item.value}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Paper>

            <Paper sx={{ p: 3 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" fontWeight={700}>
                  Total income
                </Typography>
                <Button variant="outlined" size="small">
                  All Time
                </Button>
              </Stack>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 180 }}>
                {[40, 80, 55, 20, 60, 35, 90, 70, 30, 65, 45, 85].map((value, index) => (
                  <Box
                    key={`bar-${index}`}
                    sx={{
                      width: '100%',
                      maxWidth: 32,
                      height: `${value}%`,
                      bgcolor: index === 6 || index === 11 ? '#2563eb' : '#93c5fd',
                      borderRadius: 2,
                    }}
                  />
                ))}
              </Box>
            </Paper>
          </Stack>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Stack spacing={3}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                Popular products
              </Typography>
              {topProducts.length === 0 ? (
                <EmptyState title="Sin datos de top productos" />
              ) : (
                <Stack spacing={2}>
                  {topProducts.map((product) => (
                    <Stack key={product.id} direction="row" spacing={2} alignItems="center">
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          bgcolor: '#F6F7FB',
                          borderRadius: 2,
                        }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography fontWeight={600}>{product.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {product.category || 'Sin categoria'}
                        </Typography>
                      </Box>
                      <Typography fontWeight={700}>
                        {product.revenue ?? product.sales ?? '-'}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              )}
            </Paper>

            <Paper sx={{ p: 3 }}>
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
        </Grid>
      </Grid>
    </Stack>
  );
}
