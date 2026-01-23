'use client';

import { useState } from 'react';
import AuthTabs from '@/components/auth/AuthTabs';
import AuthFormLogin from '@/components/auth/AuthFormLogin';
import AuthFormRegister from '@/components/auth/AuthFormRegister';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');

  return (
    <div className="mx-auto max-w-5xl">
      <div className="grid grid-cols-1 overflow-hidden rounded-3xl border border-black/5 bg-white md:grid-cols-2">
        {/* Form */}
        <div className="p-8 md:p-10">
          <h1 className="text-2xl font-bold text-slate-900">
            {mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
          </h1>

          <p className="mt-2 text-sm text-slate-600">
            {mode === 'login'
              ? 'Accedé para ver tu carrito, compras y seguimiento.'
              : 'Registrate para guardar tus datos y comprar más rápido.'}
          </p>

          <div className="mt-6">
            <AuthTabs mode={mode} onChange={setMode} />
          </div>

          <div className="mt-6 h-px bg-black/5" />

          <div className="mt-8">{mode === 'login' ? <AuthFormLogin /> : <AuthFormRegister />}</div>
        </div>

        {/* Panel derecho */}
        <div className="relative hidden md:block">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-sky-50" />
          <div className="relative p-10">
            <p className="inline-flex rounded-full bg-black/5 px-3 py-1 text-xs font-semibold text-slate-700">
              Envíos a todo el país • Cambios fáciles
            </p>

            <h2 className="mt-6 text-3xl font-extrabold text-slate-900">
              Simple, rápido
              <span className="block text-sky-700">y seguro.</span>
            </h2>

            <p className="mt-4 text-sm text-slate-600">
              Guardá tus direcciones, seguí tus pedidos y accedé a ofertas por categoría.
            </p>

            <ul className="mt-8 space-y-4 text-sm text-slate-700">
              <li>• Envíos a todo el país</li>
              <li>• Cambios fáciles</li>
              <li>• Pago seguro</li>
            </ul>

            <div className="mt-10 flex gap-3">
              <span className="rounded-full bg-black/5 px-3 py-1 text-xs font-semibold">
                +250 productos
              </span>
              <span className="rounded-full bg-black/5 px-3 py-1 text-xs font-semibold">
                8+ categorías
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
