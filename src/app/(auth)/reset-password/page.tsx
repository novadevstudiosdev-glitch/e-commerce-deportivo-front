"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import api from "@/lib/api";
import Input from "@/components/common/Input";

const schema = z
  .object({
    newPassword: z.string().min(8, "Minimo 8 caracteres"),
    confirmPassword: z.string().min(8, "Minimo 8 caracteres"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Las contrasenas no coinciden",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  useEffect(() => {
    setEmail(searchParams.get("email"));
    setToken(searchParams.get("token"));
  }, [searchParams]);

  const onSubmit = async (data: FormValues) => {
    setMessage(null);
    setError(null);

    if (!email || !token) {
      setError("Faltan datos para restablecer la contrasena.");
      return;
    }

    try {
      await api.post("/auth/reset-password", {
        email,
        token,
        newPassword: data.newPassword,
      });
      setMessage("Contrasena actualizada. Ya puedes iniciar sesion.");
    } catch (err) {
      setError("No se pudo restablecer la contrasena.");
    }
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-3xl border border-black/5 bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-bold text-slate-900">Restablecer contrasena</h1>
      <p className="mt-2 text-sm text-slate-600">Ingresa tu nueva contrasena.</p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Nueva contrasena"
          type="password"
          placeholder="Minimo 8 caracteres"
          required
          error={errors.newPassword?.message}
          {...register("newPassword")}
        />

        <Input
          label="Confirmar contrasena"
          type="password"
          placeholder="Repite tu contrasena"
          required
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        {error && <p className="text-sm text-red-600">{error}</p>}
        {message && <p className="text-sm text-green-700">{message}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 w-full rounded-xl bg-sky-600 py-3 font-semibold text-white hover:bg-sky-700 disabled:opacity-60"
        >
          {isSubmitting ? "Guardando..." : "Actualizar contrasena"}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-slate-600">
        <Link href="/login" className="font-semibold text-sky-700 hover:text-sky-800">
          Volver a iniciar sesion
        </Link>
      </div>
    </div>
  );
}
