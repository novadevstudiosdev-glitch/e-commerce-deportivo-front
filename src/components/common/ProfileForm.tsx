'use client';

import type { FormEvent } from 'react';
import { UserProfile } from '@/types';

// ============================================
// PROFILE FORM - COMPONENTE
// ============================================

interface ProfileFormProps {
  profile?: UserProfile;
  onSubmit?: (data: Partial<UserProfile>) => void;
  isLoading?: boolean;
}

export function ProfileForm({ profile, onSubmit, isLoading }: ProfileFormProps) {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Implementar validación con React Hook Form + Zod
    const formData = new FormData(e.currentTarget);
    const firstName = String(formData.get('firstName') ?? '').trim();
    const lastName = String(formData.get('lastName') ?? '').trim();
    const email = String(formData.get('email') ?? '').trim();
    const dni = String(formData.get('dni') ?? '').trim();
    const address = String(formData.get('address') ?? '').trim();
    const phone = String(formData.get('phone') ?? '').trim();

    const payload: Partial<UserProfile> = {
      firstName: firstName || undefined,
      lastName: lastName || undefined,
      email: email || undefined,
      dni: dni || undefined,
      address: address || undefined,
      phone: phone || undefined,
    };
    onSubmit?.(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <input
          type="text"
          placeholder="Nombre"
          name="firstName"
          defaultValue={profile?.firstName}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          disabled={isLoading}
        />
        <input
          type="text"
          placeholder="Apellido"
          name="lastName"
          defaultValue={profile?.lastName}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          disabled={isLoading}
        />
      </div>
      <input
        type="email"
        placeholder="Email"
        name="email"
        defaultValue={profile?.email}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        disabled={isLoading}
      />
      <input
        type="text"
        placeholder="DNI"
        name="dni"
        defaultValue={profile?.dni}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        disabled={isLoading}
      />
      <input
        type="text"
        placeholder="Domicilio"
        name="address"
        defaultValue={profile?.address}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        disabled={isLoading}
      />
      <input
        type="tel"
        placeholder="Teléfono"
        name="phone"
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

