'use client';

import { Product } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { ROUTES } from '@/lib/routes';
import { formatCurrency, calculateDiscount, normalizeImageList } from '@/lib/utils';
import { useCart } from '@/hooks';
import { useEffect, useState } from 'react';

// ============================================
// PRODUCT CARD - COMPONENTE
// ============================================

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const bucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || 'products';
  const images = normalizeImageList(product.images, bucket);
  const primaryImage = images[0] || '/placeholder.png';
  const [imgSrc, setImgSrc] = useState(primaryImage);

  useEffect(() => {
    setImgSrc(primaryImage);
  }, [primaryImage]);

  const handleAddToCart = () => {
    addItem(
      {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        originalPrice: product.originalPrice,
        category: product.category,
        images: product.images,
        stock: product.stock,
        rating: product.rating,
        reviews: product.reviews,
        tags: product.tags,
      },
      1
    );
  };

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
      <Link href={ROUTES.PRODUCT_DETAIL(product.slug)} className="block">
        <div className="aspect-square bg-gray-200">
          <Image
            src={imgSrc}
            alt={product.name}
            width={500}
            height={500}
            sizes="(max-width: 768px) 100vw, 300px"
            unoptimized
            className="w-full h-full object-cover"
            onError={() => setImgSrc('/placeholder.png')}
          />
        </div>
      </Link>
      <div className="p-4">
        <Link href={ROUTES.PRODUCT_DETAIL(product.slug)} className="block">
          <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
        </Link>
        <p className="text-sm text-gray-600 mb-2">{product.category.name}</p>
        <div className="flex items-center gap-2 text-sm text-yellow-500">
          <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <StarIcon
                key={i}
                className={i < Math.round(product.rating || 0) ? 'fill-current' : 'text-gray-300'}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">({product.reviews ?? 0})</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-sky-600">{formatCurrency(product.price)}</span>
            {product.originalPrice && (
              <>
                <span className="text-sm text-gray-500 line-through ml-2">
                  {formatCurrency(product.originalPrice)}
                </span>
                <span className="text-xs bg-red-100 text-red-800 ml-2 px-2 py-1 rounded">
                  -{calculateDiscount(product.originalPrice, product.price)}%
                </span>
              </>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={handleAddToCart}
          className="mt-4 w-full rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-600"
        >
          Agregar al carrito
        </button>
      </div>
    </div>
  );
}

function StarIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={`h-4 w-4 ${className}`} viewBox="0 0 20 20" aria-hidden="true">
      <path d="M10 15.27l-5.18 3.2 1.4-5.97L1 7.24l6.02-.52L10 1l2.98 5.72 6.02.52-5.22 5.26 1.4 5.97L10 15.27z" />
    </svg>
  );
}
