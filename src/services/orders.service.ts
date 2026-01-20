import api from '@/lib/api';
import { Order, CartItem } from '@/types';

// ============================================
// SERVICIOS DE ÓRDENES
// ============================================

export const ordersService = {
  /**
   * Crear una nueva orden
   */
  async createOrder(items: CartItem[], shippingAddress: any): Promise<Order> {
    // TODO: Implementar llamada real
    // return api.post('/orders', { items, shippingAddress });
    console.log('Creating order:', { items, shippingAddress });
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
   * Obtener órdenes del usuario
   */
  async getUserOrders(userId: string): Promise<Order[]> {
    // TODO: Implementar llamada real
    // return api.get(`/users/${userId}/orders`);
    console.log('Fetching user orders:', userId);
    return [];
  },

  /**
   * Obtener orden por ID
   */
  async getOrderById(orderId: string): Promise<Order | null> {
    // TODO: Implementar llamada real
    // return api.get(`/orders/${orderId}`);
    console.log('Fetching order:', orderId);
    return null;
  },

  /**
   * Obtener estado de orden
   */
  async getOrderStatus(orderId: string): Promise<string> {
    // TODO: Implementar llamada real
    // return api.get(`/orders/${orderId}/status`);
    console.log('Fetching order status:', orderId);
    return 'pending';
  },
};
