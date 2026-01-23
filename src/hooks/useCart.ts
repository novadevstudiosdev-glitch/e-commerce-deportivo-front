import { useCallback } from 'react';
import { useCartStore } from '@/store';

// ============================================
// HOOK: useCart
// ============================================

export function useCart() {
  const { items, addItem, removeItem, updateQuantity, clearCart, getTotalPrice, getTotalItems } =
    useCartStore();

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalPrice: getTotalPrice(),
    totalItems: getTotalItems(),
  };
}
