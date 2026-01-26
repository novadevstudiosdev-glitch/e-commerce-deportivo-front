// ============================================
// REGISTER PAGE
// ============================================

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthTabs from '@/components/auth/AuthTabs';
import AuthFormLogin from '@/components/auth/AuthFormLogin';
import AuthFormRegister from '@/components/auth/AuthFormRegister';
import { authService } from '@/services';
import { useAuthStore } from '@/store';
import { ROUTES } from '@/lib/routes';

type LoginValues = {
  email: string;
  password: string;
};

type RegisterValues = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
};

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return 'No se pudo completar la solicitud';
}

export default function RegisterPage() {
  const [mode, setMode] = useState<'login' | 'register'>('register');
  const [registerMessage, setRegisterMessage] = useState<string | null>(null);
  const router = useRouter();
  const { setSession, setIsLoading } = useAuthStore();

  const handleLogin = async (data: LoginValues) => {
    setIsLoading(true);
    try {
      const session = await authService.login(data);
      setSession(session);
      router.push(ROUTES.HOME);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (data: RegisterValues) => {
    setIsLoading(true);
    setRegisterMessage(null);
    try {
      const session = await authService.register({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        phone: data.phone,
      });
      setSession(session);
      setRegisterMessage('Cuenta creada, revisa tu email (spam/promociones).');
      router.push(`${ROUTES.AUTH_LOGIN}?registered=1`);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F8FB]">
      <header className="bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-base font-semibold text-slate-900">SportShop</span>
          </Link>
          <Link
            href="/"
            className="rounded-full border border-black/10 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Volver al inicio
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 pb-12 pt-8">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 overflow-hidden rounded-3xl border border-black/5 bg-white md:grid-cols-2">
          {/* Form */}
          <div className="p-8 md:p-10">
            <h1 className="text-2xl font-bold text-slate-900">
              {mode === 'login' ? 'Iniciar sesion' : 'Crear cuenta'}
            </h1>

            <p className="mt-2 text-sm text-slate-600">
              {mode === 'login'
                ? 'Accede para ver tu carrito, compras y seguimiento.'
                : 'Registrate para guardar tus datos y comprar mas rapido.'}
            </p>

            <div className="mt-6">
              <AuthTabs mode={mode} onChange={setMode} />
            </div>

            <div className="mt-6 h-px bg-black/5" />

            <div className="mt-8">
              {mode === 'login' ? (
                <AuthFormLogin onSubmit={handleLogin} />
              ) : (
                <AuthFormRegister onSubmit={handleRegister} />
              )}
            </div>

            {mode === 'register' && registerMessage && (
              <div className="mt-4 rounded-xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm text-sky-700">
                {registerMessage}
              </div>
            )}

          </div>

          {/* Panel derecho */}
          <div className="relative hidden md:block">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-sky-50" />
            <div className="relative p-10">
              <p className="inline-flex rounded-full bg-black/5 px-3 py-1 text-xs font-semibold text-slate-700">
                Envios a todo el pais - Cambios faciles
              </p>

              <h2 className="mt-6 text-3xl font-extrabold text-slate-900">
                Simple, rapido
                <span className="block text-sky-700">y seguro.</span>
              </h2>

              <p className="mt-4 text-sm text-slate-600">
                Guarda tus direcciones, segui tus pedidos y accede a ofertas por categoria.
              </p>

              <ul className="mt-8 space-y-4 text-sm text-slate-700">
                <li>- Envios a todo el pais</li>
                <li>- Cambios faciles</li>
                <li>- Pago seguro</li>
              </ul>

              <div className="mt-10 flex gap-3">
                <span className="rounded-full bg-black/5 px-3 py-1 text-xs font-semibold">
                  +250 productos
                </span>
                <span className="rounded-full bg-black/5 px-3 py-1 text-xs font-semibold">
                  8+ categorias
                </span>
              </div>
            </div>
          </div>
          </div>
        </div>
      </main>

      <footer className="mx-auto max-w-7xl px-6 pb-10 pt-6 text-xs text-slate-500">
        (c) {new Date().getFullYear()} SportShop - Soporte - Envios - Devoluciones
      </footer>
    </div>
  );
}
