'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { Alert, Box, Skeleton, Stack, Typography } from '@mui/material';

type BrickSubmitData = {
  token: string;
  payment_method_id: string;
  issuer_id?: string | number;
  installments: number;
  payer?: {
    email?: string;
  };
};

type MercadoPagoCardBrickProps = {
  amount: number;
  publicKey: string;
  payerEmail?: string;
  onSubmit: (data: BrickSubmitData) => Promise<void>;
};

const MP_SDK_URL = 'https://sdk.mercadopago.com/js/v2';

declare global {
  interface Window {
    MercadoPago?: new (publicKey: string, options?: { locale?: string }) => {
      bricks: () => {
        create: (
          name: string,
          containerId: string,
          settings: {
            initialization: {
              amount: number;
              payer?: { email?: string };
            };
            callbacks: {
              onReady?: () => void;
              onSubmit?: (formData: BrickSubmitData) => Promise<void> | void;
              onError?: (error: unknown) => void;
            };
          }
        ) => Promise<{ unmount?: () => void }>;
      };
    };
  }
}

function loadMercadoPagoSdk() {
  return new Promise<void>((resolve, reject) => {
    if (window.MercadoPago) {
      resolve();
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>('script[data-mp-sdk]');
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener(
        'error',
        () => reject(new Error('No se pudo cargar Mercado Pago.')),
        { once: true },
      );
      return;
    }

    const script = document.createElement('script');
    script.src = MP_SDK_URL;
    script.async = true;
    script.dataset.mpSdk = 'true';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('No se pudo cargar Mercado Pago.'));
    document.body.appendChild(script);
  });
}

export function MercadoPagoCardBrick({ amount, publicKey, payerEmail, onSubmit }: MercadoPagoCardBrickProps) {
  const containerId = useId().replace(/:/g, '');
  const controllerRef = useRef<{ unmount?: () => void } | null>(null);
  const submitRef = useRef(onSubmit);
  const initialPayerEmail = useRef(payerEmail).current;
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    submitRef.current = onSubmit;
  }, [onSubmit]);

  useEffect(() => {
    let cancelled = false;

    const mount = async () => {
      setIsLoading(true);
      setError(null);

      try {
        await loadMercadoPagoSdk();
        if (cancelled) return;

        if (!window.MercadoPago) {
          throw new Error('Mercado Pago SDK no disponible');
        }

        const mp = new window.MercadoPago(publicKey, { locale: 'es-AR' });
        const bricksBuilder = mp.bricks();
        try {
          controllerRef.current?.unmount?.();
        } catch (err) {
          console.warn('[MP] Brick unmount warning', err);
        }
        controllerRef.current = await bricksBuilder.create('cardPayment', containerId, {
          initialization: {
            amount,
            payer: initialPayerEmail ? { email: initialPayerEmail } : undefined,
          },
          callbacks: {
            onReady: () => {
              if (!cancelled) setIsLoading(false);
            },
            onSubmit: async (formData) => {
              await submitRef.current(formData);
            },
            onError: () => {
              if (!cancelled) {
                setError('No se pudo iniciar el formulario de pago.');
              }
            },
          },
        });
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Error al cargar Mercado Pago.');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void mount();

    return () => {
      cancelled = true;
      try {
        controllerRef.current?.unmount?.();
      } catch (err) {
        console.warn('[MP] Brick cleanup warning', err);
      }
      controllerRef.current = null;
    };
  }, [amount, publicKey, containerId, initialPayerEmail]);

  return (
    <Box>
      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
        Pago con tarjeta
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Box
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          px: { xs: 2, md: 3 },
          py: { xs: 2, md: 2.5 },
          bgcolor: 'background.paper',
        }}
      >
        {isLoading && (
          <Stack spacing={1.5}>
            <Skeleton height={36} />
            <Skeleton height={36} />
            <Skeleton height={36} />
          </Stack>
        )}
        <div id={containerId} />
      </Box>
    </Box>
  );
}
