// ============================================
// CHECKOUT PAGE - MULTI STEP
// ============================================

'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Alert,
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  Step,
  StepLabel,
  Stepper,
  Typography,
  Skeleton,
  Checkbox,
  Stack,
} from '@mui/material';
import { useCart, useAuth } from '@/hooks';
import { AUTH_TOKEN_KEY } from '@/lib/constants';
import { RequireAuth } from '@/utils/requireAuth';
import { formatCurrency } from '@/lib/format';
import { ROUTES } from '@/lib/routes';
import { paymentsService } from '@/services/payments.service';
import type { CheckoutForm, CheckoutOrderSummary, ShippingMethod } from '@/types/checkout';

const STORAGE_KEY = 'checkout-form';
const ORDER_KEY = 'checkout-last-order';

const steps = ['Datos', 'Envio', 'Pago'];

const shippingCosts: Record<ShippingMethod, number> = {
  pickup: 0,
  standard: 1200,
  express: 2500,
};

const shippingLabels: Record<ShippingMethod, string> = {
  pickup: 'Retiro',
  standard: 'Standard',
  express: 'Express',
};

const initialForm: CheckoutForm = {
  contact: {
    firstName: '',
    lastName: '',
    dni: '',
    email: '',
    phone: '',
  },
  address: {
    street: '',
    number: '',
    floor: '',
    city: '',
    province: '',
    postalCode: '',
  },
  shippingMethod: 'pickup',
  payment: {
    cardName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    acceptTerms: false,
  },
};

type OrderFromCartResponse = {
  orderId: string;
  status?: string;
  total?: string;
  discount_total?: string;
};

export default function CheckoutPage() {
  const { items, subtotal, discountAmount } = useCart();
  const { session } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [form, setForm] = useState<CheckoutForm>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPaying, setIsPaying] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setIsLoading(false), 250);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as CheckoutForm;
        setForm(parsed);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
  }, [form]);

  const computedSubtotal = useMemo(() => {
    if (typeof subtotal === 'number') return subtotal;
    return items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  }, [items, subtotal]);

  const shippingCost = shippingCosts[form.shippingMethod];
  const total = Math.max(0, computedSubtotal - discountAmount) + shippingCost;

  const handleFieldChange = (path: string, value: string | boolean) => {
    setForm((prev) => {
      if (path === 'shippingMethod' && typeof value === 'string') {
        return {
          ...prev,
          shippingMethod: value as ShippingMethod,
        };
      }
      const parts = path.split('.');
      if (parts.length === 2) {
        const [group, key] = parts;
        if (group === 'payment') {
          return {
            ...prev,
            payment: {
              ...prev.payment,
              [key]: value,
            },
          } as CheckoutForm;
        }
      }
      return prev;
    });
  };

  const validateStep = (stepIndex: number) => {
    const nextErrors: Record<string, string> = {};

    if (stepIndex === 1) {
      if (!form.shippingMethod) nextErrors['shippingMethod'] = 'Selecciona un envio';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleNext = () => {
    setSubmitError(null);
    if (validateStep(activeStep)) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setSubmitError(null);
    setActiveStep((prev) => prev - 1);
  };

  const handlePayment = async () => {
    setSubmitError(null);
    if (!form.payment.acceptTerms) {
      setErrors({ payment: 'Debes aceptar los terminos' });
      return;
    }
    if (items.length === 0) {
      setSubmitError('Tu carrito esta vacio.');
      return;
    }

    setIsPaying(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem(AUTH_TOKEN_KEY) : null;
      if (!token) {
        throw new Error('No token');
      }

      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
          })),
        }),
      });

      if (!orderResponse.ok) {
        const errorBody = await orderResponse.json().catch(() => null);
        const message = (errorBody && (errorBody.error || errorBody.message))
          ? `${errorBody.error || errorBody.message}`
          : 'No se pudo crear la orden';
        throw new Error(message);
      }

      const orderData = (await orderResponse.json()) as OrderFromCartResponse & { id?: string };
      const orderId = orderData?.orderId || orderData?.id;
      if (!orderId) {
        setSubmitError('No se pudo crear la orden.');
        console.warn('[MP] orderId missing', orderData);
        return;
      }

      const prefResponse = await paymentsService.createMercadoPagoPreference(orderId);

      const prefData = prefResponse.data ?? {};
      const sandboxUrl = prefData.sandboxInitPoint ?? prefData.sandbox_init_point;
      const prodUrl = prefData.initPoint ?? prefData.init_point;
      const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
      const isLocalhost =
        hostname === 'localhost' || hostname === '127.0.0.1' || hostname.endsWith('.local');
      const redirectUrl = isLocalhost ? (sandboxUrl || prodUrl) : (prodUrl || sandboxUrl);

      console.info('[MP] orderId', orderId);
      console.info('[MP] hostname', hostname || 'unknown');
      console.info('[MP] redirectUrl', redirectUrl || 'missing');

      if (!redirectUrl) {
        setSubmitError('No se pudo iniciar el pago (URL de Mercado Pago faltante).');
        return;
      }

      const order: CheckoutOrderSummary = {
        id: orderId,
        createdAt: new Date().toISOString(),
        items,
        subtotal: computedSubtotal,
        shippingCost,
        total,
        shippingMethod: form.shippingMethod,
        contact: form.contact,
        address: form.address,
      };

      localStorage.setItem(ORDER_KEY, JSON.stringify(order));
      window.location.href = redirectUrl;
    } catch (error) {
      setSubmitError('No se pudo iniciar el pago. Intenta nuevamente.');
    } finally {
      setIsPaying(false);
    }
  };

  if (!isLoading && items.length === 0) {
    return (
      <RequireAuth>
        <Container maxWidth="md" sx={{ py: 8 }}>
          <Alert severity="info" sx={{ mb: 3 }}>
            No hay productos en tu carrito.
          </Alert>
          <Button variant="contained" component={Link} href={ROUTES.PRODUCTS}>
            Volver a productos
          </Button>
        </Container>
      </RequireAuth>
    );
  }

  const profile = session?.user;

  return (
    <RequireAuth>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>
          Checkout
        </Typography>

        <Paper sx={{ p: { xs: 2, md: 3 }, mb: 3 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Paper>

        {submitError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {submitError}
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <Paper sx={{ p: { xs: 2, md: 3 } }}>
              {isLoading ? (
                <Stack spacing={2}>
                  <Skeleton height={36} />
                  <Skeleton height={36} />
                  <Skeleton height={36} />
                </Stack>
              ) : (
                <>
                  {activeStep === 0 && (
                    <Stack spacing={2}>
                      <Typography variant="h6" fontWeight={700}>
                        Datos del cliente
                      </Typography>
                      <Alert severity="info">
                        Tus datos se completan desde tu perfil. No se solicitan en el checkout.
                      </Alert>
                      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                        <Typography fontWeight={600}>Perfil</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {profile
                            ? `${profile.firstName} ${profile.lastName} - ${profile.email}`
                            : 'Completa tus datos en el dashboard.'}
                        </Typography>
                        <Button
                          variant="outlined"
                          component={Link}
                          href={ROUTES.ACCOUNT_PROFILE}
                          sx={{ mt: 2 }}
                        >
                          Ir a mi perfil
                        </Button>
                      </Paper>
                    </Stack>
                  )}

                  {activeStep === 1 && (
                    <Stack spacing={2}>
                      <Typography variant="h6" fontWeight={700}>
                        Metodo de envio
                      </Typography>
                      <RadioGroup
                        value={form.shippingMethod}
                        onChange={(e) => handleFieldChange('shippingMethod', e.target.value)}
                      >
                        {(['pickup', 'standard', 'express'] as ShippingMethod[]).map((method) => (
                          <Paper
                            key={method}
                            variant="outlined"
                            sx={{ p: 2, mb: 2, borderRadius: 2 }}
                          >
                            <FormControlLabel
                              value={method}
                              control={<Radio />}
                              label={
                                <Box>
                                  <Typography fontWeight={600}>
                                    {shippingLabels[method]}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {method === 'pickup'
                                      ? 'Gratis - retiro en tienda'
                                      : formatCurrency(shippingCosts[method])}
                                  </Typography>
                                </Box>
                              }
                            />
                          </Paper>
                        ))}
                      </RadioGroup>
                      {errors['shippingMethod'] && (
                        <Alert severity="error">{errors['shippingMethod']}</Alert>
                      )}
                    </Stack>
                  )}

                  {activeStep === 2 && (
                    <Stack spacing={2}>
                      <Typography variant="h6" fontWeight={700}>
                        Pago con Mercado Pago
                      </Typography>
                      <Alert severity="info">
                        Al continuar, te redirigimos a Mercado Pago para completar el pago.
                      </Alert>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={form.payment.acceptTerms}
                            onChange={(e) =>
                              handleFieldChange('payment.acceptTerms', e.target.checked)
                            }
                          />
                        }
                        label="Acepto terminos y condiciones"
                      />
                      {errors['payment'] && <Alert severity="error">{errors['payment']}</Alert>}
                    </Stack>
                  )}
                </>
              )}
            </Paper>

            <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
              <Button disabled={activeStep === 0} variant="outlined" onClick={handleBack}>
                Volver
              </Button>
              {activeStep < steps.length - 1 ? (
                <Button variant="contained" onClick={handleNext}>
                  Continuar
                </Button>
              ) : (
                <Button variant="contained" onClick={handlePayment} disabled={isPaying}>
                  {isPaying ? 'Redirigiendo...' : 'Ir a Mercado Pago'}
                </Button>
              )}
            </Stack>
          </Grid>

          <Grid item xs={12} lg={4}>
            <Paper sx={{ p: 3, position: 'sticky', top: 90 }}>
              <Typography variant="h6" fontWeight={700}>
                Resumen
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Stack spacing={1.5}>
                <Row label="Subtotal" value={formatCurrency(computedSubtotal)} />
                {discountAmount > 0 && (
                  <Row label="Descuento" value={`-${formatCurrency(discountAmount)}`} />
                )}
                <Row
                  label="Envio"
                  value={shippingCost === 0 ? 'Gratis' : formatCurrency(shippingCost)}
                />
                <Row label="Impuestos" value={formatCurrency(0)} />
                <Divider />
                <Row label="Total" value={formatCurrency(total)} strong />
              </Stack>
              <Divider sx={{ my: 2 }} />
              <Typography variant="caption" color="text.secondary">
                Los montos se actualizan segun el envio seleccionado.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </RequireAuth>
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

