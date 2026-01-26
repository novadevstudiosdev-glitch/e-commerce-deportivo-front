import api from '@/lib/api';

export interface UserProfileResponse {
  id: string;
  email: string;
  role: 'customer' | 'admin';
  email_verified: boolean;
  profile: {
    first_name?: string | null;
    last_name?: string | null;
    dni?: string | null;
    phone?: string | null;
    date_of_birth?: string | null;
    avatar_url?: string | null;
  } | null;
}

export interface UpdateMePayload {
  email?: string;
  first_name?: string;
  last_name?: string;
  dni?: string | null;
  phone?: string | null;
  date_of_birth?: string | null;
  avatar_url?: string | null;
}

export const userService = {
  async getMe(): Promise<UserProfileResponse> {
    const response = await api.get('/users/me');
    return response.data as UserProfileResponse;
  },

  async updateMe(payload: UpdateMePayload): Promise<UserProfileResponse> {
    const response = await api.put('/users/me', payload);
    return response.data as UserProfileResponse;
  },
};
