'use client';

import { useEffect, useState } from 'react';
import { Alert, Box, Button, Stack, TextField, Typography } from '@mui/material';
import { validateCoupon } from '@/lib/coupons';
import { useAuth, useCart, useWelcomeCoupon } from '@/hooks';
import { WELCOME_COUPON_CODE } from '@/lib/constants';
import { WelcomePromoModal } from '@/components/common/WelcomePromoModal';

interface CouponBoxProps {
  subtotal: number;
  productIds: string[];
}

export function CouponBox({ subtotal, productIds }: CouponBoxProps) {
  const { appliedCoupon, applyCoupon, removeCoupon } = useCart();
  const { isAuthenticated } = useAuth();
  const { applyCoupon: applyWelcomeCoupon } = useWelcomeCoupon();
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );

  useEffect(() => {
    if (appliedCoupon?.code) {
      setCode(appliedCoupon.code);
      return;
    }
    setCode('');
  }, [appliedCoupon?.code]);

  const handleApply = async (overrideCode?: string | React.MouseEvent) => {
    const candidate = typeof overrideCode === 'string' ? overrideCode : code;
    const finalCode = candidate.trim();
    setIsLoading(true);
    setMessage(null);
    if (finalCode.toUpperCase() === WELCOME_COUPON_CODE) {
      if (!isAuthenticated) {
        setIsLoading(false);
        setShowWelcomeModal(true);
        setMessage({ type: 'error', text: 'Registrate para obtener tu 10% OFF.' });
        return;
      }

      const result = await applyWelcomeCoupon();
      if (!result.ok) {
        setIsLoading(false);
        const messageText = result.requiresLogin
          ? 'No se pudo validar el cupon, intenta de nuevo.'
          : result.reason;
        setMessage({ type: 'error', text: messageText });
        return;
      }

      applyCoupon(result.coupon);
      setMessage({ type: 'success', text: '\u2705 10% aplicado.' });
      setCode(WELCOME_COUPON_CODE);
      setIsLoading(false);
      return;
    }
    const result = await validateCoupon(finalCode, subtotal, productIds);
    if (!result.ok) {
      setMessage({ type: 'error', text: result.reason });
      setIsLoading(false);
      return;
    }
    applyCoupon(result.coupon);
    setMessage({ type: 'success', text: 'Cupon aplicado correctamente.' });
    setCode(finalCode);
    setIsLoading(false);
  };

  const handleRemove = () => {
    removeCoupon();
    setCode('');
    setMessage({ type: 'success', text: 'Cupon removido.' });
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
        Tengo un cupon
      </Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
        <TextField
          size="small"
          fullWidth
          label="Codigo de cupon"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          disabled={Boolean(appliedCoupon)}
        />
        <Button
          variant="contained"
          onClick={() => handleApply()}
          disabled={isLoading || !code.trim() || Boolean(appliedCoupon)}
        >
          {isLoading ? 'Aplicando...' : 'Aplicar'}
        </Button>
        {appliedCoupon && (
          <Button variant="outlined" color="inherit" onClick={handleRemove}>
            Quitar cupon
          </Button>
        )}
      </Stack>

      {appliedCoupon && (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          Cupon activo: <strong>{appliedCoupon.code}</strong>
        </Typography>
      )}

      {message && (
        <Alert severity={message.type} sx={{ mt: 1.5 }}>
          {message.text}
        </Alert>
      )}

      <WelcomePromoModal
        variant="guest"
        open={showWelcomeModal}
        onClose={() => setShowWelcomeModal(false)}
        primaryHref="/register"
        primaryLabel="Registrarme"
        secondaryLabel="Mas tarde"
      />
    </Box>
  );
}
