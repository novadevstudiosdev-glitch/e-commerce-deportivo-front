'use client';

import { useEffect, useState } from 'react';
import { Alert, Box, Button, Stack, Typography } from '@mui/material';
import { useCart, useWelcomeCoupon } from '@/hooks';
import { WELCOME_COUPON_CODE } from '@/lib/constants';

interface WelcomeCouponBannerProps {
  subtotal: number;
  productIds: string[];
}

type BannerState = 'idle' | 'applying' | 'applied' | 'error';

export function WelcomeCouponBanner({
  subtotal: _subtotal,
  productIds: _productIds,
}: WelcomeCouponBannerProps) {
  const { appliedCoupon, applyCoupon } = useCart();
  const { isLoggedIn, couponAvailable, couponUsed, applyCoupon: applyWelcomeCoupon, isLoading } =
    useWelcomeCoupon();
  const [state, setState] = useState<BannerState>('idle');
  const [message, setMessage] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!isLoggedIn || isLoading) {
      setVisible(false);
      return;
    }
    if (appliedCoupon) {
      setVisible(false);
      return;
    }
    if (couponUsed) {
      setVisible(false);
      return;
    }
    setVisible(couponAvailable);
  }, [appliedCoupon, couponAvailable, couponUsed, isLoggedIn, isLoading]);

  const handleApply = async () => {
    if (state === 'applying') return;
    setState('applying');
    setMessage(null);

    const result = await applyWelcomeCoupon();
    if (!result.ok) {
      setState('error');
      setMessage(result.reason);
      return;
    }

    applyCoupon(result.coupon);
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
            {isApplied ? 'Cupon aplicado 10%' : 'Tenes un cupon de bienvenida disponible'}
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
          {state === 'applying' ? 'Aplicando...' : isApplied ? 'Aplicado' : 'Aplicar cupon'}
        </Button>
      </Stack>
    </Alert>
  );
}
