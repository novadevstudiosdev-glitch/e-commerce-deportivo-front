import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from '@/components/common/Input';

const loginSchema = z.object({
  email: z.string().email('Correo invalido'),
  password: z.string().min(8, 'Minimo 8 caracteres'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

type Props = {
  onSubmit?: (data: LoginFormValues) => Promise<void> | void;
};

export default function LoginForm({ onSubmit }: Props) {
  const [formError, setFormError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const googleAuthUrl = `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api'}/auth/google`;

  const handleFormSubmit = async (data: LoginFormValues) => {
    setFormError(null);
    try {
      if (onSubmit) {
        await onSubmit(data);
      } else {
        console.log('Login attempt:', data);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo iniciar sesion';
      setFormError(message || 'No se pudo iniciar sesion');
    }
  };

  const handleGoogle = () => {
    if (typeof window !== 'undefined') {
      window.location.href = googleAuthUrl;
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(handleFormSubmit)}>
      <Input
        label="Correo electronico"
        placeholder="tu@email.com"
        type="email"
        autoComplete="email"
        required
        error={errors.email?.message}
        {...register('email')}
      />

      <div className="space-y-2">
        <Input
          label="Contrasena"
          placeholder="Minimo 8 caracteres"
          type={showPassword ? 'text' : 'password'}
          autoComplete="current-password"
          required
          error={errors.password?.message}
          rightElement={
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="text-slate-500 hover:text-slate-700"
              aria-label={showPassword ? 'Ocultar contrasena' : 'Mostrar contrasena'}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          }
          {...register('password')}
        />

        <div className="flex justify-end">
          <Link
            href="/auth/forgot-password"
            className="text-xs font-semibold text-sky-700 hover:text-sky-800"
          >
            Olvidaste tu contrasena?
          </Link>
        </div>
      </div>

      {formError && <p className="text-sm text-red-600">{formError}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 w-full rounded-xl bg-sky-600 py-3 font-semibold text-white hover:bg-sky-700 disabled:opacity-60"
      >
        {isSubmitting ? 'Validando...' : 'Iniciar sesion'}
      </button>

      <button
        type="button"
        onClick={handleGoogle}
        className="w-full rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
      >
        Continuar con Google
      </button>
    </form>
  );
}

function EyeIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      width="18"
      height="18"
    >
      <path
        d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function EyeOffIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      width="18"
      height="18"
    >
      <path d="M3 5l18 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path
        d="M6.5 7.8C4.1 9.5 2 12 2 12s3.5 6 10 6c2.2 0 4.1-.6 5.7-1.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M9.2 9.7a3.5 3.5 0 0 0 4.9 4.9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
