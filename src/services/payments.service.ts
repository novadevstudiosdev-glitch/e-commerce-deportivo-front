import api from '@/lib/api';

export type MercadoPagoPreferenceResponse = {
  preferenceId?: string;
  initPoint?: string | null;
  sandboxInitPoint?: string | null;
  init_point?: string | null;
  sandbox_init_point?: string | null;
};

export type MercadoPagoPaymentResponse = {
  paymentId: string | null;
  status: string;
  status_detail?: string | null;
  next_action?: unknown;
};

export type MercadoPagoPaymentRequest = {
  orderId: string;
  token: string;
  payment_method_id: string;
  installments: number;
  issuer_id?: string | number;
  payer: {
    email: string;
  };
};

export const paymentsService = {
  async createMercadoPagoPreference(orderId: string) {
    return api.post<MercadoPagoPreferenceResponse>('/payments/mercadopago/preference', { orderId });
  },
  async createMercadoPagoPayment(payload: MercadoPagoPaymentRequest) {
    return api.post<MercadoPagoPaymentResponse>('/payments/mercadopago', payload);
  },
};
