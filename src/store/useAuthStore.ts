import { create } from 'zustand';
import { Session } from '@/types';

// ============================================
// STORE DE AUTENTICACIÓN
// ============================================

interface AuthStore {
  session: Session | null;
  isLoading: boolean;
  setSession: (session: Session | null) => void;
  setIsLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  session: null,
  isLoading: false,

  setSession: (session: Session | null) => {
    set({ session });
  },

  setIsLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  logout: () => {
    set({ session: null });
  },
}));
