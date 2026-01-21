'use client';

import { CATEGORIES } from '@/lib/constants';
import Link from 'next/link';
import { ROUTES } from '@/lib/routes';

// ============================================
// CATEGORY MENU - COMPONENTE
// ============================================

export function CategoryMenu() {
  return (
    <div className="flex gap-4 py-4 px-4 bg-gray-50 border-b">
      {CATEGORIES.map((category) => (
        <Link
          key={category.id}
          href={ROUTES.CATEGORIES(category.slug)}
          className="px-3 py-2 rounded hover:bg-gray-200 transition"
        >
          {category.name}
        </Link>
      ))}
    </div>
  );
}
