import type { AxiosError } from 'axios';
import api from '@/lib/api';
import type {
  ApiErrorShape,
  PatchOrderPaymentPayload,
  PatchOrderStatusPayload,
} from '@/types/admin';

type ApiResult<T> = {
  ok: boolean;
  data?: T;
  error?: string;
  status?: number;
};

function parseError(error: AxiosError<ApiErrorShape> | Error): ApiResult<never> {
  if ('isAxiosError' in error && error.isAxiosError) {
    const status = error.response?.status;
    const message = error.response?.data?.error || error.response?.data?.message;
    return { ok: false, status, error: message || 'Error inesperado' };
  }
  return { ok: false, error: error.message || 'Error inesperado' };
}

export const adminOrdersService = {
  async updatePayment(orderId: string, payload: PatchOrderPaymentPayload): Promise<ApiResult<{ ok: boolean }>> {
    try {
      const response = await api.patch<{ ok: boolean }>(`/admin/orders/${orderId}/payment`, payload);
      return { ok: true, data: response.data, status: response.status };
    } catch (error) {
      return parseError(error as AxiosError<ApiErrorShape> | Error);
    }
  },

  async updateStatus(orderId: string, payload: PatchOrderStatusPayload): Promise<ApiResult<{ ok: boolean }>> {
    try {
      const response = await api.patch<{ ok: boolean }>(`/admin/orders/${orderId}/status`, payload);
      return { ok: true, data: response.data, status: response.status };
    } catch (error) {
      return parseError(error as AxiosError<ApiErrorShape> | Error);
    }
  },
};
