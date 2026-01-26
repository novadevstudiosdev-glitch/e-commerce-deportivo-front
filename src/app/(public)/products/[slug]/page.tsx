// ============================================
// PRODUCT DETAIL PAGE
// ============================================

'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Product } from '@/types';
import { buildProductSlug, extractProductId, formatCurrency, slugify } from '@/lib/utils';
import { useCart } from '@/hooks';
import { productsService, ProductPublic } from '@/services/products.service';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
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
        const pageSize = 50;
        const first = await productsService.getProducts({
          page: 1,
          limit: pageSize,
          sort: 'newest',
        });
        let found = first.data.find((item) => item.id === id) ?? null;

        if (!found) {
          const totalPages = Math.max(1, Math.ceil(first.total / pageSize));
          for (let page = 2; page <= totalPages; page += 1) {
            const next = await productsService.getProducts({
              page,
              limit: pageSize,
              sort: 'newest',
            });
            found = next.data.find((item) => item.id === id) ?? null;
            if (found) break;
          }
        }

        if (!isMounted) return;
        if (!found) {
          setError('Producto no encontrado.');
          setIsLoading(false);
          return;
        }

        setProduct(mapToProduct(found));
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

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
    }
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
    <div className="py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Imagen */}
        <div className="bg-gray-200 rounded-lg aspect-square overflow-hidden">
          <img
            src={product.images[0] || '/placeholder.png'}
            alt={product.name}
            className="h-full w-full object-cover"
          />
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
