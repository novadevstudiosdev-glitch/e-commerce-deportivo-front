'use client';

import { ReactNode } from 'react';
import { useAuth } from '@/hooks';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/routes';

// ============================================
// GUARD: requireAuth
// ============================================

interface RequireAuthProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function RequireAuth({ children, fallback }: RequireAuthProps) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  if (!isAuthenticated) {
    if (fallback) return fallback;
    router.push(ROUTES.AUTH_LOGIN);
    return null;
  }

  return children;
}
