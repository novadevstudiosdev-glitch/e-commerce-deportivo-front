// ============================================
// REGISTER PAGE
// ============================================

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
  const err = error as any;
  return err?.response?.data?.error || err?.message || 'No se pudo completar la solicitud';
}

export default function RegisterPage() {
  const [mode, setMode] = useState<'login' | 'register'>('register');
  const router = useRouter();
  const { setSession, setIsLoading } = useAuthStore();

  const handleLogin = async (data: LoginValues) => {
    setIsLoading(true);
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
      throw new Error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (data: RegisterValues) => {
    setIsLoading(true);
    try {
      const session = await authService.register({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        phone: data.phone,
      });
      setSession(session);
      await Swal.fire({
        icon: 'success',
        title: '¡Registro exitoso!',
        text: 'Tu cuenta ha sido creada. Ahora inicia sesión.',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#0ea5e9',
        allowOutsideClick: false,
      });
      setMode('login');
    } catch (error) {
      throw new Error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

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

