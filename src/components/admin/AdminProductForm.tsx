'use client';

import type { FormEvent } from 'react';
import { Product } from '@/types';

// ============================================
// ADMIN PRODUCT FORM - COMPONENTE
// ============================================

interface AdminProductFormProps {
  product?: Product;
  onSubmit?: (data: Partial<Product>) => void;
  isLoading?: boolean;
}

export function AdminProductForm({ product, onSubmit, isLoading }: AdminProductFormProps) {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Implementar validación con React Hook Form + Zod
    const payload: Partial<Product> = {};
    onSubmit?.(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <input
        type="text"
        placeholder="Nombre del producto"
        defaultValue={product?.name}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        disabled={isLoading}
      />
      <textarea
        placeholder="Descripción"
        defaultValue={product?.description}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        rows={4}
        disabled={isLoading}
      />
      <div className="grid grid-cols-2 gap-4">
        <input
          type="number"
          placeholder="Precio"
          defaultValue={product?.price}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          disabled={isLoading}
        />
        <input
          type="number"
          placeholder="Stock"
          defaultValue={product?.stock}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          disabled={isLoading}
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
      >
        {isLoading ? 'Guardando...' : 'Guardar Producto'}
      </button>
    </form>
  );
}

