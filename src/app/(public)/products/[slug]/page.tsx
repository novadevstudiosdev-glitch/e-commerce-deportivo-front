// ============================================
// PRODUCT DETAIL PAGE
// ============================================

'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Product } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { useCart } from '@/hooks';

interface ProductDetailPageProps {
  params: {
    slug: string;
  };
}

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  useEffect(() => {
    // TODO: Cargar producto desde API
    console.log('Loading product:', slug);
  }, [slug]);

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
    }
  };

  if (!product) {
    return <div className="py-12 text-center">Cargando...</div>;
  }

  return (
    <div className="py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Imagen */}
        <div className="bg-gray-200 rounded-lg aspect-square flex items-center justify-center">
          <span>Imagen del producto</span>
        </div>

        {/* Detalles */}
        <div className="space-y-6">
          <h1 className="text-4xl font-bold">{product?.name}</h1>
          <p className="text-gray-600">{product?.description}</p>
          <div className="space-y-2">
            <p className="text-3xl font-bold">{formatCurrency(product?.price || 0)}</p>
            <p className="text-green-600 font-semibold">Stock: {product?.stock}</p>
          </div>
          <div className="flex gap-4">
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="w-20 px-4 py-2 border border-gray-300 rounded"
            />
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition"
            >
              Añadir al Carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
