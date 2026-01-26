import api from '@/lib/api';

void api;

// ============================================
// SERVICIOS DE ENVÍO
// ============================================

type ShippingOption = {
  id: string;
  label: string;
  price: number;
  etaDays?: number;
};

type TrackingStatus = {
  status: string;
  updatedAt?: string;
  details?: string;
};

export const shippingService = {
  /**
   * Calcular costo de envio
   */
  async calculateShippingCost(postalCode: string, weight: number): Promise<number> {
    // TODO: Integrar con API de env�o externa
    // return api.post('/shipping/calculate', { postalCode, weight });
    console.log('Calculating shipping cost:', { postalCode, weight });
    return 0;
  },

  /**
   * Obtener opciones de env�o
   */
  async getShippingOptions(postalCode: string): Promise<ShippingOption[]> {
    // TODO: Integrar con API de env�o externa
    // return api.get('/shipping/options', { params: { postalCode } });
    console.log('Fetching shipping options for postal code:', postalCode);
    return [];
  },

  /**
   * Obtener estado de seguimiento
   */
  async getTrackingStatus(trackingNumber: string): Promise<TrackingStatus | null> {
    // TODO: Integrar con API de env�o externa
    // return api.get(`/shipping/track/${trackingNumber}`);
    console.log('Fetching tracking status:', trackingNumber);
    return null;
  },

  /**
   * Crear env�o
   */
  async createShipment(
    orderId: string,
    shippingOption: string
  ): Promise<{ trackingNumber: string }> {
    // TODO: Integrar con API de env�o externa
    // return api.post('/shipping/create', { orderId, shippingOption });
    console.log('Creating shipment:', { orderId, shippingOption });
    return { trackingNumber: '' };
  },
};
