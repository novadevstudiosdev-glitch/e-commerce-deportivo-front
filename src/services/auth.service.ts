import type { AxiosError } from 'axios';
import api from '@/lib/api';
import {
  AUTH_TOKEN_KEY,
  MIN_PASSWORD_LENGTH,
  WELCOME_COUPON_CODE,
  WELCOME_COUPON_STORAGE_KEY,
  WELCOME_COUPON_USED_KEY,
} from '@/lib/constants';
import { isValidEmail, isValidPassword } from '@/lib/validators';
import type { LoginCredentials, RegisterData, Session, UserProfile, UserRole } from '@/types';

// ============================================
// SERVICIOS DE AUTENTICACION
// ============================================

type AuthProfilePayload = {
  first_name?: string;
  last_name?: string;
  phone?: string | null;
};

type AuthUserPayload = {
  id: string;
  email: string;
  role: string;
  profile?: AuthProfilePayload;
};

type AuthLoginResponse = {
  access_token?: string;
};

type AuthErrorResponse = {
  error?: string;
  message?: string;
};

const setToken = (token: string | null) => {
  if (typeof window === 'undefined') return;
  if (token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }
};

const normalizeRole = (role?: string | null): UserRole | undefined => {
  const normalized = (role || '').toLowerCase();
  if (!normalized) return undefined;
  if (normalized === 'customer' || normalized === 'user') return 'usuario';
  if (normalized === 'seller' || normalized === 'vendedor') return 'vendedor';
  if (normalized === 'admin') return 'admin';
  return normalized as UserRole;
};

const mapSession = (data: AuthUserPayload | null, isAuthenticated: boolean): Session => {
  const profile = data?.profile;
  const role = normalizeRole(data?.role);
  const user: UserProfile = {
    id: data?.id ?? '',
    email: data?.email ?? '',
    firstName: profile?.first_name ?? '',
    lastName: profile?.last_name ?? '',
    phone: profile?.phone ?? undefined,
    createdAt: new Date(),
  };

  return {
    user,
    role,
    isAdmin: role === 'admin',
    isAuthenticated,
  };
};

const getErrorMessage = (error: AxiosError<AuthErrorResponse> | Error) => {
  if ('isAxiosError' in error && error.isAxiosError) {
    const status = error.response?.status;
    if (status === 409) return 'Email ya registrado';
    if (status === 400) return 'Datos invalidos';
    if (status && status >= 500) return 'No se pudo crear la cuenta';
    return error.response?.data?.error || error.response?.data?.message || 'Error inesperado';
  }
  return error.message || 'Error inesperado';
};

async function fetchSessionFromToken(): Promise<Session> {
  const meResponse = await api.get<AuthUserPayload>('/users/me');
  return mapSession(meResponse.data, true);
}

export const authService = {
  /**
   * Login con credenciales
   */
  async login(credentials: LoginCredentials): Promise<Session> {
    try {
      const response = await api.post<AuthLoginResponse>('/auth/login', credentials);
      const token = response.data?.access_token;

      if (!token) {
        throw new Error('No token returned from login');
      }

      setToken(token);
      if (typeof window !== 'undefined') {
        const hasWelcome = localStorage.getItem(WELCOME_COUPON_STORAGE_KEY);
        const usedWelcome = localStorage.getItem(WELCOME_COUPON_USED_KEY);
        if (!hasWelcome && usedWelcome !== 'true') {
          localStorage.setItem(WELCOME_COUPON_STORAGE_KEY, WELCOME_COUPON_CODE);
          localStorage.setItem(WELCOME_COUPON_USED_KEY, 'false');
        }
      }
      return fetchSessionFromToken();
    } catch (error) {
      const message = getErrorMessage(error as AxiosError<AuthErrorResponse> | Error);
      const normalized = message.toLowerCase();
      if (normalized.includes('email not verified') || normalized.includes('verificado')) {
        throw new Error('Tu email no esta verificado. Revisa tu correo para activar la cuenta.');
      }
      throw new Error(message);
    }
  },

  /**
   * Registrarse
   */
  async register(data: RegisterData): Promise<Session> {
    if (!isValidEmail(data.email)) {
      throw new Error('Email inválido');
    }
    if (!isValidPassword(data.password, MIN_PASSWORD_LENGTH)) {
      throw new Error(`La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`);
    }

    try {
      const response = await api.post<AuthUserPayload>('/auth/register', data);
      return mapSession(response.data, false);
    } catch (error) {
      const message = getErrorMessage(error as AxiosError<AuthErrorResponse> | Error);
      throw new Error(message);
    }
  },

  /**
   * Reenviar verificacion de email
   */
  async resendVerification(email: string): Promise<void> {
    if (!isValidEmail(email)) {
      throw new Error('Email inválido');
    }
    try {
      await api.post('/auth/resend-verification', { email });
    } catch (error) {
      const message = getErrorMessage(error as AxiosError<AuthErrorResponse> | Error);
      throw new Error(message);
    }
  },

  /**
   * Login con Google
   */
  async loginWithGoogle(token?: string): Promise<Session> {
    if (!token) {
      throw new Error('Missing Google token');
    }

    setToken(token);
    return fetchSessionFromToken();
  },

  /**
   * Obtener sesion actual
   */
  async getSession(): Promise<Session | null> {
    try {
      return await fetchSessionFromToken();
    } catch (error) {
      setToken(null);
      return null;
    }
  },

  /**
   * Logout
   */
  async logout(): Promise<void> {
    setToken(null);
  },
};
