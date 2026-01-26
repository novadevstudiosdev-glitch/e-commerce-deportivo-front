import type { AxiosError } from 'axios';
import api from '@/lib/api';
import type {
  AdminSummaryDTO,
  ApiErrorShape,
  PaymentDTO,
  StockAlertDTO,
  TopProductDTO,
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

export const adminService = {
  async ping(): Promise<ApiResult<{ ok: boolean }>> {
    try {
      const response = await api.get<{ ok: boolean }>('/admin/ping');
      return { ok: true, data: response.data, status: response.status };
    } catch (error) {
      return parseError(error as AxiosError<ApiErrorShape> | Error);
    }
  },

  async getSummary(): Promise<ApiResult<AdminSummaryDTO>> {
    try {
      const response = await api.get<AdminSummaryDTO>('/admin/stats/summary');
      return { ok: true, data: response.data, status: response.status };
    } catch (error) {
      return parseError(error as AxiosError<ApiErrorShape> | Error);
    }
  },

  async getTopProducts(): Promise<ApiResult<TopProductDTO[]>> {
    try {
      const response = await api.get<TopProductDTO[]>('/admin/stats/top-products');
      return { ok: true, data: response.data, status: response.status };
    } catch (error) {
      return parseError(error as AxiosError<ApiErrorShape> | Error);
    }
  },

  async getPayments(): Promise<ApiResult<PaymentDTO[]>> {
    try {
      const response = await api.get<PaymentDTO[]>('/admin/payments');
      return { ok: true, data: response.data, status: response.status };
    } catch (error) {
      return parseError(error as AxiosError<ApiErrorShape> | Error);
    }
  },

  async getPendingPayments(): Promise<ApiResult<PaymentDTO[]>> {
    try {
      const response = await api.get<PaymentDTO[]>('/admin/payments/pending');
      return { ok: true, data: response.data, status: response.status };
    } catch (error) {
      return parseError(error as AxiosError<ApiErrorShape> | Error);
    }
  },

  async getStockAlerts(): Promise<ApiResult<StockAlertDTO[]>> {
    try {
      const response = await api.get<StockAlertDTO[]>('/admin/stock-alerts');
      return { ok: true, data: response.data, status: response.status };
    } catch (error) {
      return parseError(error as AxiosError<ApiErrorShape> | Error);
    }
  },
};
