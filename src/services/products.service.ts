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
  }): Promise<ProductPublic[]> {
    let query = supabase.from('products').select('*');

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

    const { data, error } = await query;

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
  }): Promise<ProductListResponse> {
    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 12;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase.from('products').select('*', { count: 'exact' });

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

    const { data, error, count } = await query.range(from, to);

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
