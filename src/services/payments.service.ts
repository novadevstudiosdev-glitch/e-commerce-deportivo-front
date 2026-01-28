import api from '@/lib/api';

export type MercadoPagoPreferenceResponse = {
  preferenceId?: string;
  initPoint?: string | null;
  sandboxInitPoint?: string | null;
  init_point?: string | null;
  sandbox_init_point?: string | null;
};

export const paymentsService = {
  async createMercadoPagoPreference(orderId: string) {
    return api.post<MercadoPagoPreferenceResponse>('/payments/mercadopago/preference', { orderId });
  },
};
