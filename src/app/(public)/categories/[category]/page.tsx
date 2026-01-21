// ============================================
// CATEGORIES PAGE
// ============================================

'use client';

import { useParams } from 'next/navigation';
import { ProductGrid } from '@/components';
import { useState, useEffect } from 'react';
import { Product } from '@/types';

export default function CategoriesPage() {
  const params = useParams();
  const category = params.category as string;
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Cargar productos de la categoría
    console.log('Loading category:', category);
    setIsLoading(false);
  }, [category]);

  return (
    <div className="py-8">
      <h1 className="text-4xl font-bold mb-8 capitalize">{category}</h1>
      <ProductGrid products={products} isLoading={isLoading} />
    </div>
  );
}
