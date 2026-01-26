import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/components/common/Input";

const registerSchema = z
  .object({
    firstName: z.string().min(2, "Nombre requerido"),
    lastName: z.string().min(2, "Apellido requerido"),
    email: z.string().email("Email inválido"),
    password: z.string().min(8, "Minimo 8 caracteres"),
    confirmPassword: z.string().min(8, "Minimo 8 caracteres"),
    phone: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contrasenas no coinciden",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

type Props = {
  onSubmit?: (data: RegisterFormValues) => Promise<void> | void;
  isLoading?: boolean;
};

export default function RegisterForm({ onSubmit, isLoading = false }: Props) {
  const [formError, setFormError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
    },
  });

  const googleAuthUrl = `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api"}/auth/google`;

  const handleFormSubmit = async (data: RegisterFormValues) => {
    setFormError(null);
    setIsVerifying(true);

    try {
      if (onSubmit) {
        await onSubmit(data);
      } else {
        console.log("Register attempt:", data);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo completar el registro";
      setFormError(message || "No se pudo completar el registro");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleGoogle = () => {
    if (typeof window !== "undefined") {
      window.location.href = googleAuthUrl;
    }
  };

  const isBusy = isSubmitting || isVerifying || isLoading;

  return (
    <form className="space-y-4" onSubmit={handleSubmit(handleFormSubmit)}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input
          label="Nombre"
          placeholder="Juan"
          autoComplete="given-name"
          required
          error={errors.firstName?.message}
          {...register("firstName")}
        />

        <Input
          label="Apellido"
          placeholder="Perez"
          autoComplete="family-name"
          required
          error={errors.lastName?.message}
          {...register("lastName")}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input
          label="Correo electronico"
          placeholder="tu@email.com"
          type="email"
          autoComplete="email"
          required
          error={errors.email?.message}
          {...register("email")}
        />

        <Input
          label="Telefono"
          placeholder="+54 9 11 1234 5678"
          autoComplete="tel"
          error={errors.phone?.message}
          {...register("phone")}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input
          label="Contrasena"
          placeholder="Minimo 8 caracteres"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          required
          error={errors.password?.message}
          rightElement={
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="text-slate-500 hover:text-slate-700"
              aria-label={showPassword ? "Ocultar contrasena" : "Mostrar contrasena"}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          }
          {...register("password")}
        />

        <Input
          label="Confirmar contrasena"
          placeholder="Repite tu contrasena"
          type={showConfirm ? "text" : "password"}
          autoComplete="new-password"
          required
          error={errors.confirmPassword?.message}
          rightElement={
            <button
              type="button"
              onClick={() => setShowConfirm((prev) => !prev)}
              className="text-slate-500 hover:text-slate-700"
              aria-label={showConfirm ? "Ocultar contrasena" : "Mostrar contrasena"}
            >
              {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          }
          {...register("confirmPassword")}
        />
      </div>

      {formError && <p className="text-sm text-red-600">{formError}</p>}

      <button
        type="submit"
        disabled={isBusy}
        className="mt-2 w-full rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 py-3 font-semibold text-white hover:opacity-90 disabled:opacity-60"
      >
        {isBusy ? "Validando..." : "Crear cuenta"}
      </button>

      <button
        type="button"
        onClick={handleGoogle}
        className="w-full rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
      >
        Registrarse con Google
      </button>
    </form>
  );
}

function EyeIcon({ className = "" }: { className?: string }) {
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

function EyeOffIcon({ className = "" }: { className?: string }) {
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
        d="M3 5l18 14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
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
