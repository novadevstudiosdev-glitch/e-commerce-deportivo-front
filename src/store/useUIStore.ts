import { create } from 'zustand';

// ============================================
// STORE DE UI
// ============================================

interface UIStore {
  offerModalShown: boolean;
  cartDrawerOpen: boolean;
  mobileMenuOpen: boolean;
  setOfferModalShown: (shown: boolean) => void;
  setCartDrawerOpen: (open: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
  toggleCartDrawer: () => void;
  toggleMobileMenu: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  offerModalShown: false,
  cartDrawerOpen: false,
  mobileMenuOpen: false,

  setOfferModalShown: (shown: boolean) => {
    set({ offerModalShown: shown });
  },

  setCartDrawerOpen: (open: boolean) => {
    set({ cartDrawerOpen: open });
  },

  setMobileMenuOpen: (open: boolean) => {
    set({ mobileMenuOpen: open });
  },

  toggleCartDrawer: () => {
    set((state) => ({ cartDrawerOpen: !state.cartDrawerOpen }));
  },

  toggleMobileMenu: () => {
    set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen }));
  },
}));
