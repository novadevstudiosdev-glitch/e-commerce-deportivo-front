// ============================================
// PRODUCTS PAGE
// ============================================

'use client';

import { ProductGrid, FiltersSidebar } from '@/components';
import { useState, useEffect } from 'react';
import { Product } from '@/types';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Cargar productos desde API
    setIsLoading(false);
  }, []);

  return (
    <div className="py-8">
      <h1 className="text-4xl font-bold mb-8">Catálogo de Productos</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <FiltersSidebar />
        <div className="md:col-span-3">
          <ProductGrid products={products} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
