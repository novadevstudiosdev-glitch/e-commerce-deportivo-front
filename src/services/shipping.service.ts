import api from '@/lib/api';
import axios from 'axios';

// ============================================
// SERVICIOS DE ENVIO (EnvioPack)
// ============================================

export type ShippingQuoteRequest = {
  destinationPostalCode: string;
  weightKg: number;
  dimensionsCm: {
    length: number;
    width: number;
    height: number;
  };
  declaredValue?: number;
  deliveryType?: 'home' | 'pickup' | 'any';
  // Legacy/optional fields (to keep compatibility with older callers).
  postalCode?: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  province?: string;
};

export type ShippingQuoteOption = {
  provider: string;
  serviceName: string;
  deliveryType: 'home' | 'pickup';
  price: number;
  currency: 'ARS';
  etaText: string;
  etaDays?: number;
  estimatedDate?: string;
  raw?: unknown;
};

type TrackingStatus = {
  status: string;
  updatedAt?: string;
  details?: string;
};

export const shippingService = {
  /**
   * Cotizar envios con EnvioPack
   */
  async quoteShipping(payload: ShippingQuoteRequest): Promise<ShippingQuoteOption[]> {
    try {
      const destinationPostalCode =
        payload.destinationPostalCode ?? payload.postalCode;
      const weightKg = payload.weightKg ?? payload.weight;
      const dimensionsCm = payload.dimensionsCm ?? payload.dimensions;

      const requestPayload = {
        destinationPostalCode,
        weightKg,
        dimensionsCm,
        declaredValue: payload.declaredValue,
        deliveryType: payload.deliveryType,
      };

      if (!destinationPostalCode || !weightKg || !dimensionsCm) {
        throw new Error('Faltan datos para cotizar el envio.');
      }

      const response = await api.post<ShippingQuoteOption[]>(
        '/shipping/quote',
        requestPayload
      );
      return response.data ?? [];
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data as
          | { message?: string; error?: string; details?: string }
          | undefined;
        const message =
          data?.message ??
          data?.error ??
          data?.details ??
          error.message ??
          'No se pudo cotizar el envio.';
        throw new Error(message);
      }
      throw error;
    }
  },

  /**
   * Obtener estado de seguimiento
   */
  async getTrackingStatus(trackingNumber: string): Promise<TrackingStatus | null> {
    console.log('Fetching tracking status:', trackingNumber);
    return null;
  },

  /**
   * Crear envio
   */
  async createShipment(
    orderId: string,
    shippingOption: string
  ): Promise<{ trackingNumber: string }> {
    console.log('Creating shipment:', { orderId, shippingOption });
    return { trackingNumber: '' };
  },
};


