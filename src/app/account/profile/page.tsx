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
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-3xl font-bold mb-6">Editar Perfil</h1>
      <ProfileForm profile={session?.user} onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}
