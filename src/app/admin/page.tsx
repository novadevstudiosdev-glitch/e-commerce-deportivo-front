// ============================================
// ADMIN DASHBOARD
// ============================================

'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Grid,
  Stack,
  Typography,
  Chip,
  Button,
  Divider,
  Paper,
  Skeleton,
} from '@mui/material';
import { adminService } from '@/services/admin/admin.service';
import type { AdminSummaryDTO, StockAlertDTO, TopProductDTO } from '@/types/admin';
import { LoadingBlock } from '@/components/admin/LoadingBlock';
import { StatCard } from '@/components/admin/StatCard';
import { DataTable } from '@/components/admin/DataTable';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import { formatCurrency } from '@/lib/utils';

export default function AdminDashboardPage() {
  const [summary, setSummary] = useState<AdminSummaryDTO | null>(null);
  const [topProducts, setTopProducts] = useState<TopProductDTO[]>([]);
  const [alerts, setAlerts] = useState<StockAlertDTO[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
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

  const normalizeArrayLength = (value: unknown): number => {
    if (Array.isArray(value)) return value.length;
    if (value && typeof value === 'object') {
      const payload = value as { data?: unknown; items?: unknown };
      if (Array.isArray(payload.data)) return payload.data.length;
      if (Array.isArray(payload.items)) return payload.items.length;
    }
    return 0;
  };

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    const [summaryRes, topRes, alertsRes, pendingRes] = await Promise.all([
      adminService.getSummary(),
      adminService.getTopProducts(),
      adminService.getStockAlerts(),
      adminService.getPendingPayments(),
    ]);

    if (!summaryRes.ok) setError(summaryRes.error || 'No se pudo cargar el resumen.');
    if (!topRes.ok) setError(topRes.error || 'No se pudo cargar top productos.');
    if (!alertsRes.ok) setError(alertsRes.error || 'No se pudo cargar alertas.');

    setSummary(summaryRes.ok ? summaryRes.data ?? null : null);
    setTopProducts(topRes.ok ? normalizeTopProducts(topRes.data) : []);
    setAlerts(alertsRes.ok ? normalizeAlerts(alertsRes.data) : []);
    if (pendingRes.ok) {
      setPendingCount(normalizeArrayLength(pendingRes.data));
    } else {
      setPendingCount(0);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const metrics = useMemo(() => {
    const totalOrders = Number(summary?.totalOrders ?? summary?.orders ?? 0);
    const totalSales = Number(summary?.totalSales ?? summary?.revenue ?? 0);
    const pendingPayments = pendingCount || Number(summary?.pendingPayments ?? 0);
    const stockAlerts = alerts.length;
    return { totalOrders, totalSales, pendingPayments, stockAlerts };
  }, [alerts.length, pendingCount, summary]);

  const currency = summary?.currency ? String(summary.currency) : 'ARS';

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
      <Paper sx={{ p: 3 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
          <Box>
            <Typography variant="h6" fontWeight={700}>
              Overview
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Resumen general del negocio
            </Typography>
          </Box>
          <Box sx={{ flex: 1 }} />
          <Chip label="ALL TIME" color="primary" variant="outlined" />
        </Stack>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} lg={3}>
              <StatCard
                title="Ordenes"
                value={metrics.totalOrders}
                subtitle="Total de ordenes"
                chipLabel="ALL TIME"
                icon={<ShoppingCartOutlinedIcon fontSize="small" />}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <StatCard
                title="Ingresos"
                value={formatCurrency(metrics.totalSales)}
                subtitle="Ingresos acumulados"
                chipLabel="ALL TIME"
                icon={<TrendingUpOutlinedIcon fontSize="small" />}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <StatCard
                title="Pagos pendientes"
                value={metrics.pendingPayments}
                subtitle="Pagos en revision"
                chipLabel="ALL TIME"
                icon={<PaymentsOutlinedIcon fontSize="small" />}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <StatCard
                title="Alertas de stock"
                value={alerts.length}
                subtitle="Productos con bajo stock"
                chipLabel="ALL TIME"
                icon={<WarningAmberOutlinedIcon fontSize="small" />}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} lg={8}>
          <DataTable
            title="Popular products"
            isLoading={isLoading}
            isEmpty={topProducts.length === 0}
            emptyTitle="Sin datos de top productos"
            emptyDescription="Cuando haya ventas, veras los mas vendidos aqui."
          >
            {topProducts.length === 0 ? null : (
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
                      {typeof product.revenue === 'number'
                        ? formatCurrency(product.revenue, currency)
                        : typeof product.revenue === 'string'
                          ? formatCurrency(Number(product.revenue), currency)
                          : product.sales ?? '-'}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            )}
          </DataTable>
        </Grid>

        <Grid item xs={12} lg={4}>
          <DataTable
            title="Alertas de stock"
            isLoading={isLoading}
            isEmpty={alerts.length === 0}
            emptyTitle="Sin alertas de stock"
            emptyDescription="No hay productos con stock critico."
          >
            {alerts.length === 0 ? null : (
              <Stack spacing={1}>
                {alerts.map((alertItem) => (
                  <Box key={alertItem.productId}>
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
                    <Divider sx={{ my: 1.5 }} />
                  </Box>
                ))}
              </Stack>
            )}
          </DataTable>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
              <Box>
                <Typography variant="h6" fontWeight={700}>
                  Total income
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Sin datos todavía
                </Typography>
              </Box>
              <Box sx={{ flex: 1 }} />
              <Chip label="ALL TIME" variant="outlined" />
            </Stack>
            <Box sx={{ mt: 3 }}>
              <Skeleton variant="rounded" height={220} />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Stack>
  );
}
