// ============================================
// ADMIN STOCK ALERTS
// ============================================

'use client';

import { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Paper,
  Stack,
  Typography,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import Link from 'next/link';
import { adminService } from '@/services/admin/admin.service';
import type { StockAlertDTO } from '@/types/admin';
import { EmptyState } from '@/components/admin/EmptyState';

export default function AdminStockAlertsPage() {
  const [alerts, setAlerts] = useState<StockAlertDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAlerts = async () => {
    setIsLoading(true);
    setError(null);
    const result = await adminService.getStockAlerts();
    if (!result.ok) {
      setError(result.error || 'No se pudieron cargar alertas.');
      setIsLoading(false);
      return;
    }
    setAlerts(result.data ?? []);
    setIsLoading(false);
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  return (
    <Stack spacing={2}>
      {error && (
        <Alert severity="error" action={<Button onClick={loadAlerts}>Reintentar</Button>}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
          Alertas de stock
        </Typography>
        {isLoading ? (
          <Typography color="text.secondary">Cargando...</Typography>
        ) : alerts.length === 0 ? (
          <EmptyState title="Sin alertas" />
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Producto</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Umbral</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Accion</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {alerts.map((alertItem) => (
                <TableRow key={alertItem.productId}>
                  <TableCell>{alertItem.productName}</TableCell>
                  <TableCell>{alertItem.stock}</TableCell>
                  <TableCell>{alertItem.threshold ?? '-'}</TableCell>
                  <TableCell>
                    <Chip
                      label={alertItem.stock === 0 ? 'Critico' : 'Bajo'}
                      color={alertItem.stock === 0 ? 'error' : 'warning'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Button size="small" component={Link} href={`/admin/products/${alertItem.productId}`}>
                      Editar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>
    </Stack>
  );
}
