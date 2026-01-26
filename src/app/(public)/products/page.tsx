// ============================================
// PRODUCTS PAGE
// ============================================

'use client';

import { ProductGrid, FiltersSidebar } from '@/components';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Product } from '@/types';
import { productsService, ProductPublic } from '@/services/products.service';
import { buildProductSlug, slugify } from '@/lib/utils';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 24;
  const [activeSort, setActiveSort] = useState('newest');
  const [filters, setFilters] = useState<{
    categories: string[];
    minPrice?: number;
    maxPrice?: number;
  }>({ categories: [] });
  const searchParams = useSearchParams();
  const searchQuery = (searchParams.get('search') ?? '').trim().toLowerCase();

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await productsService.getProducts({ limit: 250, sort: 'newest' });
        if (!isMounted) return;
        setProducts(response.data.map(mapToProduct));
      } catch (err) {
        if (!isMounted) return;
        setProducts([]);
        setError('No se pudieron cargar los productos.');
      } finally {
        if (!isMounted) return;
        setIsLoading(false);
      }
    };

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [products.length, filters, activeSort, searchQuery]);

  const filteredProducts = useMemo(() => {
    let items = [...products];

    if (searchQuery) {
      items = items.filter((product) => {
        const nameMatch = product.name.toLowerCase().includes(searchQuery);
        const descriptionMatch = (product.description || '').toLowerCase().includes(searchQuery);
        return nameMatch || descriptionMatch;
      });
    }

    if (filters.categories.length > 0) {
      items = items.filter((product) => filters.categories.includes(product.category.slug));
    }

    if (filters.minPrice !== undefined) {
      items = items.filter((product) => product.price >= filters.minPrice!);
    }

    if (filters.maxPrice !== undefined) {
      items = items.filter((product) => product.price <= filters.maxPrice!);
    }

    if (activeSort === 'price-asc') {
      items.sort((a, b) => a.price - b.price);
    } else if (activeSort === 'price-desc') {
      items.sort((a, b) => b.price - a.price);
    } else if (activeSort === 'rating') {
      items.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    }

    return items;
  }, [
    activeSort,
    filters.categories,
    filters.maxPrice,
    filters.minPrice,
    products,
    searchQuery,
  ]);

  const categories = useMemo(() => {
    const map = new Map<string, string>();
    products.forEach((product) => {
      map.set(product.category.slug, product.category.name);
    });
    return Array.from(map.entries()).map(([slug, name]) => ({ slug, name }));
  }, [products]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  const maxButtons = 10;
  const halfWindow = Math.floor(maxButtons / 2);
  let startPage = Math.max(1, safePage - halfWindow);
  let endPage = startPage + maxButtons - 1;
  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - maxButtons + 1);
  }
  const pageNumbers = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

  return (
    <div className="py-8">
      <h1 className="text-4xl font-bold mb-8">Catálogo de Productos</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <FiltersSidebar
          categories={categories}
          onFilterChange={(nextFilters) => setFilters(nextFilters)}
          onSortChange={(sort) => setActiveSort(sort)}
        />
        <div className="md:col-span-3">
          {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
          <ProductGrid products={paginatedProducts} isLoading={isLoading} />

          {!isLoading && totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              {pageNumbers.map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`min-w-[40px] rounded-md border px-3 py-2 text-sm font-medium transition ${
                    page === safePage
                      ? 'border-sky-500 text-sky-600 shadow-sm'
                      : 'border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-800'
                  }`}
                  aria-current={page === safePage ? 'page' : undefined}
                >
                  {page}
                </button>
              ))}

              {safePage < totalPages && (
                <button
                  type="button"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  className="ml-2 flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
                >
                  Siguiente <span aria-hidden="true">›</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function mapToProduct(product: ProductPublic): Product {
  const categoryName = product.category || 'general';
  const categorySlug = slugify(categoryName);
  const images = product.images && product.images.length > 0 ? product.images : ['/placeholder.png'];

  return {
    id: product.id,
    name: product.name,
    slug: buildProductSlug(product.name, product.id),
    description: product.description,
    price: Number(product.price),
    category: {
      id: categorySlug || categoryName,
      name: categoryName,
      slug: categorySlug || categoryName,
    },
    images,
    stock: product.stock,
  };
}

