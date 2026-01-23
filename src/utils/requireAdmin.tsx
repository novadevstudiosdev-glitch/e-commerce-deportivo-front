'use client';

import { ReactNode } from 'react';
import { useAuth } from '@/hooks';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/routes';

// ============================================
// GUARD: requireAdmin
// ============================================

interface RequireAdminProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function RequireAdmin({ children, fallback }: RequireAdminProps) {
  const { isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();

  if (!isAuthenticated || !isAdmin) {
    if (fallback) return fallback;
    router.push(ROUTES.HOME);
    return null;
  }

  return children;
}
