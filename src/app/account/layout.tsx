// ============================================
// ACCOUNT LAYOUT
// ============================================

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { RequireAuth } from '@/utils/requireAuth';
import { ROUTES } from '@/lib/routes';
import { useAuth } from '@/hooks';
import { Navbar } from '@/components';

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
  const email = session?.user?.email || 'sin email';

  return (
    <RequireAuth>
      <div className="min-h-screen bg-[#F6F7FB]">
        <Navbar />

        <div className="mx-auto w-full max-w-5xl px-4 pb-16 pt-8">
          <section className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                  {initials || 'CL'}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{userName}</p>
                  <p className="text-xs text-slate-500">{email}</p>
                  <p className="mt-1 text-xs text-slate-400">Miembro desde 2024</p>
                </div>
              </div>
              <Link
                href={ROUTES.ACCOUNT_PROFILE}
                className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
              >
                Editar Perfil
              </Link>
            </div>
          </section>

          <nav className="mt-5 rounded-2xl bg-white p-2 shadow-sm">
            <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-slate-500 sm:grid-cols-4 sm:text-xs">
              {[
                { label: 'Informacion Personal', href: ROUTES.ACCOUNT_PROFILE, icon: UserIcon },
                { label: 'Mis Pedidos', href: ROUTES.ACCOUNT_ORDERS, icon: OrdersIcon },
                { label: 'Direcciones', href: ROUTES.ACCOUNT_ADDRESSES, icon: LocationIcon },
                { label: 'Preferencias', href: ROUTES.ACCOUNT_PREFERENCES, icon: SettingsIcon },
              ].map((item) => {
                const isActive =
                  item.href === ROUTES.ACCOUNT_PROFILE
                    ? pathname === ROUTES.ACCOUNT || pathname.startsWith(item.href)
                    : pathname.startsWith(item.href);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex flex-col items-center justify-center gap-1 rounded-xl px-3 py-2 text-center transition sm:flex-row sm:gap-2 ${
                      isActive
                        ? 'bg-sky-500 text-white shadow-sm'
                        : 'text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>

          <main className="mt-6 space-y-6">{children}</main>
        </div>
      </div>
    </RequireAuth>
  );
}

function UserIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M20 21a8 8 0 1 0-16 0"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function OrdersIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 7h12l-1 12H7L6 7Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M9 7a3 3 0 0 1 6 0"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LocationIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 21s-6-6.2-6-11a6 6 0 1 1 12 0c0 4.8-6 11-6 11Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function SettingsIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 15.5a3.5 3.5 0 1 0-3.5-3.5 3.5 3.5 0 0 0 3.5 3.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M19.4 13.5a7.9 7.9 0 0 0 0-3l2-1.2-2-3.4-2.3.8a7.8 7.8 0 0 0-2.6-1.5l-.4-2.5h-4l-.4 2.5a7.8 7.8 0 0 0-2.6 1.5l-2.3-.8-2 3.4 2 1.2a7.9 7.9 0 0 0 0 3l-2 1.2 2 3.4 2.3-.8a7.8 7.8 0 0 0 2.6 1.5l.4 2.5h4l.4-2.5a7.8 7.8 0 0 0 2.6-1.5l2.3.8 2-3.4-2-1.2Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
