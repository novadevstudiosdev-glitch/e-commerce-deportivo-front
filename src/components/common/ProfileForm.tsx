'use client';

import { UserProfile } from '@/types';

// ============================================
// PROFILE FORM - COMPONENTE
// ============================================

interface ProfileFormProps {
  profile?: UserProfile;
  onSubmit?: (data: any) => void;
  isLoading?: boolean;
}

export function ProfileForm({ profile, onSubmit, isLoading }: ProfileFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implementar validación con React Hook Form + Zod
    onSubmit?.({});
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Nombre"
          defaultValue={profile?.firstName}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          disabled={isLoading}
        />
        <input
          type="text"
          placeholder="Apellido"
          defaultValue={profile?.lastName}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          disabled={isLoading}
        />
      </div>
      <input
        type="email"
        placeholder="Email"
        defaultValue={profile?.email}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        disabled={isLoading}
      />
      <input
        type="text"
        placeholder="DNI"
        defaultValue={profile?.dni}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        disabled={isLoading}
      />
      <input
        type="text"
        placeholder="Domicilio"
        defaultValue={profile?.address}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        disabled={isLoading}
      />
      <input
        type="tel"
        placeholder="Teléfono"
        defaultValue={profile?.phone}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
      >
        {isLoading ? 'Guardando...' : 'Guardar Cambios'}
      </button>
    </form>
  );
}
