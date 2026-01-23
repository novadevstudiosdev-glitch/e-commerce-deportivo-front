import api from '@/lib/api';
import { LoginCredentials, RegisterData, Session } from '@/types';

// ============================================
// SERVICIOS DE AUTENTICACIÓN
// ============================================

export const authService = {
  /**
   * Login con credenciales
   */
  async login(credentials: LoginCredentials): Promise<Session> {
    // TODO: Implementar llamada real
    // return api.post('/auth/login', credentials);
    console.log('Login attempt:', credentials);
    return {
      user: {
        id: '',
        email: '',
        firstName: '',
        lastName: '',
        createdAt: new Date(),
      },
      isAdmin: false,
      isAuthenticated: false,
    };
  },

  /**
   * Registrarse
   */
  async register(data: RegisterData): Promise<Session> {
    // TODO: Implementar llamada real
    // return api.post('/auth/register', data);
    console.log('Register attempt:', data);
    return {
      user: {
        id: '',
        email: '',
        firstName: '',
        lastName: '',
        createdAt: new Date(),
      },
      isAdmin: false,
      isAuthenticated: false,
    };
  },

  /**
   * Login con Google
   */
  async loginWithGoogle(token: string): Promise<Session> {
    // TODO: Implementar llamada real
    // return api.post('/auth/google', { token });
    console.log('Google login attempt:', token);
    return {
      user: {
        id: '',
        email: '',
        firstName: '',
        lastName: '',
        createdAt: new Date(),
      },
      isAdmin: false,
      isAuthenticated: false,
    };
  },

  /**
   * Obtener sesión actual
   */
  async getSession(): Promise<Session | null> {
    // TODO: Implementar llamada real
    // return api.get('/auth/session');
    console.log('Fetching current session');
    return null;
  },

  /**
   * Logout
   */
  async logout(): Promise<void> {
    // TODO: Implementar llamada real
    // return api.post('/auth/logout');
    console.log('Logout');
  },
};
