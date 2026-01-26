// ============================================
// PREFERENCES PAGE (PROTEGIDA)
// ============================================

'use client';

import { useState } from 'react';

type Toggle = {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
};

const INITIAL_TOGGLES: Toggle[] = [
  {
    id: 'newsletter',
    label: 'Newsletter semanal',
    description: 'Recibe nuestras ultimas novedades y ofertas.',
    enabled: true,
  },
  {
    id: 'promos',
    label: 'Promociones especiales',
    description: 'Ofertas exclusivas y descuentos personalizados.',
    enabled: true,
  },
  {
    id: 'orders',
    label: 'Actualizaciones de pedidos',
    description: 'Notificaciones sobre el estado de tus pedidos.',
    enabled: true,
  },
  {
    id: 'new-products',
    label: 'Nuevos productos',
    description: 'Se el primero en conocer nuestras novedades.',
    enabled: false,
  },
];

export default function PreferencesPage() {
  const [toggles, setToggles] = useState(INITIAL_TOGGLES);

  const toggleItem = (id: string) => {
    setToggles((prev) =>
      prev.map((item) => (item.id === id ? { ...item, enabled: !item.enabled } : item))
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-lg font-semibold text-slate-900">Preferencias</h1>
        <p className="text-sm text-slate-500">Personaliza tus notificaciones y gustos.</p>
      </div>

      <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-900">Notificaciones</h2>
        <div className="mt-4 space-y-4">
          {toggles.map((item) => (
            <div
              key={item.id}
              className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center"
            >
              <div>
                <p className="text-sm font-semibold text-slate-800">{item.label}</p>
                <p className="text-xs text-slate-500">{item.description}</p>
              </div>
              <button
                type="button"
                aria-pressed={item.enabled}
                onClick={() => toggleItem(item.id)}
                className={`relative h-6 w-11 rounded-full transition ${
                  item.enabled ? 'bg-sky-500' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
                    item.enabled ? 'left-5' : 'left-0.5'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-900">Tallas preferidas</h2>
        <div className="mt-4 grid gap-5 md:grid-cols-2">
          <div>
            <p className="text-xs font-semibold text-slate-500">Talla de calzado</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {['38', '39', '40', '41', '42', '43', '44', '45', '46'].map((size) => (
                <span
                  key={size}
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                    size === '42'
                      ? 'border-sky-500 bg-sky-500 text-white'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  {size}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-500">Talla de ropa</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                <span
                  key={size}
                  className={`rounded-full border px-4 py-1 text-xs font-semibold ${
                    size === 'L'
                      ? 'border-sky-500 bg-sky-500 text-white'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  {size}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-900">Deportes favoritos</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {['Running', 'Futbol', 'Baloncesto', 'Tenis', 'Fitness', 'Natacion'].map((sport) => (
            <span
              key={sport}
              className={`rounded-full border px-4 py-2 text-xs font-semibold ${
                ['Running', 'Futbol', 'Fitness'].includes(sport)
                  ? 'border-sky-500 bg-sky-500 text-white'
                  : 'border-slate-200 text-slate-600'
              }`}
            >
              {sport}
            </span>
          ))}
        </div>
      </section>

      <button
        type="button"
        className="inline-flex items-center justify-center rounded-full bg-sky-500 px-5 py-2 text-xs font-semibold text-white transition hover:bg-sky-600"
      >
        Guardar preferencias
      </button>
    </div>
  );
}
