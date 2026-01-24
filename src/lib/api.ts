import axios, { AxiosInstance } from "axios";
import { AUTH_TOKEN_KEY } from "@/lib/constants";

// ============================================
// INSTANCIA AXIOS BASE
// ============================================

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Interceptor para agregar token de autenticacion
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de respuesta para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // TODO: Manejar errores globales (401, 403, etc.)
    return Promise.reject(error);
  }
);

export default api;
