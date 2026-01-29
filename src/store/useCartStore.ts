import { create } from 'zustand';
import { CartItem, Product } from '@/types';
import type { Coupon } from '@/lib/coupons';
import { applyCoupon } from '@/lib/coupons';

// ============================================
// STORE DE CARRITO
// ============================================

interface CartStore {
  items: CartItem[];
  appliedCoupon: Coupon | null;
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (coupon: Coupon) => void;
  removeCoupon: () => void;
  getSubtotal: () => number;
  getDiscountAmount: () => number;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  appliedCoupon: null,

  addItem: (product: Product, quantity: number) => {
    set((state) => {
      const existingItem = state.items.find((item) => item.product.id === product.id);
      if (existingItem) {
        return {
          items: state.items.map((item) =>
            item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
          ),
        };
      }
      return {
        items: [
          ...state.items,
          { id: `cart-${product.id}-${Date.now()}`, product, quantity, addedAt: new Date() },
        ],
      };
    });
  },

  removeItem: (productId: string) => {
    set((state) => ({
      items: state.items.filter((item) => item.product.id !== productId),
    }));
  },

  updateQuantity: (productId: string, quantity: number) => {
    if (quantity <= 0) {
      get().removeItem(productId);
      return;
    }
    set((state) => ({
      items: state.items.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
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
}));
