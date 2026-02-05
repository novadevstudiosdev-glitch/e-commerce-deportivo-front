import type { AxiosError } from 'axios';
import api from '@/lib/api';
import type {
  ApiErrorShape,
  CatalogBrand,
  CatalogCategory,
  CatalogColor,
  CatalogSize,
  CatalogSport,
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

export const adminCatalogService = {
  async listSizes(type?: 'ropa' | 'calzado' | 'unico'): Promise<ApiResult<CatalogSize[]>> {
    try {
      const response = await api.get<CatalogSize[]>('/admin/catalog/sizes', {
        params: type ? { type } : undefined,
      });
      return { ok: true, data: response.data, status: response.status };
    } catch (error) {
      return parseError(error as AxiosError<ApiErrorShape> | Error);
    }
  },

  async listColors(): Promise<ApiResult<CatalogColor[]>> {
    try {
      const response = await api.get<CatalogColor[]>('/admin/catalog/colors');
      return { ok: true, data: response.data, status: response.status };
    } catch (error) {
      return parseError(error as AxiosError<ApiErrorShape> | Error);
    }
  },

  async listCategories(): Promise<ApiResult<CatalogCategory[]>> {
    try {
      const response = await api.get<CatalogCategory[]>('/admin/catalog/categories');
      return { ok: true, data: response.data, status: response.status };
    } catch (error) {
      return parseError(error as AxiosError<ApiErrorShape> | Error);
    }
  },

  async listBrands(): Promise<ApiResult<CatalogBrand[]>> {
    try {
      const response = await api.get<CatalogBrand[]>('/admin/catalog/brands');
      return { ok: true, data: response.data, status: response.status };
    } catch (error) {
      return parseError(error as AxiosError<ApiErrorShape> | Error);
    }
  },

  async listSports(): Promise<ApiResult<CatalogSport[]>> {
    try {
      const response = await api.get<CatalogSport[]>('/admin/catalog/sports');
      return { ok: true, data: response.data, status: response.status };
    } catch (error) {
      return parseError(error as AxiosError<ApiErrorShape> | Error);
    }
  },
};
