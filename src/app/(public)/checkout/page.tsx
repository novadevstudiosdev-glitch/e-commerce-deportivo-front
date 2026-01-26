// ============================================
// CHECKOUT PAGE - MULTI STEP
// ============================================

'use client';

import { useEffect, useMemo, useState } from 'react';
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
  TextField,
  Typography,
  Skeleton,
  Checkbox,
  Stack,
} from '@mui/material';
import { useCart } from '@/hooks';
import { RequireAuth } from '@/utils/requireAuth';
import { formatCurrency } from '@/lib/format';
import { ROUTES } from '@/lib/routes';
import type {
  CheckoutForm,
  CheckoutOrderSummary,
  ShippingMethod,
} from '@/types/checkout';

const STORAGE_KEY = 'checkout-form';
const ORDER_KEY = 'checkout-last-order';

const steps = ['Datos', 'Envio', 'Pago', 'Confirmacion'];

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

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart, totalPrice } = useCart();
  const [activeStep, setActiveStep] = useState(0);
  const [form, setForm] = useState<CheckoutForm>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [submitError, setSubmitError] = useState<string | null>(null);

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

  const subtotal = useMemo(() => {
    if (typeof totalPrice === 'number') return totalPrice;
    return items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  }, [items, totalPrice]);

  const shippingCost = shippingCosts[form.shippingMethod];
  const total = subtotal + shippingCost;

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
        if (group === 'contact' || group === 'address' || group === 'payment') {
          return {
            ...prev,
            [group]: {
              ...prev[group],
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

    if (stepIndex === 0) {
      if (!form.contact.firstName.trim()) nextErrors['contact.firstName'] = 'Requerido';
      if (!form.contact.lastName.trim()) nextErrors['contact.lastName'] = 'Requerido';
      if (!form.contact.dni.trim() || !/^\d+$/.test(form.contact.dni)) {
        nextErrors['contact.dni'] = 'DNI numerico';
      }
      if (!form.contact.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contact.email)) {
        nextErrors['contact.email'] = 'Email invalido';
      }
      if (!form.contact.phone.trim()) nextErrors['contact.phone'] = 'Requerido';

      if (!form.address.street.trim()) nextErrors['address.street'] = 'Requerido';
      if (!form.address.number.trim()) nextErrors['address.number'] = 'Requerido';
      if (!form.address.city.trim()) nextErrors['address.city'] = 'Requerido';
      if (!form.address.province.trim()) nextErrors['address.province'] = 'Requerido';
      if (!form.address.postalCode.trim() || !/^\d+$/.test(form.address.postalCode)) {
        nextErrors['address.postalCode'] = 'Codigo postal numerico';
      }
    }

    if (stepIndex === 1) {
      if (!form.shippingMethod) nextErrors['shippingMethod'] = 'Selecciona un envio';
    }

    if (stepIndex === 2) {
      if (!form.payment.cardName.trim()) nextErrors['payment.cardName'] = 'Requerido';
      const cardDigits = form.payment.cardNumber.replace(/\s/g, '');
      if (!/^\d{13,19}$/.test(cardDigits)) {
        nextErrors['payment.cardNumber'] = 'Numero invalido';
      }
      if (!isValidExpiry(form.payment.cardExpiry)) {
        nextErrors['payment.cardExpiry'] = 'Vencimiento invalido';
      }
      if (!/^\d{3,4}$/.test(form.payment.cardCvc)) {
        nextErrors['payment.cardCvc'] = 'CVC invalido';
      }
      if (!form.payment.acceptTerms) {
        nextErrors['payment.acceptTerms'] = 'Debes aceptar los terminos';
      }
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

  const handleConfirm = () => {
    setSubmitError(null);
    if (!validateStep(2)) {
      setActiveStep(2);
      return;
    }
    if (items.length === 0) {
      setSubmitError('Tu carrito esta vacio.');
      return;
    }
    const order: CheckoutOrderSummary = {
      id: `ORD-${Date.now()}`,
      createdAt: new Date().toISOString(),
      items,
      subtotal,
      shippingCost,
      total,
      shippingMethod: form.shippingMethod,
      contact: form.contact,
      address: form.address,
    };
    localStorage.setItem(ORDER_KEY, JSON.stringify(order));
    clearCart();
    localStorage.removeItem(STORAGE_KEY);
    router.push('/checkout/success');
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
                        Datos personales
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            label="Nombre"
                            fullWidth
                            value={form.contact.firstName}
                            onChange={(e) => handleFieldChange('contact.firstName', e.target.value)}
                            error={Boolean(errors['contact.firstName'])}
                            helperText={errors['contact.firstName'] ?? ' '}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            label="Apellido"
                            fullWidth
                            value={form.contact.lastName}
                            onChange={(e) => handleFieldChange('contact.lastName', e.target.value)}
                            error={Boolean(errors['contact.lastName'])}
                            helperText={errors['contact.lastName'] ?? ' '}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            label="DNI"
                            fullWidth
                            value={form.contact.dni}
                            onChange={(e) => handleFieldChange('contact.dni', e.target.value)}
                            error={Boolean(errors['contact.dni'])}
                            helperText={errors['contact.dni'] ?? ' '}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            label="Telefono"
                            fullWidth
                            value={form.contact.phone}
                            onChange={(e) => handleFieldChange('contact.phone', e.target.value)}
                            error={Boolean(errors['contact.phone'])}
                            helperText={errors['contact.phone'] ?? ' '}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            label="Email"
                            fullWidth
                            value={form.contact.email}
                            onChange={(e) => handleFieldChange('contact.email', e.target.value)}
                            error={Boolean(errors['contact.email'])}
                            helperText={errors['contact.email'] ?? ' '}
                          />
                        </Grid>
                      </Grid>

                      <Divider />
                      <Typography variant="h6" fontWeight={700}>
                        Direccion de envio
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={8}>
                          <TextField
                            label="Calle"
                            fullWidth
                            value={form.address.street}
                            onChange={(e) => handleFieldChange('address.street', e.target.value)}
                            error={Boolean(errors['address.street'])}
                            helperText={errors['address.street'] ?? ' '}
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            label="Numero"
                            fullWidth
                            value={form.address.number}
                            onChange={(e) => handleFieldChange('address.number', e.target.value)}
                            error={Boolean(errors['address.number'])}
                            helperText={errors['address.number'] ?? ' '}
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            label="Piso/Depto"
                            fullWidth
                            value={form.address.floor}
                            onChange={(e) => handleFieldChange('address.floor', e.target.value)}
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            label="Ciudad"
                            fullWidth
                            value={form.address.city}
                            onChange={(e) => handleFieldChange('address.city', e.target.value)}
                            error={Boolean(errors['address.city'])}
                            helperText={errors['address.city'] ?? ' '}
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            label="Provincia"
                            fullWidth
                            value={form.address.province}
                            onChange={(e) => handleFieldChange('address.province', e.target.value)}
                            error={Boolean(errors['address.province'])}
                            helperText={errors['address.province'] ?? ' '}
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            label="Codigo Postal"
                            fullWidth
                            value={form.address.postalCode}
                            onChange={(e) => handleFieldChange('address.postalCode', e.target.value)}
                            error={Boolean(errors['address.postalCode'])}
                            helperText={errors['address.postalCode'] ?? ' '}
                          />
                        </Grid>
                      </Grid>
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
                        Datos de pago
                      </Typography>
                      <TextField
                        label="Nombre en la tarjeta"
                        fullWidth
                        value={form.payment.cardName}
                        onChange={(e) => handleFieldChange('payment.cardName', e.target.value)}
                        error={Boolean(errors['payment.cardName'])}
                        helperText={errors['payment.cardName'] ?? ' '}
                      />
                      <TextField
                        label="Numero de tarjeta"
                        fullWidth
                        value={form.payment.cardNumber}
                        onChange={(e) =>
                          handleFieldChange('payment.cardNumber', formatCardNumber(e.target.value))
                        }
                        error={Boolean(errors['payment.cardNumber'])}
                        helperText={errors['payment.cardNumber'] ?? ' '}
                      />
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            label="Vencimiento (MM/YY)"
                            fullWidth
                            value={form.payment.cardExpiry}
                            onChange={(e) =>
                              handleFieldChange('payment.cardExpiry', formatExpiry(e.target.value))
                            }
                            error={Boolean(errors['payment.cardExpiry'])}
                            helperText={errors['payment.cardExpiry'] ?? ' '}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            label="CVC"
                            fullWidth
                            value={form.payment.cardCvc}
                            onChange={(e) =>
                              handleFieldChange('payment.cardCvc', onlyDigits(e.target.value, 4))
                            }
                            error={Boolean(errors['payment.cardCvc'])}
                            helperText={errors['payment.cardCvc'] ?? ' '}
                          />
                        </Grid>
                      </Grid>
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
                      {errors['payment.acceptTerms'] && (
                        <Alert severity="error">{errors['payment.acceptTerms']}</Alert>
                      )}
                    </Stack>
                  )}

                  {activeStep === 3 && (
                    <Stack spacing={2}>
                      <Typography variant="h6" fontWeight={700}>
                        Confirmacion
                      </Typography>
                      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                        <Typography fontWeight={600}>Direccion</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {form.address.street} {form.address.number},{' '}
                          {form.address.city}, {form.address.province} (
                          {form.address.postalCode})
                        </Typography>
                      </Paper>
                      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                        <Typography fontWeight={600}>Envio</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {shippingLabels[form.shippingMethod]} -{' '}
                          {shippingCost === 0 ? 'Gratis' : formatCurrency(shippingCost)}
                        </Typography>
                      </Paper>
                      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                        <Typography fontWeight={600}>Items</Typography>
                        <Stack spacing={1} sx={{ mt: 1 }}>
                          {items.map((item) => (
                            <Stack
                              key={item.id}
                              direction="row"
                              justifyContent="space-between"
                            >
                              <Typography variant="body2">
                                {item.product.name} x {item.quantity}
                              </Typography>
                              <Typography variant="body2">
                                {formatCurrency(item.product.price * item.quantity)}
                              </Typography>
                            </Stack>
                          ))}
                        </Stack>
                      </Paper>
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
                <Button variant="contained" onClick={handleConfirm}>
                  Confirmar compra
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
                <Row label="Subtotal" value={formatCurrency(subtotal)} />
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

function formatCardNumber(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 19);
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
}

function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function onlyDigits(value: string, max: number) {
  return value.replace(/\D/g, '').slice(0, max);
}

function isValidExpiry(value: string) {
  if (!/^\d{2}\/\d{2}$/.test(value)) return false;
  const [mm, yy] = value.split('/').map(Number);
  if (mm < 1 || mm > 12) return false;
  if (!Number.isFinite(yy)) return false;
  return true;
}
