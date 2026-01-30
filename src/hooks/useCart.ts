import { useCartStore } from '@/store';

// ============================================
// HOOK: useCart
// ============================================

export function useCart() {
  const {
    items,
    appliedCoupon,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    applyCoupon,
    removeCoupon,
    getSubtotal,
    getDiscountAmount,
    getTotalPrice,
    getTotalItems,
  } = useCartStore();

  return {
    items,
    appliedCoupon,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    applyCoupon,
    removeCoupon,
    subtotal: getSubtotal(),
    discountAmount: getDiscountAmount(),
    totalPrice: getTotalPrice(),
    totalItems: getTotalItems(),
  };
}
