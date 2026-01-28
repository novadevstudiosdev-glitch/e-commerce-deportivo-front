// ============================================
// ADMIN STOCK ALERTS
// ============================================

'use client';

import { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import Link from 'next/link';
import { adminService } from '@/services/admin/admin.service';
import type { StockAlertDTO } from '@/types/admin';
import { DataTable } from '@/components/admin/DataTable';

export default function AdminStockAlertsPage() {
  const [alerts, setAlerts] = useState<StockAlertDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const loadAlerts = async () => {
    setIsLoading(true);
    setError(null);
    const result = await adminService.getStockAlerts();
    if (!result.ok) {
      setError(result.error || 'No se pudieron cargar alertas.');
      setIsLoading(false);
      return;
    }
    setAlerts(normalizeAlerts(result.data));
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

      <DataTable
        title="Alertas de stock"
        isLoading={isLoading}
        isEmpty={!isLoading && alerts.length === 0}
        emptyTitle="Sin alertas"
        emptyDescription="Los productos con bajo stock apareceran aqui."
      >
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
                  <Button
                    size="small"
                    component={Link}
                    href={`/admin/products/${alertItem.productId}`}
                  >
                    Editar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DataTable>
    </Stack>
  );
}
