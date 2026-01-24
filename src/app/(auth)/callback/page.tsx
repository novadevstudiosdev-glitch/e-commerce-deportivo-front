'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/services';
import { useAuthStore } from '@/store';
import Swal from 'sweetalert2';

export default function AuthCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setSession } = useAuthStore();
  const [status, setStatus] = useState('Procesando...');

  useEffect(() => {
    const error = searchParams.get('error');
    const token = searchParams.get('token');

    if (error) {
      setStatus(`Error: ${error}`);
      Swal.fire({
        icon: 'error',
        title: 'Error de autenticación',
        text: error,
        confirmButtonColor: '#0ea5e9',
      });
      return;
    }

    if (!token) {
      setStatus('Token no encontrado.');
      Swal.fire({
        icon: 'error',
        title: 'Token no encontrado',
        text: 'No se pudo completar la autenticación.',
        confirmButtonColor: '#0ea5e9',
      });
      return;
    }

    const handleAuth = async () => {
      try {
        const session = await authService.loginWithGoogle(token);
        setSession(session);
        setStatus('Listo. Redirigiendo...');

        Swal.fire({
          icon: 'success',
          title: '¡Bienvenido!',
          text: 'Has iniciado sesión correctamente.',
          timer: 1200,
          showConfirmButton: false,
        });

        setTimeout(() => router.replace('/'), 300);
      } catch (err) {
        console.error('Error al procesar callback:', err);
        setStatus('No se pudo iniciar sesión.');
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo completar la autenticación.',
          confirmButtonColor: '#0ea5e9',
        });
      }
    };

    handleAuth();
  }, [searchParams, router, setSession]);

  return (
    <div className="mx-auto w-full max-w-md rounded-3xl border border-black/5 bg-white p-8 text-center shadow-sm">
      <h1 className="text-2xl font-bold text-slate-900">Autenticación</h1>
      <p className="mt-3 text-sm text-slate-600">{status}</p>
      <div className="mt-6">
        <div className="inline-flex h-8 w-8 animate-spin rounded-full border-4 border-sky-600 border-t-transparent" />
      </div>
      <div className="mt-6">
        <Link href="/" className="text-sm font-semibold text-sky-700 hover:text-sky-800">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
