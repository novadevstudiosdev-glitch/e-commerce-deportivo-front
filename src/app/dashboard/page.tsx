'use client';

import { useEffect, useMemo, useState } from 'react';
import { Box, Card, CardContent, Grid, Stack, Typography } from '@mui/material';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import { KpiCard } from '@/components/dashboard/KpiCard';
import { OrdersTable, DashboardOrder } from '@/components/dashboard/OrdersTable';
import { ordersService, productsService, userService } from '@/services';
import { ApiOrderStatus } from '@/services/orders.service';
import { ProductPublic } from '@/services/products.service';

export default function DashboardPage() {
  const [orders, setOrders] = useState<DashboardOrder[]>([]);
  const [products, setProducts] = useState<ProductPublic[]>([]);
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [me, ordersResponse, productsResponse] = await Promise.all([
          userService.getMe(),
          ordersService.getMyOrders({ page: 1, limit: 6, sort: 'newest' }),
          productsService.getProducts({ limit: 4, sort: 'newest' }),
        ]);

        const profile = me.profile;
        const fullName = `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim();
        setUserName(fullName || me.email);

        const mappedOrders: DashboardOrder[] = ordersResponse.data.map((order) => ({
          id: order.id,
          date: new Date(order.created_at).toLocaleDateString('es-AR'),
          createdAt: order.created_at,
          status: order.status as ApiOrderStatus,
          total: Number(order.total),
        }));
        setOrders(mappedOrders);
        setProducts(productsResponse.data || []);
      } catch (error) {
        console.error('Dashboard error', error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const inTransit = orders.filter((order) =>
      ['enviado', 'en_preparacion'].includes(order.status)
    ).length;
    const recommended = products.length;
    const now = new Date();
    const monthlySpend = orders
      .filter((order) => {
        if (!order.createdAt) return false;
        const date = new Date(order.createdAt);
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      })
      .reduce((sum, order) => sum + order.total, 0);

    return [
      { label: 'Pedidos totales', value: totalOrders },
      { label: 'En camino', value: inTransit },
      { label: 'Recomendados', value: recommended },
      { label: 'Gastos del mes', value: `$${monthlySpend.toFixed(2)}` },
    ];
  }, [orders, products]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Card
        elevation={0}
        sx={{ borderRadius: 2, border: '1px solid #E5E7EB', boxShadow: '0 10px 30px rgba(0,0,0,0.06)' }}
      >
        <CardContent>
          <Typography variant="h5" fontWeight={700}>
            Hola, {userName || 'Bienvenido'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Bienvenida a tu panel. Aqui puedes ver tu actividad reciente.
          </Typography>
        </CardContent>
      </Card>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} lg={3}>
          <KpiCard title={stats[0].label} value={stats[0].value} icon={<ShoppingBagOutlinedIcon />} />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <KpiCard
            title={stats[1].label}
            value={stats[1].value}
            icon={<LocalShippingOutlinedIcon />}
            accentColor="#2E7D32"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <KpiCard
            title={stats[2].label}
            value={stats[2].value}
            icon={<FavoriteBorderOutlinedIcon />}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <KpiCard
            title={stats[3].label}
            value={stats[3].value}
            icon={<PaidOutlinedIcon />}
            accentColor="#1976D2"
          />
        </Grid>
      </Grid>

      <Card
        elevation={0}
        sx={{ borderRadius: 2, border: '1px solid #E5E7EB', boxShadow: '0 10px 30px rgba(0,0,0,0.06)' }}
      >
        <CardContent>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
            <Typography variant="h6" fontWeight={700}>
              Ultimos pedidos
            </Typography>
          </Stack>
          {loading ? (
            <Typography variant="body2" color="text.secondary">
              Cargando pedidos...
            </Typography>
          ) : (
            <OrdersTable orders={orders} />
          )}
        </CardContent>
      </Card>

      <Box>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
          Productos recomendados
        </Typography>
        <Grid container spacing={2}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={3} key={product.id}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: 2,
                  border: '1px solid #E5E7EB',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
                }}
              >
                <Box
                  component="img"
                  src={product.images?.[0] || '/placeholder.png'}
                  alt={product.name}
                  sx={{ width: '100%', height: 140, objectFit: 'cover' }}
                />
                <CardContent>
                  <Typography variant="subtitle2" fontWeight={600}>
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ${Number(product.price).toFixed(2)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
