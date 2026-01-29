import { supabase } from '@/lib/supabaseClient';

export type CouponType = 'percent' | 'fixed';

export type Coupon = {
  id: string;
  code: string;
  title: string;
  discount_type: CouponType;
  discount_value: number;
  starts_at?: string | null;
  ends_at?: string | null;
  min_subtotal?: number | null;
  max_uses?: number | null;
  uses_count?: number | null;
  is_active?: boolean;
};

export type CouponValidationResult =
  | { ok: true; coupon: Coupon; discount: number; total: number }
  | { ok: false; reason: string };

export function applyCoupon(subtotal: number, coupon: Coupon) {
  const safeSubtotal = Math.max(0, subtotal);
  let discount = 0;
  if (coupon.discount_type === 'percent') {
    discount = safeSubtotal * (coupon.discount_value / 100);
  } else {
    discount = Math.min(safeSubtotal, coupon.discount_value);
  }
  const roundedDiscount = Math.round(discount);
  const total = Math.max(0, Math.round(safeSubtotal - roundedDiscount));
  return { discount: roundedDiscount, total };
}

export async function validateCoupon(
  code: string,
  subtotal: number,
  productIds: string[]
): Promise<CouponValidationResult> {
  const cleanCode = code.trim();
  if (!cleanCode) {
    return { ok: false, reason: 'Ingresa un codigo valido.' };
  }

  const { data: coupon, error } = await supabase
    .from('coupons')
    .select('*')
    .ilike('code', cleanCode)
    .maybeSingle();

  if (error || !coupon) {
    return { ok: false, reason: 'Cupon invalido.' };
  }

  const now = new Date();
  if (coupon.is_active === false) {
    return { ok: false, reason: 'El cupon no esta activo.' };
  }
  if (coupon.starts_at && new Date(coupon.starts_at) > now) {
    return { ok: false, reason: 'El cupon aun no esta vigente.' };
  }
  if (coupon.ends_at && new Date(coupon.ends_at) < now) {
    return { ok: false, reason: 'El cupon ya expiro.' };
  }
  if (coupon.max_uses && coupon.uses_count && coupon.uses_count >= coupon.max_uses) {
    return { ok: false, reason: 'El cupon ya alcanzo el maximo de usos.' };
  }
  if (coupon.min_subtotal && subtotal < coupon.min_subtotal) {
    return { ok: false, reason: 'El subtotal no alcanza el minimo requerido.' };
  }

  const { data: couponProducts, error: relationError } = await supabase
    .from('coupon_products')
    .select('product_id')
    .eq('coupon_id', coupon.id);

  if (relationError) {
    return { ok: false, reason: 'No se pudo validar el cupon.' };
  }

  if (couponProducts && couponProducts.length > 0) {
    const applies = productIds.some((id) => couponProducts.some((row) => row.product_id === id));
    if (!applies) {
      return { ok: false, reason: 'El cupon no aplica a los productos del carrito.' };
    }
  }

  const normalizedCoupon: Coupon = {
    ...coupon,
    discount_value: Number(coupon.discount_value),
    min_subtotal: coupon.min_subtotal ? Number(coupon.min_subtotal) : null,
  };

  const { discount, total } = applyCoupon(subtotal, normalizedCoupon);

  return { ok: true, coupon: normalizedCoupon, discount, total };
}

export function getCouponBadgeLabel(coupon: Coupon | null): string | null {
  if (!coupon) return null;
  if (coupon.discount_type === 'percent') {
    return `Cupon ${coupon.discount_value}% OFF`;
  }
  return `Cupon $${coupon.discount_value} OFF`;
}
