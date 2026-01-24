// ============================================
// ACCOUNT LAYOUT
// ============================================

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { RequireAuth } from '@/utils/requireAuth';
import { ROUTES } from '@/lib/routes';
import { useAuth } from '@/hooks';

const navItems = [
  { label: 'Dashboard', href: ROUTES.ACCOUNT },
  { label: 'Perfil', href: ROUTES.ACCOUNT_PROFILE },
  { label: 'Mis ordenes', href: ROUTES.ACCOUNT_ORDERS },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { session } = useAuth();

  const userName = session?.user
    ? `${session.user.firstName || ''} ${session.user.lastName || ''}`.trim() || 'Cliente'
    : 'Cliente';
  const initials = userName
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <RequireAuth>
      <div className="min-h-screen bg-[#F6F7FB]">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-10 lg:grid-cols-[280px_1fr]">
          <aside className="h-fit rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                {initials || 'CL'}
              </div>
              <div>
                <p className="text-xs text-slate-500">Cuenta</p>
                <p className="text-sm font-semibold text-slate-900">{userName}</p>
              </div>
            </div>

            <nav className="space-y-2">
              {navItems.map((item) => {
                const isActive =
                  item.href === ROUTES.ACCOUNT
                    ? pathname === item.href
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block rounded-lg px-4 py-2 text-sm font-semibold transition ${
                      isActive
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-6 rounded-xl bg-slate-50 p-4 text-xs text-slate-600">
              Gestiona tus datos personales, pedidos y preferencias desde este panel.
            </div>
          </aside>

          <main>{children}</main>
        </div>
      </div>
    </RequireAuth>
  );
}
