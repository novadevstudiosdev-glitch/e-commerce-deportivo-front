// ============================================
// ADMIN OFFERS PAGE
// ============================================

'use client';

import { useState } from 'react';

export default function AdminOffersPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    // TODO: Crear/editar oferta
    console.log('Saving offer:', data);
    setIsLoading(false);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Gestionar Ofertas</h1>

      <button
        onClick={() => setShowForm(!showForm)}
        className="mb-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        {showForm ? 'Cancelar' : 'Nueva Oferta'}
      </button>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-2xl font-bold mb-6">Formulario de Oferta</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit({});
            }}
            className="space-y-4"
          >
            <input
              type="text"
              placeholder="Título de la oferta"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
            <textarea
              placeholder="Descripción"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              rows={4}
            />
            <input
              type="number"
              placeholder="Descuento (%)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {isLoading ? 'Guardando...' : 'Guardar Oferta'}
            </button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Ofertas Activas</h2>
        <p className="text-gray-500">No hay ofertas</p>
      </div>
    </div>
  );
}

