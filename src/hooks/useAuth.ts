import { useAuthStore } from '@/store';

// ============================================
// HOOK: useAuth
// ============================================

export function useAuth() {
  const { session, isLoading, setSession, logout } = useAuthStore();
  const role = session?.role;
  const isSeller = role === 'vendedor';
  const canAccessAdmin = role === 'admin' || role === 'vendedor';

  return {
    session,
    isLoading,
    isAuthenticated: !!session?.isAuthenticated,
    isAdmin: session?.isAdmin || false,
    role,
    isSeller,
    canAccessAdmin,
    setSession,
    logout,
  };
}
