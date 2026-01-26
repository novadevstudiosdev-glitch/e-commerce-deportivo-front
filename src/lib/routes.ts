// ============================================
// DEFINICION DE RUTAS DE LA APLICACION
// ============================================

export const ROUTES = {
  // Publicas
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: (slug: string) => `/products/${slug}`,
  CATEGORIES: (category: string) => `/categories/${category}`,
  CART: '/cart',

  // Auth
  AUTH_LOGIN: '/auth/login',
  AUTH_REGISTER: '/auth/register',

  // Dashboard (nuevo)
  DASHBOARD: '/dashboard',
  DASHBOARD_ADMIN: '/dashboard/admin',
  DASHBOARD_PROFILE: '/dashboard/profile',
  DASHBOARD_ORDERS: '/dashboard/orders',
  DASHBOARD_FAVORITES: '/dashboard/favorites',
  DASHBOARD_SETTINGS: '/dashboard/settings',

  // Protegidas - Cliente (legacy)
  CHECKOUT: '/checkout',
  ACCOUNT: '/account',
  ACCOUNT_PROFILE: '/account/profile',
  ACCOUNT_ORDERS: '/account/orders',
  ACCOUNT_ADDRESSES: '/account/addresses',
  ACCOUNT_PREFERENCES: '/account/preferences',

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
  ROUTES.ACCOUNT_ADDRESSES,
  ROUTES.ACCOUNT_PREFERENCES,
  ROUTES.DASHBOARD,
  ROUTES.DASHBOARD_ADMIN,
  ROUTES.DASHBOARD_PROFILE,
  ROUTES.DASHBOARD_ORDERS,
  ROUTES.DASHBOARD_FAVORITES,
  ROUTES.DASHBOARD_SETTINGS,
];

export const ADMIN_ROUTES = [
  ROUTES.ADMIN,
  ROUTES.ADMIN_PRODUCTS,
  ROUTES.ADMIN_ORDERS,
  ROUTES.ADMIN_OFFERS,
  ROUTES.ADMIN_STATS,
  ROUTES.DASHBOARD_ADMIN,
];
