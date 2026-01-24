import api from '@/lib/api';
import { Product, Category } from '@/types';

// ============================================
// SERVICIOS DE PRODUCTOS
// ============================================

export const productsService = {
  /**
   * Obtener todos los productos con filtros
   */
  async getProducts(filters?: {
    category?: string;
    search?: string;
    sort?: string;
    page?: number;
  }): Promise<{ products: Product[]; total: number }> {
    // TODO: Implementar llamada real
    // return api.get('/products', { params: filters });
    console.log('Fetching products with filters:', filters);
    return { products: [], total: 0 };
  },

  /**
   * Obtener producto por slug
   */
  async getProductBySlug(slug: string): Promise<Product | null> {
    // TODO: Implementar llamada real
    // return api.get(`/products/${slug}`);
    console.log('Fetching product:', slug);
    return null;
  },

  /**
   * Obtener productos por categoría
   */
  async getProductsByCategory(category: string): Promise<Product[]> {
    // TODO: Implementar llamada real
    // return api.get(`/products/category/${category}`);
    console.log('Fetching products for category:', category);
    return [];
  },

  /**
   * Buscar productos
   */
  async searchProducts(query: string): Promise<Product[]> {
    // TODO: Implementar llamada real
    // return api.get('/products/search', { params: { q: query } });
    console.log('Searching products:', query);
    return [];
  },

  /**
   * Obtener categorías
   */
  async getCategories(): Promise<Category[]> {
    // TODO: Implementar llamada real
    // return api.get('/categories');
    console.log('Fetching categories');
    return [];
  },
};

