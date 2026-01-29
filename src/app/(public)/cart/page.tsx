// ============================================
// CART PAGE - PRO UI
// ============================================

'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Alert,
  Button,
  Chip,
  Container,
  Divider,
  Grid,
  IconButton,
  Paper,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { ROUTES } from '@/lib/routes';
import { useCart } from '@/hooks';
import { CouponBox, WelcomeCouponBanner } from '@/components';
import { formatCurrency } from '@/lib/format';

type ShippingOption = {
  id: 'free' | 'express';
  label: string;
  cost: number;
  description: string;
};

const SHIPPING_OPTIONS: ShippingOption[] = [
  { id: 'free', label: 'Gratis', cost: 0, description: 'Retiro o envio estandar' },
  { id: 'express', label: 'Express', cost: 1500, description: 'Entrega en 24-48 hs' },
];

const FREE_SHIPPING_THRESHOLD = 30000;

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, totalItems, subtotal, discountAmount } =
    useCart();
  const [isLoading, setIsLoading] = useState(true);
  const [shipping, setShipping] = useState<ShippingOption>(SHIPPING_OPTIONS[0]);

  useEffect(() => {
    const id = setTimeout(() => setIsLoading(false), 250);
    return () => clearTimeout(id);
  }, []);

  const rawSubtotal = useMemo(() => {
    if (typeof subtotal === 'number') {
      return subtotal;
    }
    return items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  }, [items, subtotal]);

  const total = Math.max(0, rawSubtotal - discountAmount) + shipping.cost;
  const missingForFree = Math.max(0, FREE_SHIPPING_THRESHOLD - rawSubtotal);
  const hasItems = items.length > 0;

  if (!isLoading && !hasItems) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Stack spacing={2} alignItems="center">
            <ShoppingCartOutlinedIcon fontSize="large" color="action" />
            <Typography variant="h5" fontWeight={700}>
              Carrito vacio
            </Typography>
            <Typography color="text.secondary">
              Todavia no agregaste productos. Explora el catalogo y elegi tus favoritos.
            </Typography>
            <Button variant="contained" component={Link} href={ROUTES.PRODUCTS}>
              Ver productos
            </Button>
          </Stack>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={2}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', md: 'center' }}
        sx={{ mb: 4 }}
      >
        <BoxTitle
          title="Carrito de compras"
          subtitle={`${totalItems} producto${totalItems !== 1 ? 's' : ''}`}
        />
        <Stack direction="row" spacing={2} flexWrap="wrap">
          <Button variant="outlined" onClick={clearCart} disabled={!hasItems}>
            Vaciar carrito
          </Button>
          <Button variant="outlined" component={Link} href={ROUTES.PRODUCTS}>
            Seguir comprando
          </Button>
        </Stack>
      </Stack>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <WelcomeCouponBanner
            subtotal={rawSubtotal}
            productIds={items.map((item) => item.product.id)}
          />
          <Stack spacing={2}>
            {isLoading
              ? Array.from({ length: 3 }).map((_, index) => (
                  <Paper key={index} sx={{ p: 3 }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={3}>
                        <Skeleton variant="rounded" height={120} />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Skeleton width="60%" />
                        <Skeleton width="40%" />
                        <Skeleton width="30%" />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <Skeleton width="80%" />
                      </Grid>
                    </Grid>
                  </Paper>
                ))
              : items.map((item) => {
                  const imageUrl = item.product.images?.[0] || '/placeholder.png';
                  const lineTotal = item.product.price * item.quantity;
                  const stock = item.product.stock ?? 0;
                  const hasOffer =
                    typeof item.product.originalPrice === 'number' &&
                    item.product.originalPrice > item.product.price;

                  return (
                    <Paper key={item.id} sx={{ p: 3 }}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={3}>
                          <Paper
                            variant="outlined"
                            sx={{
                              p: 1,
                              bgcolor: '#F6F7FB',
                              borderRadius: 2,
                            }}
                          >
                            <Image
                              src={imageUrl}
                              alt={item.product.name}
                              width={400}
                              height={400}
                              sizes="(max-width: 600px) 100vw, 200px"
                              unoptimized
                              style={{ width: '100%', height: 120, objectFit: 'contain' }}
                            />
                          </Paper>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Stack spacing={1}>
                            <Stack direction="row" spacing={1} flexWrap="wrap">
                              {item.product.category?.name && (
                                <Chip size="small" label={item.product.category.name} />
                              )}
                              {hasOffer && <Chip size="small" color="primary" label="Oferta" />}
                              {stock > 0 && (
                                <Chip
                                  size="small"
                                  color={stock < 5 ? 'warning' : 'success'}
                                  label={stock < 5 ? 'Ultimas unidades' : 'En stock'}
                                />
                              )}
                            </Stack>
                            <Typography variant="h6" fontWeight={700}>
                              {item.product.name}
                            </Typography>
                            <Typography color="text.secondary" variant="body2">
                              Precio unitario: {formatCurrency(item.product.price)}
                            </Typography>
                            <Typography color="text.secondary" variant="body2">
                              Total item: {formatCurrency(lineTotal)}
                            </Typography>
                          </Stack>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <Stack spacing={1} alignItems={{ xs: 'flex-start', sm: 'flex-end' }}>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <IconButton
                                size="small"
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                              >
                                <RemoveIcon fontSize="small" />
                              </IconButton>
                              <TextField
                                value={item.quantity}
                                onChange={(event) => {
                                  const value = Number(event.target.value);
                                  if (!Number.isNaN(value)) {
                                    updateQuantity(item.product.id, value);
                                  }
                                }}
                                inputProps={{ min: 1, style: { textAlign: 'center' } }}
                                size="small"
                                sx={{ width: 72 }}
                              />
                              <IconButton
                                size="small"
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              >
                                <AddIcon fontSize="small" />
                              </IconButton>
                            </Stack>
                            <Button
                              color="error"
                              startIcon={<DeleteOutlineIcon />}
                              onClick={() => removeItem(item.product.id)}
                              size="small"
                            >
                              Eliminar
                            </Button>
                          </Stack>
                        </Grid>
                      </Grid>
                    </Paper>
                  );
                })}
          </Stack>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={700}>
              Resumen del carrito
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Stack spacing={1.5}>
              <Row label="Subtotal" value={formatCurrency(rawSubtotal)} />
              {discountAmount > 0 && (
                <Row label="Descuento" value={`-${formatCurrency(discountAmount)}`} />
              )}
              <Row label="Envio" value={shipping.cost === 0 ? 'Gratis' : formatCurrency(shipping.cost)} />
              <Row label="Impuestos" value={formatCurrency(0)} />
              <Divider />
              <Row label="Total" value={formatCurrency(total)} strong />
            </Stack>

            <CouponBox
              subtotal={rawSubtotal}
              productIds={items.map((item) => item.product.id)}
            />

            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" fontWeight={600}>
              Opciones de envio
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap' }}>
              {SHIPPING_OPTIONS.map((option) => (
                <Chip
                  key={option.id}
                  label={`${option.label} ${option.cost ? `(${formatCurrency(option.cost)})` : ''}`}
                  color={shipping.id === option.id ? 'primary' : 'default'}
                  onClick={() => setShipping(option)}
                  variant={shipping.id === option.id ? 'filled' : 'outlined'}
                />
              ))}
            </Stack>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              {shipping.description}
            </Typography>

            {missingForFree > 0 ? (
              <Alert severity="info" sx={{ mt: 2 }}>
                Te faltan {formatCurrency(missingForFree)} para envio gratis.
              </Alert>
            ) : (
              <Alert severity="success" sx={{ mt: 2 }}>
                Envio gratis aplicado.
              </Alert>
            )}

            <Button
              fullWidth
              variant="contained"
              component={Link}
              href={ROUTES.CHECKOUT}
              disabled={!hasItems}
              sx={{ mt: 2 }}
            >
              Ir al checkout
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

function BoxTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div>
      <Typography variant="h4" fontWeight={700}>
        {title}
      </Typography>
      <Typography color="text.secondary">{subtitle}</Typography>
    </div>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <Stack direction="row" justifyContent="space-between">
      <Typography color="text.secondary" fontWeight={strong ? 700 : 400}>
        {label}
      </Typography>
      <Typography fontWeight={strong ? 700 : 500}>{value}</Typography>
    </Stack>
  );
}
