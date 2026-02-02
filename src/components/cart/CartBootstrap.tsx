'use client';

import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/store';
import { useCartStore } from '@/store/useCartStore';

const CART_STORAGE_PREFIX = 'cart-storage';

function getCartStorageKey(userId: string | null | undefined) {
  return `${CART_STORAGE_PREFIX}:${userId || 'guest'}`;
}

export default function CartBootstrap() {
  const { session } = useAuthStore();
  const lastKey = useRef<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const legacyKey = CART_STORAGE_PREFIX;
    const guestKey = getCartStorageKey(null);
    if (!localStorage.getItem(guestKey)) {
      const legacyValue = localStorage.getItem(legacyKey);
      if (legacyValue) {
        localStorage.setItem(guestKey, legacyValue);
        localStorage.removeItem(legacyKey);
      }
    }

    const nextKey = getCartStorageKey(session?.user?.id);
    if (lastKey.current === nextKey) return;
    lastKey.current = nextKey;

    const persistApi = (useCartStore as typeof useCartStore & {
      persist?: { setOptions?: (options: { name: string }) => void; rehydrate?: () => void };
    }).persist;

    if (persistApi?.setOptions) {
      persistApi.setOptions({ name: nextKey });
      persistApi.rehydrate?.();
    }
  }, [session?.user?.id]);

  return null;
}
