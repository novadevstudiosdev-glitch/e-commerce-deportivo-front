// ============================================
// ADMIN PRODUCTS PAGE
// ============================================

'use client';

import { AdminProductForm } from '@/components';
import { useState } from 'react';

export default function AdminProductsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    // TODO: Crear/editar producto
    console.log('Saving product:', data);
    setIsLoading(false);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Gestionar Productos</h1>

      <button
        onClick={() => setShowForm(!showForm)}
        className="mb-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        {showForm ? 'Cancelar' : 'Nuevo Producto'}
      </button>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-2xl font-bold mb-6">Formulario de Producto</h2>
          <AdminProductForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Productos</h2>
        <p className="text-gray-500">No hay productos</p>
      </div>
    </div>
  );
}
