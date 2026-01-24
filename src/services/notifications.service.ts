import api from '@/lib/api';

// ============================================
// SERVICIOS DE NOTIFICACIONES
// ============================================

export const notificationsService = {
  /**
   * Enviar email de confirmación de compra
   */
  async sendOrderConfirmationEmail(email: string, orderId: string): Promise<void> {
    // TODO: Implementar servicio de email (SendGrid, Resend, etc.)
    // return api.post('/notifications/send-email', {
    //   type: 'order-confirmation',
    //   email,
    //   orderId,
    // });
    console.log('Sending order confirmation email:', { email, orderId });
  },

  /**
   * Enviar notificación de estado de orden
   */
  async sendOrderStatusNotification(email: string, orderId: string, status: string): Promise<void> {
    // TODO: Implementar servicio de email
    // return api.post('/notifications/send-email', {
    //   type: 'order-status',
    //   email,
    //   orderId,
    //   status,
    // });
    console.log('Sending order status notification:', { email, orderId, status });
  },

  /**
   * Notificar a vendedor sobre nueva orden
   */
  async notifySeller(orderId: string, orderDetails: any): Promise<void> {
    // TODO: Implementar servicio de notificación
    // return api.post('/notifications/notify-seller', { orderId, orderDetails });
    console.log('Notifying seller about order:', { orderId, orderDetails });
  },

  /**
   * Enviar alerta de bajo stock
   */
  async sendLowStockAlert(productId: string, currentStock: number): Promise<void> {
    // TODO: Implementar servicio de notificación
    // return api.post('/notifications/low-stock-alert', { productId, currentStock });
    console.log('Sending low stock alert:', { productId, currentStock });
  },
};

