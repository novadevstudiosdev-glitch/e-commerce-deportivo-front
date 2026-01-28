// ============================================
// UTILIDADES GENERALES
// ============================================

/**
 * Formatea un número como moneda
 */
export function formatCurrency(amount: number, currency: string = 'ARS'): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

/**
 * Formatea una fecha
 */
export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

/**
 * Formatea una fecha y hora
 */
export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

/**
 * Valida un email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida un DNI argentino
 */
export function isValidDNI(dni: string): boolean {
  const dniNumber = parseInt(dni.replace(/\D/g, ''), 10);
  return dniNumber > 0 && dniNumber < 100000000;
}

/**
 * Capitaliza la primera letra
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Slugifica una cadena
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function buildProductSlug(name: string, id: string): string {
  const base = slugify(name);
  return base ? `${base}-${id}` : id;
}

export function extractProductId(slug: string): string | null {
  const match = slug.match(/[0-9a-fA-F-]{36}$/);
  return match ? match[0] : null;
}

/**
 * Calcula el descuento en porcentaje
 */
export function calculateDiscount(originalPrice: number, currentPrice: number): number {
  if (originalPrice <= currentPrice) return 0;
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
}

/**
 * Normalize product image values into usable URLs.
 * Supports arrays, JSON strings, and comma-separated strings.
 */
export function normalizeImageList(
  images?: string[] | string | null,
  bucket: string = 'products'
): string[] {
  if (!images) return [];
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const resolveUrl = (raw: string) => {
    const value = raw?.trim();
    if (!value) return '';
    if (value.startsWith('http://') || value.startsWith('https://')) {
      const isUnsplash =
        value.includes('source.unsplash.com') || value.includes('images.unsplash.com');
      return isUnsplash ? `/image-proxy?url=${encodeURIComponent(value)}` : value;
    }
    if (!supabaseUrl) return value;
    const path = value.startsWith('/') ? value.slice(1) : value;
    return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
  };

  if (Array.isArray(images)) {
    return images.map(resolveUrl).filter(Boolean);
  }

  const raw = images.trim();
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.map(resolveUrl).filter(Boolean);
    }
  } catch {
    // not JSON, fall back to split
  }

  return raw
    .split(',')
    .map((entry) => resolveUrl(entry))
    .filter(Boolean);
}

/**
 * Genera un ID único
 */
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

/**
 * Agrupa items por una propiedad
 */
export function groupBy<T>(items: T[], key: keyof T): Record<string, T[]> {
  return items.reduce(
    (acc, item) => {
      const groupKey = String(item[key]);
      if (!acc[groupKey]) acc[groupKey] = [];
      acc[groupKey].push(item);
      return acc;
    },
    {} as Record<string, T[]>
  );
}

