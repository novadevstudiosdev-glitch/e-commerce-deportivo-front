// ============================================
// CONSTANTES DE LA APLICACI�"N
// ============================================

export const CATEGORIES = [
  { id: '1', name: 'Running', slug: 'running' },
  { id: '2', name: 'Nataci�n', slug: 'natacion' },
  { id: '3', name: 'F�tbol', slug: 'futbol' },
  { id: '4', name: 'Rugby', slug: 'rugby' },
  { id: '5', name: 'Hockey', slug: 'hockey' },
  { id: '6', name: 'Tenis', slug: 'tenis' },
  { id: '7', name: 'Ciclismo', slug: 'ciclismo' },
  { id: '8', name: 'B�squetbol', slug: 'basketbol' },
];

export const SORT_OPTIONS = [
  { value: 'newest', label: 'M�s nuevo' },
  { value: 'price-asc', label: 'Menor precio' },
  { value: 'price-desc', label: 'Mayor precio' },
  { value: 'rating', label: 'Mayor valoraci�n' },
];

export const ITEMS_PER_PAGE = 12;

export const ORDER_STATUS_LABELS = {
  pending: 'Pendiente',
  processing: 'En proceso',
  shipped: 'Enviado',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
};

export const DEFAULT_AVATAR = '/images/default-avatar.png';
export const LOGO_URL = '/logo.png';

export const TOAST_DURATION = 3000;

export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_LENGTH = 128;

export const AUTH_TOKEN_KEY = 'auth_token';

