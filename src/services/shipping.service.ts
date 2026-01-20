import api from '@/lib/api';

// ============================================
// SERVICIOS DE ENVÍO
// ============================================

export const shippingService = {
  /**
   * Calcular costo de envío
   */
  async calculateShippingCost(postalCode: string, weight: number): Promise<number> {
    // TODO: Integrar con API de envío externa
    // return api.post('/shipping/calculate', { postalCode, weight });
    console.log('Calculating shipping cost:', { postalCode, weight });
    return 0;
  },

  /**
   * Obtener opciones de envío
   */
  async getShippingOptions(postalCode: string): Promise<any[]> {
    // TODO: Integrar con API de envío externa
    // return api.get('/shipping/options', { params: { postalCode } });
    console.log('Fetching shipping options for postal code:', postalCode);
    return [];
  },

  /**
   * Obtener estado de seguimiento
   */
  async getTrackingStatus(trackingNumber: string): Promise<any> {
    // TODO: Integrar con API de envío externa
    // return api.get(`/shipping/track/${trackingNumber}`);
    console.log('Fetching tracking status:', trackingNumber);
    return null;
  },

  /**
   * Crear envío
   */
  async createShipment(
    orderId: string,
    shippingOption: string
  ): Promise<{ trackingNumber: string }> {
    // TODO: Integrar con API de envío externa
    // return api.post('/shipping/create', { orderId, shippingOption });
    console.log('Creating shipment:', { orderId, shippingOption });
    return { trackingNumber: '' };
  },
};
