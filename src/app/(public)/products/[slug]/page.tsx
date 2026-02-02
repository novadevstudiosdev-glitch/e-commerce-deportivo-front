'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Product } from '@/types';
import {
  buildProductSlug,
  calculateDiscount,
  extractProductId,
  formatCurrency,
  normalizeImageList,
  slugify,
} from '@/lib/utils';
import { useCart } from '@/hooks';
import { productsService, ProductPublic } from '@/services/products.service';
import { SizeGuideModal } from '@/components';

const TABS = ['descripcion', 'especificaciones', 'valoraciones'] as const;
type TabKey = (typeof TABS)[number];

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState('/placeholder.png');
  const [activeTab, setActiveTab] = useState<TabKey>('descripcion');
  const [related, setRelated] = useState<Product[]>([]);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [sizeError, setSizeError] = useState<string | null>(null);
  const { addItem } = useCart();

  useEffect(() => {
    let isMounted = true;

    const loadProduct = async () => {
      setIsLoading(true);
      setError(null);
      setProduct(null);

      const id = extractProductId(slug);
      if (!id) {
        setIsLoading(false);
        setError('Producto no encontrado.');
        return;
      }

      try {
        const data = await productsService.getProductById(id);
        if (!isMounted) return;
        const mapped = mapToProduct(data);
        setProduct(mapped);
        setIsLoading(false);
      } catch (err) {
        if (!isMounted) return;
        setError('No se pudo cargar el producto.');
        setIsLoading(false);
      }
    };

    loadProduct();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  useEffect(() => {
    if (product?.images?.[0]) {
      setActiveImage(product.images[0]);
    }
  }, [product?.images]);

  useEffect(() => {
    setSelectedSize(null);
    setSizeError(null);
  }, [product?.id]);

  useEffect(() => {
    let isMounted = true;

    const loadRelated = async () => {
      if (!product?.category?.name) return;

      try {
        const items = await productsService.getAllProducts({
          category: product.category.name,
          sort: 'newest',
        });

        if (!isMounted) return;
        const mapped = items.map(mapToProduct).filter((item) => item.id !== product.id).slice(0, 4);
        setRelated(mapped);
      } catch {
        if (!isMounted) return;
        setRelated([]);
      }
    };

    loadRelated();

    return () => {
      isMounted = false;
    };
  }, [product?.category?.name, product?.id]);

  const priceLabel = product ? formatCurrency(product.price) : '';
  const originalPriceLabel = product?.originalPrice ? formatCurrency(product.originalPrice) : '';
  const discountLabel = useMemo(() => {
    if (!product) return null;
    if (product.discountPercent) return `-${product.discountPercent}%`;
    if (product.originalPrice && product.originalPrice > product.price) {
      return `-${calculateDiscount(product.originalPrice, product.price)}%`;
    }
    return null;
  }, [product]);

  const ratingValue = product?.rating ?? 0;
  const reviewsCount = product?.reviews ?? 0;
  const sizes = product?.sizes ?? [];
  const colors = product?.colors ?? [];

  const maxQty = Math.max(1, Math.min(product?.stock ?? 1, 10));
  const outOfStock = (product?.stock ?? 0) <= 0;
  const requiresSize = sizes.length > 0;
  const canAddToCart = !outOfStock && (!requiresSize || Boolean(selectedSize));

  const handleQuantity = (next: number) => {
    if (!product) return;
    const safe = Math.min(Math.max(1, next), maxQty);
    setQuantity(safe);
  };

  const handleAddToCart = () => {
    if (!product) return;
    if (requiresSize && !selectedSize) {
      setSizeError('Selecciona un talle para continuar.');
      return;
    }
    setSizeError(null);
    addItem(product, quantity, selectedSize);
  };

  if (isLoading) {
    return <div className="py-12 text-center">Cargando...</div>;
  }

  if (error) {
    return <div className="py-12 text-center text-red-600">{error}</div>;
  }

  if (!product) {
    return <div className="py-12 text-center">Producto no encontrado</div>;
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <nav className="text-sm text-slate-500">
          <Link href="/" className="hover:text-slate-700">
            Inicio
          </Link>
          <span className="mx-2">/</span>
          <Link href="/products" className="hover:text-slate-700">
            Productos
          </Link>
          <span className="mx-2">/</span>
          <span className="text-slate-700">{product.name}</span>
        </nav>

        <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div>
            <div className="rounded-2xl bg-slate-100 p-4">
              <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-slate-100">
                <Image
                  src={activeImage}
                  alt={product.name}
                  width={900}
                  height={900}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  unoptimized
                  className="h-full w-full object-cover"
                  onError={(event) => {
                    const target = event.currentTarget as HTMLImageElement;
                    target.src = '/placeholder.png';
                  }}
                />
              </div>
            </div>

            {product.images.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-3">
                {product.images.map((img, index) => (
                  <button
                    key={`${product.id}-${index}`}
                    type="button"
                    onClick={() => setActiveImage(img)}
                    className={`rounded-xl border p-1 transition ${
                      activeImage === img ? 'border-sky-500' : 'border-transparent'
                    }`}
                  >
                    <div className="relative aspect-square overflow-hidden rounded-lg bg-slate-100">
                      <Image
                        src={img}
                        alt={`${product.name} ${index + 1}`}
                        width={200}
                        height={200}
                        unoptimized
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">{product.name}</h1>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-500">
              <RatingStars rating={ratingValue} />
              <span className="font-semibold text-slate-700">{ratingValue.toFixed(1)}</span>
              <span>({reviewsCount} valoraciones)</span>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="text-3xl font-bold text-sky-600">{priceLabel}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-lg text-slate-400 line-through">{originalPriceLabel}</span>
              )}
              {discountLabel && (
                <span className="rounded-full bg-lime-200 px-3 py-1 text-sm font-semibold text-lime-900">
                  {discountLabel}
                </span>
              )}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
              <span className="flex items-center gap-2 text-emerald-600">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                {outOfStock ? 'Sin stock' : 'En stock'}
              </span>
              {product.sku && <span className="text-slate-500">SKU: {product.sku}</span>}
            </div>

            {sizes.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-700">Talla</p>
                  <button
                    type="button"
                    className="text-sm text-sky-600 hover:text-sky-700"
                    onClick={() => setSizeGuideOpen(true)}
                  >
                    Guia de talles
                  </button>
                </div>
                <div className="mt-3 grid grid-cols-6 gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => {
                        setSelectedSize(size);
                        setSizeError(null);
                      }}
                      className={`rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                        selectedSize === size
                          ? 'border-sky-500 bg-sky-50 text-sky-700'
                          : 'border-slate-200 text-slate-700 hover:border-sky-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {sizeError && (
                  <p className="mt-2 text-sm font-semibold text-red-600">{sizeError}</p>
                )}
              </div>
            )}

            {colors.length > 0 && (
              <div className="mt-6">
                <p className="text-sm font-semibold text-slate-700">Color</p>
                <div className="mt-3 flex items-center gap-3">
                  {colors.map((color) => (
                    <span
                      key={color}
                      className="h-8 w-8 rounded-full border border-slate-200"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6">
              <p className="text-sm font-semibold text-slate-700">Cantidad</p>
              <div className="mt-3 inline-flex items-center rounded-lg border border-slate-200">
                <button
                  type="button"
                  onClick={() => handleQuantity(quantity - 1)}
                  className="px-4 py-2 text-lg text-slate-500 hover:text-slate-700"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="px-6 py-2 text-sm font-semibold text-slate-700">{quantity}</span>
                <button
                  type="button"
                  onClick={() => handleQuantity(quantity + 1)}
                  className="px-4 py-2 text-lg text-slate-500 hover:text-slate-700"
                  disabled={quantity >= maxQty}
                >
                  +
                </button>
              </div>
              <span className="ml-3 text-sm text-slate-400">Maximo {maxQty} unidades</span>
            </div>

            <div className="mt-6 grid gap-3">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!canAddToCart}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-sky-500 px-6 py-4 text-sm font-semibold text-white shadow hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <CartIcon className="h-5 w-5" />
                Anadir al carrito
              </button>
              <button
                type="button"
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-900 px-6 py-4 text-sm font-semibold text-slate-900"
              >
                <HeartIcon className="h-5 w-5" />
                Anadir a favoritos
              </button>
            </div>

            <div className="mt-6 space-y-2 text-sm text-slate-500">
              <InfoItem text="Envio gratis en pedidos superiores a $60.000" />
              <InfoItem text="Devoluciones gratuitas en 30 dias" />
              <InfoItem text="Garantia de calidad de 2 anos" />
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-200 pt-8">
          <div className="flex flex-wrap gap-6 text-sm font-semibold text-slate-500">
            {TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`pb-2 transition ${
                  activeTab === tab
                    ? 'border-b-2 border-sky-500 text-sky-600'
                    : 'border-b-2 border-transparent hover:text-slate-700'
                }`}
              >
                {tab === 'descripcion'
                  ? 'Descripcion'
                  : tab === 'especificaciones'
                    ? 'Especificaciones'
                    : 'Valoraciones'}
              </button>
            ))}
          </div>

          <div className="mt-6 text-sm text-slate-600">
            {activeTab === 'descripcion' && (
              <div className="space-y-4">
                <p>{product.description || 'Sin descripcion disponible.'}</p>
              </div>
            )}

            {activeTab === 'especificaciones' && (
              <div className="space-y-3">
                {product.specs && product.specs.length > 0 ? (
                  <div className="space-y-2">
                    {product.specs.map((spec) => (
                      <div
                        key={spec.label}
                        className="flex flex-wrap justify-between rounded-lg bg-slate-50 px-4 py-3"
                      >
                        <span className="font-semibold text-slate-700">{spec.label}</span>
                        <span>{spec.value}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>Sin especificaciones para mostrar.</p>
                )}
              </div>
            )}

            {activeTab === 'valoraciones' && (
              <div>
                <p>Sin valoraciones para este producto.</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-12">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900">Productos relacionados</h2>
            <Link href="/products" className="text-sm font-semibold text-sky-600 hover:text-sky-700">
              Ver todo
            </Link>
          </div>

          {related.length === 0 ? (
            <p className="mt-6 text-sm text-slate-500">No hay productos relacionados.</p>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((item) => (
                <Link
                  key={item.id}
                  href={`/products/${item.slug}`}
                  className="rounded-2xl border border-slate-100 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.08)]"
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl bg-slate-100">
                    <Image
                      src={item.images[0]}
                      alt={item.name}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-xs font-semibold text-slate-400">{item.category.name}</p>
                    <p className="mt-2 text-sm font-semibold text-slate-900">{item.name}</p>
                    <p className="mt-2 text-sm font-semibold text-slate-800">
                      {formatCurrency(item.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <SizeGuideModal open={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
    </div>
  );
}

function mapToProduct(product: ProductPublic): Product {
  const categoryName = product.category || 'general';
  const categorySlug = slugify(categoryName);
  const bucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || 'products';
  const images = normalizeImageList(product.images, bucket);
  const safeImages = images.length > 0 ? images : ['/placeholder.png'];

  const price = toNumber(product.price) ?? 0;
  const discount = toNumber(product.discount_percent);
  const original = toNumber(product.original_price);

  let originalPrice = original;
  if (!originalPrice && discount && discount > 0 && discount < 100) {
    originalPrice = Math.round((price / (1 - discount / 100)) * 100) / 100;
  }

  const rating = toNumber(product.rating) ?? 0;
  const reviews = toNumber(product.reviews) ?? toNumber(product.reviews_count) ?? 0;

  return {
    id: product.id,
    name: product.name,
    slug: buildProductSlug(product.name, product.id),
    description: product.description,
    price,
    originalPrice,
    discountPercent: discount || undefined,
    category: {
      id: categorySlug || categoryName,
      name: categoryName,
      slug: categorySlug || categoryName,
    },
    images: safeImages,
    stock: product.stock,
    rating,
    reviews,
    sku: product.sku ?? undefined,
    sizes: normalizeStringArray(product.sizes),
    colors: normalizeStringArray(product.colors),
    specs: normalizeSpecs(product.specs),
  };
}

function normalizeStringArray(value: ProductPublic['sizes'] | ProductPublic['colors']): string[] {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === 'string' && item.trim() !== '');
  }
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.filter((item): item is string => typeof item === 'string' && item.trim() !== '');
      }
    } catch {
      // ignore
    }
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

type SpecEntry = { label: string; value: string };

function normalizeSpecs(value: ProductPublic['specs']): SpecEntry[] | undefined {
  if (!value) return undefined;

  const toSpecs = (input: unknown): SpecEntry[] => {
    if (Array.isArray(input)) {
      return input
        .map((item) => {
          if (item && typeof item === 'object' && 'label' in item && 'value' in item) {
            const label = String((item as { label: unknown }).label ?? '').trim();
            const val = String((item as { value: unknown }).value ?? '').trim();
            if (!label || !val) return null;
            return { label, value: val };
          }
          return null;
        })
        .filter((item): item is SpecEntry => Boolean(item));
    }

    if (input && typeof input === 'object') {
      return Object.entries(input as Record<string, unknown>)
        .map(([key, val]) => ({ label: key, value: String(val ?? '') }))
        .filter((item) => item.label && item.value);
    }

    return [];
  };

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return toSpecs(parsed);
    } catch {
      return [];
    }
  }

  return toSpecs(value);
}

function toNumber(value: number | string | null | undefined): number | undefined {
  if (typeof value === 'number') return Number.isFinite(value) ? value : undefined;
  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
}

function RatingStars({ rating }: { rating: number }) {
  const safe = Math.max(0, Math.min(5, rating));
  const fullStars = Math.floor(safe);
  const hasHalf = safe - fullStars >= 0.5;

  return (
    <div className="flex items-center gap-1 text-amber-400">
      {Array.from({ length: 5 }).map((_, index) => {
        const isFull = index < fullStars;
        const isHalf = !isFull && hasHalf && index === fullStars;
        return <StarIcon key={index} filled={isFull} half={isHalf} />;
      })}
    </div>
  );
}

function StarIcon({ filled, half }: { filled?: boolean; half?: boolean }) {
  if (half) {
    return (
      <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
        <defs>
          <linearGradient id="half-fill" x1="0" x2="1" y1="0" y2="0">
            <stop offset="50%" stopColor="currentColor" />
            <stop offset="50%" stopColor="none" />
          </linearGradient>
        </defs>
        <path
          fill="url(#half-fill)"
          stroke="currentColor"
          strokeWidth="1.5"
          d="M12 2.7l2.9 5.87 6.5.95-4.7 4.58 1.1 6.48L12 17.9l-5.8 3.05 1.1-6.48-4.7-4.58 6.5-.95L12 2.7z"
        />
      </svg>
    );
  }

  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d="M12 2.7l2.9 5.87 6.5.95-4.7 4.58 1.1 6.48L12 17.9l-5.8 3.05 1.1-6.48-4.7-4.58 6.5-.95L12 2.7z" />
    </svg>
  );
}

function InfoItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-50 text-sky-600">
        <CheckIcon className="h-4 w-4" />
      </span>
      <span>{text}</span>
    </div>
  );
}

function CartIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 6h15l-1.6 8.5a2 2 0 0 1-2 1.6H9.4a2 2 0 0 1-2-1.6L6 6Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M6 6H3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path
        d="M10 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm8 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function HeartIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 20s-6.3-4.3-8.4-8.3C1.9 8.9 3.4 6.4 5.9 5.7c1.5-.4 3.2.2 4.2 1.5 1-1.3 2.7-1.9 4.2-1.5 2.5.7 4 3.2 2.3 6-2.1 4-8.4 8.3-8.4 8.3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="m5 13 4 4L19 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
