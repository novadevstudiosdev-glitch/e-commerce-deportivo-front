'use client';

import { useEffect, useMemo, useState } from 'react';
import { Box, Card, CardContent, Grid, List, ListItem, ListItemText, Stack, Typography, Chip } from '@mui/material';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';
import StarOutlineOutlinedIcon from '@mui/icons-material/StarOutlineOutlined';
import { KpiCard } from '@/components/dashboard/KpiCard';
import { SalesChart } from '@/components/dashboard/SalesChart';
import { productsService, ProductPublic } from '@/services/products.service';

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<ProductPublic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await productsService.getProducts({ limit: 50, sort: 'newest' });
        setProducts(response.data || []);
      } catch (error) {
        console.error('Admin dashboard error', error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const lowStock = useMemo(() => {
    return products.filter((product) => product.stock <= 5);
  }, [products]);

  const featured = useMemo(() => {
    return products.filter((product) => product.is_featured);
  }, [products]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Card elevation={0} sx={{ borderRadius: 2, border: '1px solid #E5E7EB', boxShadow: '0 10px 30px rgba(0,0,0,0.06)' }}>
        <CardContent>
          <Typography variant="h5" fontWeight={700}>
            Panel de administracion
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Resumen general de ventas y operaciones.
          </Typography>
        </CardContent>
      </Card>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} lg={3}>
          <KpiCard title="Ventas del mes" value="0" icon={<TrendingUpOutlinedIcon />} />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <KpiCard title="Ordenes" value="0" icon={<LocalMallOutlinedIcon />} accentColor="#2E7D32" />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <KpiCard title="Stock bajo" value={lowStock.length} icon={<Inventory2OutlinedIcon />} accentColor="#F59E0B" />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <KpiCard title="Productos estrella" value={featured.length} icon={<StarOutlineOutlinedIcon />} accentColor="#1976D2" />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} lg={8}>
          <Card elevation={0} sx={{ borderRadius: 2, border: '1px solid #E5E7EB', boxShadow: '0 10px 30px rgba(0,0,0,0.06)' }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                Ventas
              </Typography>
              <SalesChart data={[]} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card elevation={0} sx={{ borderRadius: 2, border: '1px solid #E5E7EB', boxShadow: '0 10px 30px rgba(0,0,0,0.06)' }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                Stock bajo
              </Typography>
              {loading ? (
                <Typography variant="body2" color="text.secondary">Cargando productos...</Typography>
              ) : (
                <List sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {lowStock.map((item) => (
                    <ListItem key={item.id} sx={{ px: 0 }}>
                      <ListItemText primary={item.name} secondary={`Stock: ${item.stock}`} />
                      <Chip label="Bajo" color="warning" size="small" />
                    </ListItem>
                  ))}
                  {lowStock.length === 0 && (
                    <Typography variant="body2" color="text.secondary">
                      No hay productos con stock bajo.
                    </Typography>
                  )}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card elevation={0} sx={{ borderRadius: 2, border: '1px solid #E5E7EB', boxShadow: '0 10px 30px rgba(0,0,0,0.06)' }}>
        <CardContent>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
            Ultimas ventas
          </Typography>
          <Stack spacing={1}>
            <Typography variant="body2" color="text.secondary">
              No hay datos de ventas disponibles.
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
