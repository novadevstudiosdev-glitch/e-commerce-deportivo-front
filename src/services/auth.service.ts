import api from "@/lib/api";
import { AUTH_TOKEN_KEY } from "@/lib/constants";
import { LoginCredentials, RegisterData, Session, UserProfile } from "@/types";

// ============================================
// SERVICIOS DE AUTENTICACION
// ============================================

const setToken = (token: string | null) => {
  if (typeof window === "undefined") return;
  if (token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }
};

const mapSession = (data: any, isAuthenticated: boolean): Session => {
  const profile = data?.profile ?? {};
  const user: UserProfile = {
    id: data?.id ?? "",
    email: data?.email ?? "",
    firstName: profile.first_name ?? "",
    lastName: profile.last_name ?? "",
    phone: profile.phone ?? undefined,
    createdAt: new Date(),
  };

  return {
    user,
    isAdmin: data?.role === "admin",
    isAuthenticated,
  };
};

async function fetchSessionFromToken(): Promise<Session> {
  const meResponse = await api.get("/users/me");
  return mapSession(meResponse.data, true);
}

export const authService = {
  /**
   * Login con credenciales
   */
  async login(credentials: LoginCredentials): Promise<Session> {
    const response = await api.post("/auth/login", credentials);
    const token = response.data?.access_token as string | undefined;

    if (!token) {
      throw new Error("No token returned from login");
    }

    setToken(token);
    return fetchSessionFromToken();
  },

  /**
   * Registrarse
   */
  async register(data: RegisterData): Promise<Session> {
    const response = await api.post("/auth/register", data);

    try {
      return await authService.login({ email: data.email, password: data.password });
    } catch (error) {
      return mapSession(response.data, false);
    }
  },

  /**
   * Login con Google
   */
  async loginWithGoogle(token?: string): Promise<Session> {
    if (!token) {
      throw new Error("Missing Google token");
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
