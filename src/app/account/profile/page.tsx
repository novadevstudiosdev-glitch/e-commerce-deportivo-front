// ============================================
// PROFILE PAGE (PROTEGIDA)
// ============================================

'use client';

import { ProfileForm } from '@/components';
import { useState } from 'react';
import { useAuth } from '@/hooks';
import { userService } from '@/services/user.service';
import type { UserProfile } from '@/types';

export default function ProfilePage() {
  const { session } = useAuth();
  const { setSession } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (data: Partial<UserProfile>) => {
    setIsLoading(true);
    setMessage(null);
    try {
      const payload: Parameters<typeof userService.updateMe>[0] = {};
      if (data.email) payload.email = data.email;
      if (data.firstName) payload.first_name = data.firstName;
      if (data.lastName) payload.last_name = data.lastName;
      if (data.dni) payload.dni = data.dni;
      if (data.phone) payload.phone = data.phone;

      const response = await userService.updateMe(payload);

      if (session) {
        const nextUser: UserProfile = {
          ...session.user,
          email: response.email ?? session.user.email,
          firstName: response.profile?.first_name ?? session.user.firstName,
          lastName: response.profile?.last_name ?? session.user.lastName,
          dni: response.profile?.dni ?? session.user.dni,
          phone: response.profile?.phone ?? session.user.phone,
        };
        setSession({ ...session, user: nextUser });
      }

      setMessage('Perfil actualizado correctamente.');
    } catch (error) {
      const text = error instanceof Error ? error.message : 'No se pudo actualizar el perfil.';
      setMessage(text);
    } finally {
      setIsLoading(false);
    }
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
      {message && (
        <p className="mt-4 text-sm text-slate-600">
          {message}
        </p>
      )}
    </div>
  );
}
