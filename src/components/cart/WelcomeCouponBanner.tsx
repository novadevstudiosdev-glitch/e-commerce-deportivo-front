'use client';

import { useEffect, useMemo, useState } from 'react';
import { Alert, Box, Button, Stack, Typography } from '@mui/material';
import { useCart, useAuth } from '@/hooks';
import { validateCoupon } from '@/lib/coupons';
import {
  WELCOME_COUPON_CODE,
  WELCOME_COUPON_STORAGE_KEY,
  WELCOME_COUPON_USED_KEY,
} from '@/lib/constants';

interface WelcomeCouponBannerProps {
  subtotal: number;
  productIds: string[];
}

type BannerState = 'idle' | 'applying' | 'applied' | 'error';

export function WelcomeCouponBanner({ subtotal, productIds }: WelcomeCouponBannerProps) {
  const { appliedCoupon, applyCoupon } = useCart();
  const { session } = useAuth();
  const [state, setState] = useState<BannerState>('idle');
  const [message, setMessage] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  const isLogged = Boolean(session?.isAuthenticated);

  const welcomeAvailable = useMemo(() => {
    if (typeof window === 'undefined') return false;
    const stored = localStorage.getItem(WELCOME_COUPON_STORAGE_KEY);
    const used = localStorage.getItem(WELCOME_COUPON_USED_KEY);
    if (!stored || used === 'true') return false;
    return stored.toUpperCase() === WELCOME_COUPON_CODE;
  }, []);

  useEffect(() => {
    if (!isLogged) {
      setVisible(false);
      return;
    }
    if (appliedCoupon) {
      setVisible(false);
      return;
    }
    setVisible(welcomeAvailable);
  }, [appliedCoupon, isLogged, welcomeAvailable]);

  const handleApply = async () => {
    if (state === 'applying') return;
    setState('applying');
    setMessage(null);

    const result = await validateCoupon(WELCOME_COUPON_CODE, subtotal, productIds);
    if (!result.ok) {
      setState('error');
      setMessage(result.reason);
      return;
    }

    applyCoupon(result.coupon);
    if (typeof window !== 'undefined') {
      localStorage.setItem(WELCOME_COUPON_USED_KEY, 'true');
    }

    setState('applied');
    setMessage('Cupon aplicado correctamente.');
    setTimeout(() => setVisible(false), 1800);
  };

  if (!visible) return null;

  const isApplied = state === 'applied';

  return (
    <Alert
      severity={isApplied ? 'success' : 'info'}
      icon={false}
      sx={{
        mb: 3,
        borderRadius: 2,
        bgcolor: isApplied ? '#ECFDF3' : '#E8F2FF',
        color: '#0F172A',
        border: '1px solid',
        borderColor: isApplied ? '#A7F3D0' : '#C7DBFF',
        boxShadow: '0 10px 24px rgba(15, 23, 42, 0.08)',
        animation: 'fadeSlideIn 280ms ease-out',
        '@keyframes fadeSlideIn': {
          from: { opacity: 0, transform: 'translateY(-6px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        justifyContent="space-between"
      >
        <Box>
          <Typography fontWeight={700} sx={{ mb: 0.5 }}>
            {isApplied ? 'Cupon aplicado 🎉' : '🎁 Tenes un cupon de bienvenida disponible'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Usa {WELCOME_COUPON_CODE} y obtene tu descuento en esta compra.
          </Typography>
          {message && (
            <Typography variant="caption" color={isApplied ? 'success.main' : 'error.main'}>
              {message}
            </Typography>
          )}
        </Box>
        <Button
          variant={isApplied ? 'outlined' : 'contained'}
          color={isApplied ? 'success' : 'primary'}
          onClick={handleApply}
          disabled={state === 'applying' || isApplied}
          sx={{ minWidth: 160 }}
        >
          {state === 'applying'
            ? 'Aplicando...'
            : isApplied
              ? 'Aplicado'
              : 'Aplicar cupon'}
        </Button>
      </Stack>
    </Alert>
  );
}
