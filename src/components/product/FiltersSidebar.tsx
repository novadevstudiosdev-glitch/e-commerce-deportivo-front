'use client';

import { useState } from 'react';
import { SORT_OPTIONS } from '@/lib/constants';

// ============================================
// FILTERS SIDEBAR - COMPONENTE
// ============================================

interface FiltersSidebarProps {
  onFilterChange?: (filters: any) => void;
  onSortChange?: (sort: string) => void;
}

export function FiltersSidebar({ onFilterChange, onSortChange }: FiltersSidebarProps) {
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedSort, setSelectedSort] = useState('newest');

  const handleSortChange = (value: string) => {
    setSelectedSort(value);
    onSortChange?.(value);
  };

  return (
    <aside className="w-full md:w-64 bg-white rounded-lg shadow p-6">
      <div>Filters Sidebar</div>
    </aside>
  );
}
