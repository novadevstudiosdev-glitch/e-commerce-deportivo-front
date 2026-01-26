'use client';

import type { FormEvent } from 'react';
import { useState } from 'react';

// ============================================
// SEARCH BAR - COMPONENTE
// ============================================

export function SearchBar() {
  const [query, setQuery] = useState('');

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      // TODO: Redirigir a resultados de búsqueda
      console.log('Search query:', query);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex gap-2 py-4">
      <input
        type="text"
        placeholder="Buscar productos..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
      />
      <button
        type="submit"
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Buscar
      </button>
    </form>
  );
}

