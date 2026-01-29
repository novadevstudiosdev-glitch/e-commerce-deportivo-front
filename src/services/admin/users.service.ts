import type { AxiosError } from 'axios';
import api from '@/lib/api';
import type { AdminUsersListResponse, AdminUserDTO, AdminUserRole, ApiErrorShape, PatchUserPayload } from '@/types/admin';

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

export const adminUsersService = {
  async getUsers(params?: {
    page?: number;
    limit?: number;
    q?: string;
    role?: AdminUserRole | '';
    is_active?: boolean | '';
  }): Promise<ApiResult<AdminUsersListResponse>> {
    try {
      const response = await api.get<AdminUsersListResponse>('/admin/users', {
        params: {
          page: params?.page ?? 1,
          limit: params?.limit ?? 20,
          q: params?.q || undefined,
          role: params?.role || undefined,
          is_active: params?.is_active === '' ? undefined : params?.is_active,
        },
      });
      return { ok: true, data: response.data, status: response.status };
    } catch (error) {
      return parseError(error as AxiosError<ApiErrorShape> | Error);
    }
  },

  async updateUser(id: string, payload: PatchUserPayload): Promise<ApiResult<AdminUserDTO>> {
    try {
      const response = await api.patch<AdminUserDTO>(`/admin/users/${id}`, payload);
      return { ok: true, data: response.data, status: response.status };
    } catch (error) {
      return parseError(error as AxiosError<ApiErrorShape> | Error);
    }
  },
};
