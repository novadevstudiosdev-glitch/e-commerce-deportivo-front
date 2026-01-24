import api from '@/lib/api';

// ============================================
// SERVICIOS DE PRODUCTOS
// ============================================

export interface ProductPublic {
  id: string;
  name: string;
  description: string;
  price: string;
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
   * Obtener productos con filtros
   */
  async getProducts(filters?: {
    category?: string;
    search?: string;
    sort?: string;
    page?: number;
    limit?: number;
  }): Promise<ProductListResponse> {
    const params: Record<string, any> = {};
    if (filters?.category) params.category = filters.category;
    if (filters?.search) params.q = filters.search;
    if (filters?.sort) params.sort = filters.sort;
    if (filters?.page) params.page = filters.page;
    if (filters?.limit) params.limit = filters.limit;

    const response = await api.get('/products', { params });
    return response.data as ProductListResponse;
  },
};
