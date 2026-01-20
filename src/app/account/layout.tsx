// ============================================
// ACCOUNT LAYOUT
// ============================================

'use client';

import { RequireAuth } from '@/utils/requireAuth';
import { ROUTES } from '@/lib/routes';
import Link from 'next/link';

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-8">
        <aside className="bg-white rounded-lg shadow p-6 h-fit">
          <h3 className="font-semibold text-lg mb-4">Mi Cuenta</h3>
          <nav className="space-y-2">
            <Link
              href={ROUTES.ACCOUNT_PROFILE}
              className="block px-4 py-2 rounded hover:bg-gray-100 transition"
            >
              Perfil
            </Link>
            <Link
              href={ROUTES.ACCOUNT_ORDERS}
              className="block px-4 py-2 rounded hover:bg-gray-100 transition"
            >
              Mis Órdenes
            </Link>
          </nav>
        </aside>
        <main className="md:col-span-3">{children}</main>
      </div>
    </RequireAuth>
  );
}
