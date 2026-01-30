import { supabase } from '@/lib/supabaseClient';

export type CouponType = 'percent' | 'fixed';

export type Coupon = {
  id: string;
  code: string;
  title?: string | null;
  discount_type?: CouponType | null;
  discount_value?: number | null;
  type?: CouponType | null;
  value?: number | string | null;
  starts_at?: string | null;
  ends_at?: string | null;
  min_subtotal?: number | null;
  min_order_total?: number | string | null;
  max_uses?: number | null;
  uses_count?: number | null;
  is_active?: boolean | null;
  active?: boolean | null;
};

export type CouponValidationResult =
  | { ok: true; coupon: Coupon; discount: number; total: number }
  | { ok: false; reason: string };

type NormalizedCoupon = {
  id: string;
  code: string;
  title?: string | null;
  discount_type: CouponType;
  discount_value: number;
  starts_at?: string | null;
  ends_at?: string | null;
  min_subtotal?: number | null;
  max_uses?: number | null;
  uses_count?: number | null;
  is_active?: boolean | null;
};

function toNumber(value: number | string | null | undefined): number | null {
  if (value === null || value === undefined) return null;
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeCoupon(coupon: Coupon): NormalizedCoupon {
  const rawType = coupon.discount_type ?? coupon.type ?? 'fixed';
  const rawValue = coupon.discount_value ?? coupon.value ?? 0;
  const normalizedValue = toNumber(rawValue) ?? 0;
  const rawMinSubtotal = coupon.min_subtotal ?? coupon.min_order_total ?? null;
  const normalizedMinSubtotal = toNumber(rawMinSubtotal);
  const isActive = coupon.is_active ?? coupon.active ?? true;

  return {
    id: coupon.id,
    code: coupon.code,
    title: coupon.title ?? null,
    discount_type: rawType,
    discount_value: normalizedValue,
    starts_at: coupon.starts_at ?? null,
    ends_at: coupon.ends_at ?? null,
    min_subtotal: normalizedMinSubtotal,
    max_uses: coupon.max_uses ?? null,
    uses_count: coupon.uses_count ?? null,
    is_active: isActive,
  };
}

export function applyCoupon(subtotal: number, coupon: Coupon) {
  const normalized = normalizeCoupon(coupon);
  const safeSubtotal = Math.max(0, subtotal);
  let discount = 0;
  if (normalized.discount_type === 'percent') {
    discount = safeSubtotal * (normalized.discount_value / 100);
  } else {
    discount = Math.min(safeSubtotal, normalized.discount_value);
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

  const normalizedCoupon = normalizeCoupon(coupon);
  const now = new Date();
  if (normalizedCoupon.is_active === false) {
    return { ok: false, reason: 'El cupon no esta activo.' };
  }
  if (normalizedCoupon.starts_at && new Date(normalizedCoupon.starts_at) > now) {
    return { ok: false, reason: 'El cupon aun no esta vigente.' };
  }
  if (normalizedCoupon.ends_at && new Date(normalizedCoupon.ends_at) < now) {
    return { ok: false, reason: 'El cupon ya expiro.' };
  }
  if (
    normalizedCoupon.max_uses &&
    normalizedCoupon.uses_count &&
    normalizedCoupon.uses_count >= normalizedCoupon.max_uses
  ) {
    return { ok: false, reason: 'El cupon ya alcanzo el maximo de usos.' };
  }
  if (normalizedCoupon.min_subtotal && subtotal < normalizedCoupon.min_subtotal) {
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

  const { discount, total } = applyCoupon(subtotal, normalizedCoupon);

  return { ok: true, coupon: normalizedCoupon, discount, total };
}

export function getCouponBadgeLabel(coupon: Coupon | null): string | null {
  if (!coupon) return null;
  const normalized = normalizeCoupon(coupon);
  if (normalized.discount_type === 'percent') {
    return `Cupon ${normalized.discount_value}% OFF`;
  }
  return `Cupon $${normalized.discount_value} OFF`;
}
