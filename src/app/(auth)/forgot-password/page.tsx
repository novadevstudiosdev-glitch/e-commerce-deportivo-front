"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import api from "@/lib/api";
import Input from "@/components/common/Input";

const schema = z.object({
  email: z.string().email("Correo invalido"),
});

type FormValues = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: FormValues) => {
    setMessage(null);
    setError(null);
    try {
      await api.post("/auth/forgot-password", { email: data.email });
      setMessage("Si el correo existe, recibiras instrucciones para recuperar tu cuenta.");
    } catch (err) {
      setError("No se pudo enviar el correo. Intenta nuevamente.");
    }
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-3xl border border-black/5 bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-bold text-slate-900">Recuperar contrasena</h1>
      <p className="mt-2 text-sm text-slate-600">
        Ingresa tu correo y te enviaremos un enlace para restablecerla.
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Correo electronico"
          type="email"
          placeholder="tu@email.com"
          autoComplete="email"
          required
          error={errors.email?.message}
          {...register("email")}
        />

        {error && <p className="text-sm text-red-600">{error}</p>}
        {message && <p className="text-sm text-green-700">{message}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 w-full rounded-xl bg-sky-600 py-3 font-semibold text-white hover:bg-sky-700 disabled:opacity-60"
        >
          {isSubmitting ? "Enviando..." : "Enviar enlace"}
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
