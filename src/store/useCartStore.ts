import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { CartItem, Product } from '@/types';
import type { Coupon } from '@/lib/coupons';
import { applyCoupon } from '@/lib/coupons';

// ============================================
// STORE DE CARRITO
// ============================================

interface CartStore {
  items: CartItem[];
  appliedCoupon: Coupon | null;
  addItem: (product: Product, quantity: number, size?: string | null) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (coupon: Coupon) => void;
  removeCoupon: () => void;
  getSubtotal: () => number;
  getDiscountAmount: () => number;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      appliedCoupon: null,

      addItem: (product: Product, quantity: number, size?: string | null) => {
        set((state) => {
          const normalizedSize = size?.trim() || null;
          const existingItem = state.items.find(
            (item) =>
              item.product.id === product.id &&
              (item.size?.trim() || null) === normalizedSize
          );
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.id === existingItem.id ? { ...item, quantity: item.quantity + quantity } : item
              ),
            };
          }
          return {
            items: [
              ...state.items,
              {
                id: `cart-${product.id}-${Date.now()}`,
                product,
                quantity,
                size: normalizedSize,
                addedAt: new Date(),
              },
            ],
          };
        });
      },

      removeItem: (itemId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        }));
      },

      updateQuantity: (itemId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [], appliedCoupon: null });
      },

      applyCoupon: (coupon: Coupon) => {
        set({ appliedCoupon: coupon });
      },

      removeCoupon: () => {
        set({ appliedCoupon: null });
      },

      getSubtotal: () => {
        return get().items.reduce((total, item) => total + item.product.price * item.quantity, 0);
      },

      getDiscountAmount: () => {
        const subtotal = get().items.reduce((total, item) => total + item.product.price * item.quantity, 0);
        const coupon = get().appliedCoupon;
        if (!coupon) return 0;
        return applyCoupon(subtotal, coupon).discount;
      },

      getTotalPrice: () => {
        const subtotal = get().items.reduce((total, item) => total + item.product.price * item.quantity, 0);
        const coupon = get().appliedCoupon;
        if (!coupon) return subtotal;
        return applyCoupon(subtotal, coupon).total;
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage:guest',
      version: 1,
      storage:
        typeof window !== 'undefined'
          ? createJSONStorage(() => localStorage)
          : undefined,
      partialize: (state) => ({
        items: state.items,
        appliedCoupon: state.appliedCoupon,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state?.items) return;
        state.items = state.items.map((item: CartItem) => ({
          ...item,
          addedAt: item.addedAt ? new Date(item.addedAt) : new Date(),
        }));
      },
    }
  )
);
