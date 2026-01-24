import api from '@/lib/api';
import { AdminStats, Order, Product, Offer, OfferBanner } from '@/types';

// ============================================
// SERVICIOS DE ADMINISTRADOR
// ============================================

export const adminService = {
  /**
   * Obtener estadísticas del admin
   */
  async getStats(): Promise<AdminStats> {
    // TODO: Implementar llamada real
    // return api.get('/admin/stats');
    console.log('Fetching admin stats');
    return {
      totalSales: 0,
      totalOrders: 0,
      totalProducts: 0,
      topProducts: [],
      recentOrders: [],
      lowStockProducts: [],
    };
  },

  /**
   * Crear producto
   */
  async createProduct(product: Omit<Product, 'id'>): Promise<Product> {
    // TODO: Implementar llamada real
    // return api.post('/admin/products', product);
    console.log('Creating product:', product);
    return { id: '', ...product };
  },

  /**
   * Actualizar producto
   */
  async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    // TODO: Implementar llamada real
    // return api.patch(`/admin/products/${id}`, product);
    console.log('Updating product:', { id, product });
    return { id, ...product } as Product;
  },

  /**
   * Eliminar producto
   */
  async deleteProduct(id: string): Promise<void> {
    // TODO: Implementar llamada real
    // return api.delete(`/admin/products/${id}`);
    console.log('Deleting product:', id);
  },

  /**
   * Obtener órdenes (admin)
   */
  async getOrders(): Promise<Order[]> {
    // TODO: Implementar llamada real
    // return api.get('/admin/orders');
    console.log('Fetching all orders');
    return [];
  },

  /**
   * Actualizar estado de orden
   */
  async updateOrderStatus(
    orderId: string,
    status: string,
    trackingNumber?: string
  ): Promise<Order> {
    // TODO: Implementar llamada real
    // return api.patch(`/admin/orders/${orderId}`, { status, trackingNumber });
    console.log('Updating order status:', { orderId, status, trackingNumber });
    return {
      id: '',
      userId: '',
      items: [],
      totalAmount: 0,
      status: 'pending',
      shippingAddress: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  },

  /**
   * Crear oferta
   */
  async createOffer(offer: Omit<Offer, 'id'>): Promise<Offer> {
    // TODO: Implementar llamada real
    // return api.post('/admin/offers', offer);
    console.log('Creating offer:', offer);
    return { id: '', ...offer };
  },

  /**
   * Obtener ofertas
   */
  async getOffers(): Promise<Offer[]> {
    // TODO: Implementar llamada real
    // return api.get('/admin/offers');
    console.log('Fetching offers');
    return [];
  },

  /**
   * Crear banner de oferta
   */
  async createOfferBanner(banner: Omit<OfferBanner, 'id'>): Promise<OfferBanner> {
    // TODO: Implementar llamada real
    // return api.post('/admin/banners', banner);
    console.log('Creating offer banner:', banner);
    return { id: '', ...banner };
  },

  /**
   * Obtener banners activos
   */
  async getActiveOfferBanners(): Promise<OfferBanner[]> {
    // TODO: Implementar llamada real
    // return api.get('/admin/banners');
    console.log('Fetching active banners');
    return [];
  },
};

