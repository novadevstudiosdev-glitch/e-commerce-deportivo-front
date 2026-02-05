'use client';

import { useEffect, useRef } from 'react';
import { authService } from '@/services';
import { useAuthStore } from '@/store';
import { AUTH_TOKEN_KEY } from '@/lib/constants';

export default function AuthBootstrap() {
  const hasBootstrapped = useRef(false);
  const { setSession, setIsLoading } = useAuthStore();

  useEffect(() => {
    if (hasBootstrapped.current) return;
    hasBootstrapped.current = true;

    const bootstrap = async () => {
      if (typeof window === 'undefined') {
        return;
      }
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      if (!token) {
        setSession(null);
        return;
      }
      // Optimistic session to avoid logout flash while validating token
      setSession({
        user: {
          id: '',
          email: '',
          firstName: '',
          lastName: '',
          createdAt: new Date(),
        },
        isAdmin: false,
        isAuthenticated: true,
      });
      try {
        const session = await authService.getSession();
        setSession(session);
      } catch {
        setSession(null);
      }
    };

    void bootstrap();
  }, [setIsLoading, setSession]);

  return null;
}
