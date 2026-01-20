'use client';

import Link from 'next/link';
import { ROUTES, LOGO_URL } from '@/lib/constants';
import { useUIStore } from '@/store';

// ============================================
// NAVBAR - COMPONENTE PRINCIPAL
// ============================================

export function Navbar() {
  const { toggleCartDrawer, toggleMobileMenu, cartDrawerOpen } = useUIStore();

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href={ROUTES.HOME} className="flex items-center">
            <img src={LOGO_URL} alt="Logo" className="h-8 w-auto" />
            <span className="ml-2 text-xl font-bold text-gray-900">SportWear</span>
          </Link>

          {/* Navbar Content Placeholder */}
          <div>Navbar</div>
        </div>
      </div>
    </nav>
  );
}
