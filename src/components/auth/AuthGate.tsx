'use client';

import type { ReactNode } from 'react';
import { useAuthStore } from '@/store';

type AuthGateProps = {
  children: ReactNode;
};

export default function AuthGate({ children }: AuthGateProps) {
  const { isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-white">
        <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6">
          <div className="rounded-2xl border border-black/5 bg-white px-6 py-4 text-sm font-semibold text-slate-700 shadow-sm">
            Cargando sesión...
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
