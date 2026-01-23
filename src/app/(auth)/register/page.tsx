// ============================================
// REGISTER PAGE
// ============================================

'use client';

import { AuthFormRegister } from '@/components';
import Link from 'next/link';
import { ROUTES } from '@/lib/routes';
import { useState } from 'react';

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    // TODO: Implementar registro
    console.log('Register attempt:', data);
    setIsLoading(false);
  };

  return (
    <div className="py-12 max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8">Crear Cuenta</h1>

      <AuthFormRegister onSubmit={handleSubmit} isLoading={isLoading} />

      <p className="text-center mt-6">
        ¿Ya tienes cuenta?{' '}
        <Link href={ROUTES.AUTH_LOGIN} className="text-blue-600 hover:underline">
          Ingresar
        </Link>
      </p>
    </div>
  );
}
