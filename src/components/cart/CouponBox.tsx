'use client';

import { useEffect, useState } from 'react';
import { Alert, Box, Button, Stack, TextField, Typography } from '@mui/material';
import { validateCoupon } from '@/lib/coupons';
import { useCart } from '@/hooks';

interface CouponBoxProps {
  subtotal: number;
  productIds: string[];
}

export function CouponBox({ subtotal, productIds }: CouponBoxProps) {
  const { appliedCoupon, applyCoupon, removeCoupon } = useCart();
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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
    </Box>
  );
}
