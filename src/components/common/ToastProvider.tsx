'use client';

import { ReactNode } from 'react';

// ============================================
// TOAST PROVIDER - PLACEHOLDER
// ============================================

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  return <>{children}</>;
}

// TODO: Implementar con librería como sonner o react-hot-toast

