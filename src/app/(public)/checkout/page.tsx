// ============================================
// CHECKOUT PAGE - MULTI STEP
// ============================================

'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  TextField,
} from '@mui/material';
import { useCart, useAuth } from '@/hooks';
import { AUTH_TOKEN_KEY } from '@/lib/constants';
import { RequireAuth } from '@/utils/requireAuth';
import { formatCurrency } from '@/lib/format';
import { ROUTES } from '@/lib/routes';
import { paymentsService } from '@/services/payments.service';
import { shippingService, type ShippingQuoteOption } from '@/services/shipping.service';
import { MercadoPagoCardBrick } from '@/components/cart/MercadoPagoCardBrick';
import { CouponBox } from '@/components';
import type { CheckoutForm, CheckoutOrderSummary, ShippingMethod } from '@/types/checkout';

const STORAGE_KEY = 'checkout-form';
const ORDER_KEY = 'checkout-last-order';
const MP_PUBLIC_KEY = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY ?? '';

const steps = ['Datos', 'Envio', 'Pago'];

const DEFAULT_PACKAGE_DIMENSIONS = { length: 30, width: 20, height: 10 };
const DEFAULT_ITEM_WEIGHT_KG = 0.4;

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
  shippingMethod: '',
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

type CardPaymentFormData = {
  token: string;
  payment_method_id: string;
  issuer_id?: string | number;
  installments: number;
  payer?: {
    email?: string;
  };
};

type SelectableShippingOption = ShippingQuoteOption & {
  id: string;
  label: string;
};

export default function CheckoutPage() {
  const { items, subtotal, discountAmount, appliedCoupon } = useCart();
  const { session } = useAuth();
  const profile = session?.user;
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [form, setForm] = useState<CheckoutForm>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPaying, setIsPaying] = useState(false);
  const [paymentMode, setPaymentMode] = useState<'card' | 'redirect'>('card');
  const [payerEmail, setPayerEmail] = useState(profile?.email || form.contact.email || '');
  const [shippingOptions, setShippingOptions] = useState<SelectableShippingOption[]>([]);
  const [shippingLoading, setShippingLoading] = useState(false);
  const [shippingError, setShippingError] = useState<string | null>(null);

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

  useEffect(() => {
    if (!payerEmail) {
      const nextEmail = profile?.email || form.contact.email || '';
      if (nextEmail) {
        setPayerEmail(nextEmail);
      }
    }
  }, [profile?.email, form.contact.email, payerEmail]);

  useEffect(() => {
    if (!form.address.postalCode && profile?.postalCode) {
      setForm((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          postalCode: profile.postalCode ?? '',
        },
      }));
    }
  }, [form.address.postalCode, profile?.postalCode]);

  const computedSubtotal = useMemo(() => {
    if (typeof subtotal === 'number') return subtotal;
    return items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  }, [items, subtotal]);

  const estimatedWeightKg = useMemo(() => {
    const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
    return Math.max(0.5, totalItems * DEFAULT_ITEM_WEIGHT_KG);
  }, [items]);

  const selectedShippingOption = useMemo(
    () => shippingOptions.find((option) => option.id === form.shippingMethod) ?? null,
    [shippingOptions, form.shippingMethod],
  );

  const shippingCost = selectedShippingOption?.price ?? 0;
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
        if (group === 'address') {
          return {
            ...prev,
            address: {
              ...prev.address,
              [key]: value,
            },
          } as CheckoutForm;
        }
        if (group === 'contact') {
          return {
            ...prev,
            contact: {
              ...prev.contact,
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
      if (!form.address.street || form.address.street.trim().length < 2) {
        nextErrors['street'] = 'Ingresa tu calle';
      }
      if (!form.address.province || form.address.province.trim().length < 2) {
        nextErrors['province'] = 'Ingresa una provincia valida';
      }
      if (!form.address.postalCode || !isValidPostalCode(form.address.postalCode)) {
        nextErrors['postalCode'] = 'Ingresa un codigo postal valido (4 digitos)';
      }
      if (!form.shippingMethod) nextErrors['shippingMethod'] = 'Selecciona un envio';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  useEffect(() => {
    if (activeStep !== 1) {
      return;
    }

    if (items.length === 0) {
      setShippingOptions([]);
      setShippingError(null);
      return;
    }

    const postalCode = form.address.postalCode?.trim() ?? '';
    const province = form.address.province?.trim() ?? '';
    if (!postalCode || !province) {
      setShippingOptions([]);
      setShippingError(null);
      return;
    }

    if (!isValidPostalCode(postalCode)) {
      setShippingOptions([]);
      setShippingError('Ingresa un codigo postal valido (4 digitos).');
      return;
    }

    let cancelled = false;

    const loadQuotes = async () => {
      setShippingLoading(true);
      setShippingError(null);
      try {
        const rawOptions = await shippingService.quoteShipping({
          destinationPostalCode: postalCode,
          weightKg: estimatedWeightKg,
          dimensionsCm: DEFAULT_PACKAGE_DIMENSIONS,
          declaredValue: computedSubtotal > 0 ? computedSubtotal : undefined,
          deliveryType: 'any',
        });

        if (cancelled) {
          return;
        }

        const nextOptions = rawOptions.map((option, index) => ({
          ...option,
          id: buildShippingOptionId(option, index),
          label: buildShippingLabel(option),
        }));

        setShippingOptions(nextOptions);
        setForm((prev) => {
          const exists = nextOptions.some((opt) => opt.id === prev.shippingMethod);
          const nextMethod = exists ? prev.shippingMethod : nextOptions[0]?.id ?? '';
          return {
            ...prev,
            shippingMethod: nextMethod,
          };
        });

        if (nextOptions.length === 0) {
          setShippingError('No hay opciones de envio para este codigo postal.');
        }
      } catch (error) {
        if (!cancelled) {
          setShippingOptions([]);
          const message =
            error instanceof Error
              ? error.message
              : 'No pudimos cotizar el envio. Intenta nuevamente.';
          setShippingError(message);
        }
      } finally {
        if (!cancelled) {
          setShippingLoading(false);
        }
      }
    };

    void loadQuotes();

    return () => {
      cancelled = true;
    };
  }, [
    activeStep,
    form.address.postalCode,
    form.address.province,
    items.length,
    estimatedWeightKg,
    computedSubtotal,
  ]);

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

  const buildOrderSummary = useCallback((orderId: string): CheckoutOrderSummary => {
    const shippingLabel = selectedShippingOption?.label ?? 'Sin seleccionar';
    return {
      id: orderId,
      createdAt: new Date().toISOString(),
      items,
      subtotal: computedSubtotal,
      shippingCost,
      total,
      shippingMethod: shippingLabel,
      shippingOptionLabel: shippingLabel,
      contact: form.contact,
      address: form.address,
    };
  }, [
    items,
    computedSubtotal,
    shippingCost,
    total,
    form.contact,
    form.address,
    selectedShippingOption?.label,
  ]);

  const createOrder = useCallback(async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem(AUTH_TOKEN_KEY) : null;
    if (!token) {
      throw new Error('No se encontro token de sesion.');
    }

    const sizeNotes = items
      .filter((item) => item.size)
      .map((item) => `${item.product.name} x${item.quantity}: talle ${item.size}`)
      .join(' | ');

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
        shipping_address: form.address,
        ...(sizeNotes ? { notes: sizeNotes } : {}),
        ...(appliedCoupon?.code ? { coupon_code: appliedCoupon.code } : {}),
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
      throw new Error('No se pudo crear la orden.');
    }

    return orderId;
  }, [items, appliedCoupon?.code, form.address]);

  const handleCardPaymentSubmit = useCallback(async (formData: CardPaymentFormData) => {
    setSubmitError(null);
    if (!form.payment.acceptTerms) {
      setErrors({ payment: 'Debes aceptar los terminos' });
      throw new Error('Debes aceptar los terminos.');
    }
    if (items.length === 0) {
      setSubmitError('Tu carrito esta vacio.');
      throw new Error('Tu carrito esta vacio.');
    }

    setIsPaying(true);
    try {
      const orderId = await createOrder();
      const email =
        payerEmail || formData?.payer?.email || profile?.email || form.contact.email || '';
      if (!email) {
        throw new Error('Falta el email del comprador.');
      }

      const paymentResponse = await paymentsService.createMercadoPagoPayment({
        ...formData,
        orderId,
        payer: { email },
      });
      const paymentData = paymentResponse.data ?? paymentResponse;

      const orderSummary = buildOrderSummary(orderId);
      localStorage.setItem(ORDER_KEY, JSON.stringify(orderSummary));

      if (paymentData.status === 'approved') {
        router.push('/checkout/success');
        return;
      }

      if (paymentData.status === 'pending' || paymentData.status === 'in_process') {
        setSubmitError('Tu pago quedo pendiente. Te avisaremos cuando se confirme.');
        return;
      }

      throw new Error('El pago fue rechazado. Intenta con otra tarjeta.');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'No se pudo iniciar el pago. Intenta nuevamente.';
      setSubmitError(message);
      throw error;
    } finally {
      setIsPaying(false);
    }
  }, [form, items, profile?.email, router, buildOrderSummary, createOrder, payerEmail]);

  const handleRedirectPayment = async () => {
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
      const orderId = await createOrder();
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

      const orderSummary = buildOrderSummary(orderId);
      localStorage.setItem(ORDER_KEY, JSON.stringify(orderSummary));
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
                      <TextField
                        label="Calle"
                        value={form.address.street}
                        onChange={(e) => handleFieldChange('address.street', e.target.value)}
                        helperText="Ingresa tu calle para completar la direccion."
                        fullWidth
                      />
                      {errors['street'] && (
                        <Alert severity="error">{errors['street']}</Alert>
                      )}
                      <TextField
                        label="Provincia"
                        value={form.address.province}
                        onChange={(e) => handleFieldChange('address.province', e.target.value)}
                        helperText="Indica tu provincia para cotizar."
                        fullWidth
                      />
                      {errors['province'] && (
                        <Alert severity="error">{errors['province']}</Alert>
                      )}
                      <TextField
                        label="Codigo postal"
                        value={form.address.postalCode}
                        onChange={(e) => {
                          const nextValue = e.target.value.replace(/\D/g, '').slice(0, 4);
                          handleFieldChange('address.postalCode', nextValue);
                        }}
                        inputProps={{ inputMode: 'numeric', maxLength: 4 }}
                        helperText="Necesitamos el codigo postal para cotizar."
                        fullWidth
                      />
                      {errors['postalCode'] && (
                        <Alert severity="error">{errors['postalCode']}</Alert>
                      )}
                      {shippingLoading && (
                        <Alert severity="info">Cotizando envio...</Alert>
                      )}
                      {shippingError && (
                        <Alert severity="error">{shippingError}</Alert>
                      )}
                      {shippingOptions.length > 0 && (
                        <RadioGroup
                          value={form.shippingMethod}
                          onChange={(e) => handleFieldChange('shippingMethod', e.target.value)}
                        >
                          {shippingOptions.map((option) => (
                            <Paper
                              key={option.id}
                              variant="outlined"
                              sx={{ p: 2, mb: 2, borderRadius: 2 }}
                            >
                              <FormControlLabel
                                value={option.id}
                                control={<Radio />}
                                label={
                                  <Box>
                                    <Typography fontWeight={600}>{option.label}</Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      {formatCurrency(option.price)}
                                      {option.etaText ? ` � ${option.etaText}` : ''}
                                    </Typography>
                                  </Box>
                                }
                              />
                            </Paper>
                          ))}
                        </RadioGroup>
                      )}
                      {!shippingLoading &&
                        !shippingError &&
                        shippingOptions.length === 0 &&
                        form.address.postalCode &&
                        isValidPostalCode(form.address.postalCode) && (
                          <Alert severity="info">
                            No hay opciones de envio disponibles para este codigo postal.
                          </Alert>
                        )}
                      {errors['shippingMethod'] && (
                        <Alert severity="error">{errors['shippingMethod']}</Alert>
                      )}
                    </Stack>
                  )}

                  {activeStep === 2 && (
                    <Stack spacing={2}>
                      <Typography variant="h6" fontWeight={700}>
                        Pago
                      </Typography>
                      <RadioGroup
                        value={paymentMode}
                        onChange={(e) => setPaymentMode(e.target.value as 'card' | 'redirect')}
                      >
                        <FormControlLabel
                          value="card"
                          control={<Radio />}
                          label="Tarjeta (Mercado Pago)"
                        />
                        <FormControlLabel
                          value="redirect"
                          control={<Radio />}
                          label="Mercado Pago (redirigir)"
                        />
                      </RadioGroup>
                      {paymentMode === 'card' ? (
                        <Alert severity="info">
                          Completa los datos de tu tarjeta para finalizar el pago.
                        </Alert>
                      ) : (
                        <Alert severity="info">
                          Al continuar, te redirigimos a Mercado Pago para completar el pago.
                        </Alert>
                      )}
                      <TextField
                        label="Email del comprador"
                        placeholder="buyer_test@tu-dominio.com"
                        value={payerEmail}
                        onChange={(e) => setPayerEmail(e.target.value)}
                        fullWidth
                        type="email"
                        helperText="En modo test usa un email de comprador de prueba."
                      />
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
                      {paymentMode === 'card' && (
                        <>
                          {!MP_PUBLIC_KEY && (
                            <Alert severity="error">
                              Falta configurar la clave publica de Mercado Pago.
                            </Alert>
                          )}
                          {MP_PUBLIC_KEY && !payerEmail && (
                            <Alert severity="warning">
                              Ingresa un email de comprador para continuar.
                            </Alert>
                          )}
                          {MP_PUBLIC_KEY && !form.payment.acceptTerms && (
                            <Alert severity="warning">
                              Acepta los terminos para habilitar el formulario de pago.
                            </Alert>
                          )}
                          {MP_PUBLIC_KEY && form.payment.acceptTerms && payerEmail && (
                            <MercadoPagoCardBrick
                              amount={total}
                              publicKey={MP_PUBLIC_KEY}
                              payerEmail={payerEmail || profile?.email}
                              onSubmit={handleCardPaymentSubmit}
                            />
                          )}
                          {isPaying && (
                            <Alert severity="info">
                              Procesando pago, por favor espera...
                            </Alert>
                          )}
                        </>
                      )}
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
              ) : paymentMode === 'redirect' ? (
                <Button variant="contained" onClick={handleRedirectPayment} disabled={isPaying}>
                  {isPaying ? 'Redirigiendo...' : 'Ir a Mercado Pago'}
                </Button>
              ) : (
                <Button variant="contained" disabled>
                  Completa el pago arriba
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
                  value={
                    selectedShippingOption
                      ? shippingCost === 0
                        ? 'Gratis'
                        : formatCurrency(shippingCost)
                      : 'Pendiente'
                  }
                />
                <Row label="Impuestos" value={formatCurrency(0)} />
                <Divider />
                <Row label="Total" value={formatCurrency(total)} strong />
              </Stack>
              <CouponBox
                subtotal={computedSubtotal}
                productIds={items.map((item) => item.product.id)}
              />
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

function buildShippingOptionId(option: ShippingQuoteOption, index: number) {
  const provider = option.provider.replace(/\s+/g, '-').toLowerCase();
  const service = option.serviceName.replace(/\s+/g, '-').toLowerCase();
  return `${provider}-${service}-${option.deliveryType}-${option.price}-${index}`;
}

function buildShippingLabel(option: ShippingQuoteOption) {
  const delivery =
    option.deliveryType === 'pickup' ? 'Retiro' : 'Domicilio';
  return `${option.provider} - ${option.serviceName} (${delivery})`;
}

function isValidPostalCode(value: string) {
  return /^\d{4}$/.test(value);
}








