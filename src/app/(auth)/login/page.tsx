// ============================================
// LOGIN PAGE
// ============================================

'use client';

import { AuthFormLogin } from '@/components';
import Link from 'next/link';
import { ROUTES } from '@/lib/routes';
import { useState } from 'react';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    // TODO: Implementar login
    console.log('Login attempt:', data);
    setIsLoading(false);
  };

  const handleGoogleLogin = () => {
    // TODO: Implementar NextAuth Google login
    console.log('Google login');
  };

  return (
    <div className="py-12 max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8">Ingresar</h1>

      <AuthFormLogin onSubmit={handleSubmit} isLoading={isLoading} />

      <div className="mt-6">
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">O</span>
          </div>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
        >
          <span>Ingresar con Google</span>
        </button>
      </div>

      <p className="text-center mt-6">
        ¿No tienes cuenta?{' '}
        <Link href={ROUTES.AUTH_REGISTER} className="text-blue-600 hover:underline">
          Registrarse
        </Link>
      </p>
    </div>
  );
}
