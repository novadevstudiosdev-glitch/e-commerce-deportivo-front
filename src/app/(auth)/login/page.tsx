'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AuthTabs from '@/components/auth/AuthTabs';
import AuthFormLogin from '@/components/auth/AuthFormLogin';
import AuthFormRegister from '@/components/auth/AuthFormRegister';
import { authService } from '@/services';
import { useAuthStore } from '@/store';
import { ROUTES } from '@/lib/routes';
import Swal from 'sweetalert2';

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

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [registerMessage, setRegisterMessage] = useState<string | null>(null);
  const [loginBanner, setLoginBanner] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setSession, setIsLoading } = useAuthStore();

  const handleLogin = async (data: LoginValues) => {
    setIsLoading(true);
    setLoginBanner(null);
    try {
      const session = await authService.login(data);
      setSession(session);
      await Swal.fire({
        icon: 'success',
        title: '¡Bienvenido!',
        text: 'Has iniciado sesión correctamente.',
        confirmButtonText: 'Continuar',
        confirmButtonColor: '#0ea5e9',
        allowOutsideClick: false,
      });
      router.push(ROUTES.HOME);
    } catch (error) {
      const message = getErrorMessage(error);
      if (message.toLowerCase().includes('no esta verificado')) {
        setLoginBanner(message);
      }
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (data: RegisterValues) => {
    setIsLoading(true);
    setRegisterMessage(null);
    try {
      await authService.register({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        phone: data.phone,
      });
      setRegisterMessage('Cuenta creada. Revisa tu email para verificar tu cuenta.');
      const result = await Swal.fire({
        icon: 'info',
        title: 'Verifica tu cuenta',
        text: 'Revisa tu correo (spam/promociones) para completar la verificacion.',
        confirmButtonText: 'Ir a Gmail',
        confirmButtonColor: '#0ea5e9',
        showCancelButton: true,
        cancelButtonText: 'Cerrar',
      });
      if (result.isConfirmed && typeof window !== 'undefined') {
        window.location.href = 'https://mail.google.com/mail/u/0/#inbox';
      }
    } catch (error) {
      throw new Error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const registered = searchParams.get('registered');
    if (registered) {
      setLoginBanner('Cuenta creada. Revisa tu correo para verificarla.');
    } else {
      setLoginBanner(null);
    }
  }, [searchParams]);

  return (
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

          {mode === 'login' && loginBanner && (
            <div className="mt-4 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              <p>{loginBanner}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  className="rounded-lg bg-sky-600 px-3 py-2 text-xs font-semibold text-white hover:bg-sky-700"
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      window.location.href = 'https://mail.google.com/mail/u/0/#inbox';
                    }
                  }}
                >
                  Ir a Gmail
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  onClick={() => setLoginBanner(null)}
                >
                  Cerrar
                </button>
              </div>
            </div>
          )}

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
  );
}

