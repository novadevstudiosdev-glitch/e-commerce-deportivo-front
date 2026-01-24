// ============================================
// ACCOUNT DASHBOARD
// ============================================

'use client';

import Link from 'next/link';
import { ROUTES } from '@/lib/routes';
import { useAuth, useCart } from '@/hooks';
import { formatCurrency } from '@/lib/utils';

export default function AccountDashboardPage() {
  const { session } = useAuth();
  const { totalItems, totalPrice } = useCart();

  const firstName = session?.user?.firstName || 'Cliente';
  const email = session?.user?.email || 'sin email';
  const phone = session?.user?.phone || 'Sin telefono';

  const stats = [
    {
      label: 'Productos en carrito',
      value: `${totalItems}`,
    },
    {
      label: 'Total en carrito',
      value: formatCurrency(totalPrice),
    },
    {
      label: 'Ordenes activas',
      value: '0',
    },
    {
      label: 'Estado de cuenta',
      value: 'Activo',
    },
  ];

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
            <p className="mt-2 text-sm text-slate-500">Hola, {firstName}. Este es tu resumen.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href={ROUTES.CART}
              className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Ver carrito
            </Link>
            <Link
              href={ROUTES.PRODUCTS}
              className="rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Seguir comprando
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
          >
            <p className="text-xs uppercase tracking-wide text-slate-400">{stat.label}</p>
            <p className="mt-3 text-2xl font-semibold text-slate-900">{stat.value}</p>
          </div>
        ))}
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Actividad reciente</h2>
            <Link
              href={ROUTES.ACCOUNT_ORDERS}
              className="text-sm font-semibold text-slate-600 hover:text-slate-900"
            >
              Ver ordenes
            </Link>
          </div>
          <div className="mt-4 rounded-xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
            Todavia no hay ordenes registradas. Cuando compres, apareceran aqui.
          </div>
        </section>

        <section className="space-y-4">
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Datos de contacto</h2>
            <div className="mt-3 space-y-2 text-sm text-slate-600">
              <p>
                <span className="font-semibold text-slate-800">Email:</span> {email}
              </p>
              <p>
                <span className="font-semibold text-slate-800">Telefono:</span> {phone}
              </p>
            </div>
            <Link
              href={ROUTES.ACCOUNT_PROFILE}
              className="mt-4 inline-flex rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Editar perfil
            </Link>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Accesos rapidos</h2>
            <div className="mt-4 space-y-3">
              <Link
                href={ROUTES.ACCOUNT_PROFILE}
                className="block rounded-xl border border-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Completar datos personales
              </Link>
              <Link
                href={ROUTES.ACCOUNT_ORDERS}
                className="block rounded-xl border border-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Historial de ordenes
              </Link>
              <Link
                href={ROUTES.CART}
                className="block rounded-xl border border-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Revisar carrito
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
