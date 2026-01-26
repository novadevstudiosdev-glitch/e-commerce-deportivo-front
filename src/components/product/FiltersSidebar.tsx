 'use client';

import { useMemo, useState } from 'react';
import { CATEGORIES, SORT_OPTIONS } from '@/lib/constants';

// ============================================
// FILTERS SIDEBAR - COMPONENTE
// ============================================

type CategoryOption = { name: string; slug: string };

interface FiltersSidebarProps {
  categories?: CategoryOption[];
  onFilterChange?: (filters: {
    categories: string[];
    minPrice?: number;
    maxPrice?: number;
  }) => void;
  onSortChange?: (sort: string) => void;
}

export function FiltersSidebar({ categories, onFilterChange, onSortChange }: FiltersSidebarProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedSort, setSelectedSort] = useState('newest');

  const handleSortChange = (value: string) => {
    setSelectedSort(value);
    onSortChange?.(value);
  };

  const options = useMemo(
    () => (categories && categories.length > 0 ? categories : CATEGORIES),
    [categories]
  );

  const toggleCategory = (slug: string) => {
    setSelectedCategories((prev) =>
      prev.includes(slug) ? prev.filter((item) => item !== slug) : [...prev, slug]
    );
  };

  const applyFilters = () => {
    const min = minPrice !== '' ? Number(minPrice) : undefined;
    const max = maxPrice !== '' ? Number(maxPrice) : undefined;
    onFilterChange?.({ categories: selectedCategories, minPrice: min, maxPrice: max });
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setMinPrice('');
    setMaxPrice('');
    onFilterChange?.({ categories: [], minPrice: undefined, maxPrice: undefined });
  };

  return (
    <aside className="w-full md:w-64 bg-white rounded-lg shadow p-6">
      <div className="space-y-6">
        <div>
          <p className="text-sm font-semibold text-gray-900">Ordenar por</p>
          <select
            value={selectedSort}
            onChange={(event) => handleSortChange(event.target.value)}
            className="mt-2 w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:border-sky-500 focus:outline-none"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <p className="text-sm font-semibold text-gray-900">Categorías</p>
          <div className="mt-3 space-y-2">
            {options.map((category) => (
              <label key={category.slug} className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-sky-500 focus:ring-sky-500"
                  checked={selectedCategories.includes(category.slug)}
                  onChange={() => toggleCategory(category.slug)}
                />
                <span>{category.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-gray-900">Precio</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <input
              type="number"
              min={0}
              value={minPrice}
              onChange={(event) => setMinPrice(event.target.value)}
              placeholder="Mín"
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:border-sky-500 focus:outline-none"
            />
            <input
              type="number"
              min={0}
              value={maxPrice}
              onChange={(event) => setMaxPrice(event.target.value)}
              placeholder="Máx"
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:border-sky-500 focus:outline-none"
            />
          </div>
          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={applyFilters}
              className="flex-1 rounded-md bg-sky-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-sky-600"
            >
              Aplicar
            </button>
            <button
              type="button"
              onClick={clearFilters}
              className="flex-1 rounded-md border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 transition hover:border-gray-300 hover:text-gray-800"
            >
              Limpiar
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
