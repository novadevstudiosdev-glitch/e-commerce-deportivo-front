import { useCallback } from 'react';
import { useAuthStore } from '@/store';

// ============================================
// HOOK: useAuth
// ============================================

export function useAuth() {
  const { session, isLoading, setSession, logout } = useAuthStore();

  return {
    session,
    isLoading,
    isAuthenticated: !!session?.isAuthenticated,
    isAdmin: session?.isAdmin || false,
    setSession,
    logout,
  };
}
