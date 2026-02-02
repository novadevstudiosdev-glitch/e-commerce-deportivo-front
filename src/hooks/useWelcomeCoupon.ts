import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { WELCOME_COUPON_CODE } from '@/lib/constants';
import type { Coupon } from '@/lib/coupons';
import { useAuth } from '@/hooks/useAuth';

type UserCouponRow = {
  id: string;
  user_id: string;
  coupon_code: string;
  used: boolean;
  used_at: string | null;
  created_at: string;
};

type ApplyWelcomeCouponResult =
  | { ok: true; coupon: Coupon }
  | { ok: false; reason: string; requiresLogin?: boolean };

const WELCOME_COUPON: Coupon = {
  id: 'welcome10',
  code: WELCOME_COUPON_CODE,
  discount_type: 'percent',
  discount_value: 10,
  is_active: true,
};

const GENERIC_ERROR = 'No se pudo validar el cupon, intenta de nuevo.';

export function useWelcomeCoupon() {
  const { session, isAuthenticated } = useAuth();
  const userId = isAuthenticated ? session?.user?.id ?? null : null;
  const [isLoading, setIsLoading] = useState(true);
  const [couponUsed, setCouponUsed] = useState(false);
  const [couponAvailable, setCouponAvailable] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadStatus = useCallback(async (targetUserId: string) => {
    setIsLoading(true);
    setError(null);
    const { data, error: fetchError } = await supabase
      .from('user_coupons')
      .select('id, used, used_at, coupon_code, user_id, created_at')
      .eq('user_id', targetUserId)
      .eq('coupon_code', WELCOME_COUPON_CODE)
      .maybeSingle();

    if (fetchError) {
      console.error('[WelcomeCoupon] Error leyendo user_coupons', fetchError);
      setError(GENERIC_ERROR);
      setCouponAvailable(false);
      setCouponUsed(false);
      setIsLoading(false);
      return;
    }

    const row = data as UserCouponRow | null;
    if (row?.used) {
      setCouponUsed(true);
      setCouponAvailable(false);
    } else {
      setCouponUsed(false);
      setCouponAvailable(true);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!userId) {
      setCouponAvailable(false);
      setCouponUsed(false);
      setIsLoading(false);
      return;
    }
    loadStatus(userId);
  }, [userId, loadStatus]);

  const applyCoupon = useCallback(async (): Promise<ApplyWelcomeCouponResult> => {
    if (!userId) {
      return {
        ok: false,
        reason: 'Registrate para obtener tu 10% OFF.',
        requiresLogin: true,
      };
    }

    const { data, error: fetchError } = await supabase
      .from('user_coupons')
      .select('id, used')
      .eq('user_id', userId)
      .eq('coupon_code', WELCOME_COUPON_CODE)
      .maybeSingle();

    if (fetchError) {
      console.error('[WelcomeCoupon] Error validando user_coupons', fetchError);
      return { ok: false, reason: GENERIC_ERROR };
    }

    const existing = data as UserCouponRow | null;
    if (existing?.used) {
      setCouponUsed(true);
      setCouponAvailable(false);
      return { ok: false, reason: 'Este cupon ya fue utilizado.' };
    }

    const payload = {
      user_id: userId,
      coupon_code: WELCOME_COUPON_CODE,
      used: true,
      used_at: new Date().toISOString(),
    };

    const { error: upsertError } = await supabase
      .from('user_coupons')
      .upsert(payload, { onConflict: 'user_id,coupon_code' });

    if (upsertError) {
      console.error('[WelcomeCoupon] Error guardando user_coupons', upsertError);
      return { ok: false, reason: GENERIC_ERROR };
    }

    setCouponUsed(true);
    setCouponAvailable(false);

    return { ok: true, coupon: WELCOME_COUPON };
  }, [userId]);

  return {
    isLoggedIn: Boolean(userId),
    isLoading,
    couponAvailable,
    couponUsed,
    error,
    applyCoupon,
  };
}
