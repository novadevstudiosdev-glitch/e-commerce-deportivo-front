import api from '@/lib/api';

// ============================================
// SERVICIOS DE ORDENES
// ============================================

export type ApiOrderStatus = 'pendiente_pago' | 'pagado' | 'en_preparacion' | 'enviado' | 'entregado';

export interface OrdersListItem {
  id: string;
  status: ApiOrderStatus;
  total: string;
  currency: string;
  created_at: string;
  itemsCount?: number;
}

export interface OrdersListResponse {
  page: number;
  limit: number;
  total: number;
  data: OrdersListItem[];
}

export const ordersService = {
  /**
   * Obtener ordenes del usuario autenticado
   */
  async getMyOrders(params?: {
    page?: number;
    limit?: number;
    orderStatus?: ApiOrderStatus;
    sort?: 'newest' | 'oldest';
  }): Promise<OrdersListResponse> {
    const response = await api.get('/users/me/orders', { params });
    return response.data as OrdersListResponse;
  },

  /**
   * Obtener orden por ID
   */
  async getOrderById(orderId: string) {
    const response = await api.get(`/users/me/orders/${orderId}`);
    return response.data;
  },
};
