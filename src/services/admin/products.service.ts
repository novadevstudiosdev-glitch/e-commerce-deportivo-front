import type { AxiosError } from 'axios';
import api from '@/lib/api';
import type { AdminProductDTO, AdminProductForm, ApiErrorShape } from '@/types/admin';

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

export const adminProductsService = {
  async list(): Promise<ApiResult<AdminProductDTO[]>> {
    try {
      const response = await api.get<AdminProductDTO[]>('/admin/products');
      return { ok: true, data: response.data, status: response.status };
    } catch (error) {
      return parseError(error as AxiosError<ApiErrorShape> | Error);
    }
  },

  async getById(id: string): Promise<ApiResult<AdminProductDTO>> {
    try {
      const response = await api.get<AdminProductDTO>(`/admin/products/${id}`);
      return { ok: true, data: response.data, status: response.status };
    } catch (error) {
      return parseError(error as AxiosError<ApiErrorShape> | Error);
    }
  },

  async create(payload: AdminProductForm): Promise<ApiResult<AdminProductDTO>> {
    try {
      const response = await api.post<AdminProductDTO>('/admin/products', payload);
      return { ok: true, data: response.data, status: response.status };
    } catch (error) {
      return parseError(error as AxiosError<ApiErrorShape> | Error);
    }
  },

  async update(id: string, payload: AdminProductForm): Promise<ApiResult<AdminProductDTO>> {
    try {
      const response = await api.put<AdminProductDTO>(`/admin/products/${id}`, payload);
      return { ok: true, data: response.data, status: response.status };
    } catch (error) {
      return parseError(error as AxiosError<ApiErrorShape> | Error);
    }
  },

  async deactivate(id: string): Promise<ApiResult<{ ok: boolean }>> {
    try {
      const response = await api.delete<{ ok: boolean }>(`/admin/products/${id}`);
      return { ok: true, data: response.data, status: response.status };
    } catch (error) {
      return parseError(error as AxiosError<ApiErrorShape> | Error);
    }
  },
};
