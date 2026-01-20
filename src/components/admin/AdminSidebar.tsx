'use client';

import { ROUTES } from '@/lib/routes';
import Link from 'next/link';

// ============================================
// ADMIN SIDEBAR - COMPONENTE
// ============================================

export function AdminSidebar() {
  const menuItems = [
    { label: 'Dashboard', href: ROUTES.ADMIN_STATS },
    { label: 'Productos', href: ROUTES.ADMIN_PRODUCTS },
    { label: 'Órdenes', href: ROUTES.ADMIN_ORDERS },
    { label: 'Ofertas', href: ROUTES.ADMIN_OFFERS },
  ];

  return (
    <aside className="w-64 bg-gray-900 text-white h-screen fixed left-0 top-0">
      <div className="p-6">
        <h2 className="text-xl font-bold mb-8">Panel Admin</h2>
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-4 py-2 rounded hover:bg-gray-800 transition"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}
