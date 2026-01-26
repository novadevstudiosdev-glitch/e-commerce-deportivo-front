import type { AxiosError } from 'axios';
import api from '@/lib/api';
import type { ApiErrorShape, CouponDTO, CouponForm } from '@/types/admin';

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

export const adminCouponsService = {
  async list(): Promise<ApiResult<CouponDTO[]>> {
    try {
      const response = await api.get<CouponDTO[]>('/admin/coupons');
      return { ok: true, data: response.data, status: response.status };
    } catch (error) {
      return parseError(error as AxiosError<ApiErrorShape> | Error);
    }
  },

  async create(payload: CouponForm): Promise<ApiResult<CouponDTO>> {
    try {
      const response = await api.post<CouponDTO>('/admin/coupons', payload);
      return { ok: true, data: response.data, status: response.status };
    } catch (error) {
      return parseError(error as AxiosError<ApiErrorShape> | Error);
    }
  },

  async update(id: string, payload: CouponForm): Promise<ApiResult<CouponDTO>> {
    try {
      const response = await api.put<CouponDTO>(`/admin/coupons/${id}`, payload);
      return { ok: true, data: response.data, status: response.status };
    } catch (error) {
      return parseError(error as AxiosError<ApiErrorShape> | Error);
    }
  },

  async deactivate(id: string): Promise<ApiResult<{ ok: boolean }>> {
    try {
      const response = await api.delete<{ ok: boolean }>(`/admin/coupons/${id}`);
      return { ok: true, data: response.data, status: response.status };
    } catch (error) {
      return parseError(error as AxiosError<ApiErrorShape> | Error);
    }
  },
};
