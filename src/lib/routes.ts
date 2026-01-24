// ============================================
// DEFINICI�"N DE RUTAS DE LA APLICACI�"N
// ============================================

export const ROUTES = {
  // P�blicas
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: (slug: string) => `/products/${slug}`,
  CATEGORIES: (category: string) => `/categories/${category}`,
  CART: '/cart',

  // Auth
  AUTH_LOGIN: '/auth/login',
  AUTH_REGISTER: '/auth/register',

  // Protegidas - Cliente
  CHECKOUT: '/checkout',
  ACCOUNT: '/account',
  ACCOUNT_PROFILE: '/account/profile',
  ACCOUNT_ORDERS: '/account/orders',

  // Protegidas - Admin
  ADMIN: '/admin',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_OFFERS: '/admin/offers',
  ADMIN_STATS: '/admin/stats',
};

export const PUBLIC_ROUTES = [
  ROUTES.HOME,
  ROUTES.PRODUCTS,
  ROUTES.AUTH_LOGIN,
  ROUTES.AUTH_REGISTER,
];

export const PROTECTED_ROUTES = [
  ROUTES.ACCOUNT,
  ROUTES.CHECKOUT,
  ROUTES.ACCOUNT_PROFILE,
  ROUTES.ACCOUNT_ORDERS,
];

export const ADMIN_ROUTES = [
  ROUTES.ADMIN,
  ROUTES.ADMIN_PRODUCTS,
  ROUTES.ADMIN_ORDERS,
  ROUTES.ADMIN_OFFERS,
  ROUTES.ADMIN_STATS,
];

