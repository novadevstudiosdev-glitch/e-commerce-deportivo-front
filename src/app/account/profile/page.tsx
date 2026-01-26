// ============================================
// PROFILE PAGE (PROTEGIDA)
// ============================================

'use client';

import { ProfileForm } from '@/components';
import { useState } from 'react';
import { useAuth } from '@/hooks';

export default function ProfilePage() {
  const { session } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    // TODO: Actualizar perfil
    console.log('Updating profile:', data);
    setIsLoading(false);
  };

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">Informacion personal</h1>
          <p className="text-sm text-slate-500">Actualiza tus datos y contacto.</p>
        </div>
        <button
          type="button"
          className="text-xs font-semibold text-sky-600 hover:text-sky-700"
        >
          Editar
        </button>
      </div>
      <ProfileForm profile={session?.user} onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}
