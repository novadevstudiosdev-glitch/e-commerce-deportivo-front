import { supabase } from '@/lib/supabaseClient';

// ============================================
// SERVICIOS DE PRODUCTOS
// ============================================

export interface ProductPublic {
  id: string;
  name: string;
  description: string;
  price: string; // numeric a veces llega como string
  currency: string;
  stock: number;
  category: string;
  images?: string[] | null;
  is_featured: boolean;
  created_at: string;
  updated_at?: string;
  is_active?: boolean;
  discount_percent?: number | string | null;
  original_price?: number | string | null;
  sku?: string | null;
  sizes?: string[] | string | null;
  colors?: string[] | string | null;
  rating?: number | string | null;
  reviews?: number | string | null;
  reviews_count?: number | string | null;
  specs?: { label: string; value: string }[] | string | null;
  target?: string | null;
  low_stock_threshold?: number | null;
  coupon_products?: Array<{
    coupons?: {
      id: string;
      code: string;
      title: string;
      discount_type: 'percent' | 'fixed';
      discount_value: number | string;
      starts_at?: string | null;
      ends_at?: string | null;
      is_active?: boolean;
    } | null;
  }> | null;
}

export interface ProductListResponse {
  page: number;
  limit: number;
  total: number;
  data: ProductPublic[];
}

export const productsService = {
  /**
   * ✅ Traer TODOS los productos (recomendado para 250 items)
   */
  async getAllProducts(filters?: {
    category?: string;
    search?: string;
    sort?: string;
    includeCoupons?: boolean;
  }): Promise<ProductPublic[]> {
    const selectWithCoupons = '*, coupon_products(coupons(*))';
    const select = filters?.includeCoupons ? selectWithCoupons : '*';
    let query = supabase.from('products').select(select);

    if (filters?.category) query = query.eq('category', filters.category);
    if (filters?.search) query = query.ilike('name', `%${filters.search}%`);

    switch (filters?.sort) {
      case 'oldest':
        query = query.order('created_at', { ascending: true });
        break;
      case 'price_asc':
        query = query.order('price', { ascending: true });
        break;
      case 'price_desc':
        query = query.order('price', { ascending: false });
        break;
      case 'newest':
      default:
        query = query.order('created_at', { ascending: false });
        break;
    }

    let { data, error } = await query;

    if (error && filters?.includeCoupons) {
      const message = error.message || '';
      if (message.includes('coupon_products') || message.includes('relationship')) {
        const fallback = await supabase.from('products').select('*');
        data = fallback.data ?? null;
        error = fallback.error ?? null;
      }
    }

    if (error) throw new Error(error.message);

    return (data ?? []) as ProductPublic[];
  },

  /**
   * (Si querés paginación server-side, esto sigue existiendo)
   */
  async getProducts(filters?: {
    category?: string;
    search?: string;
    sort?: string;
    page?: number;
    limit?: number;
    includeCoupons?: boolean;
  }): Promise<ProductListResponse> {
    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 12;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const selectWithCoupons = '*, coupon_products(coupons(*))';
    const select = filters?.includeCoupons ? selectWithCoupons : '*';
    let query = supabase.from('products').select(select, { count: 'exact' });

    if (filters?.category) query = query.eq('category', filters.category);
    if (filters?.search) query = query.ilike('name', `%${filters.search}%`);

    switch (filters?.sort) {
      case 'oldest':
        query = query.order('created_at', { ascending: true });
        break;
      case 'price_asc':
        query = query.order('price', { ascending: true });
        break;
      case 'price_desc':
        query = query.order('price', { ascending: false });
        break;
      case 'newest':
      default:
        query = query.order('created_at', { ascending: false });
        break;
    }

    let { data, error, count } = await query.range(from, to);

    if (error && filters?.includeCoupons) {
      const message = error.message || '';
      if (message.includes('coupon_products') || message.includes('relationship')) {
        const fallback = await supabase
          .from('products')
          .select('*', { count: 'exact' })
          .range(from, to);
        data = fallback.data ?? null;
        error = fallback.error ?? null;
        count = fallback.count ?? null;
      }
    }

    if (error) throw new Error(error.message);

    return {
      page,
      limit,
      total: count ?? 0,
      data: (data ?? []) as ProductPublic[],
    };
  },

  /**
   * Obtener producto por ID
   */
  async getProductById(id: string): Promise<ProductPublic> {
    const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
    if (error) throw new Error(error.message);
    return data as ProductPublic;
  },
};
