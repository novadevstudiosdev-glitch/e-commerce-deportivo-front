'use client';

import { Product } from '@/types';
import Link from 'next/link';
import { ROUTES } from '@/lib/routes';
import { formatCurrency, calculateDiscount } from '@/lib/utils';

// ============================================
// PRODUCT CARD - COMPONENTE
// ============================================

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
      <div className="aspect-square bg-gray-200">
        <img
          src={product.images[0] || '/placeholder.png'}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-2">{product.category.name}</p>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-gray-900">{formatCurrency(product.price)}</span>
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
      </div>
    </div>
  );
}
