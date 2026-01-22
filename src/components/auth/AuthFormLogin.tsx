import Input from '@/components/common/Input';

export default function LoginForm() {
  return (
    <form className="space-y-4">
      <Input label="Correo electrónico" placeholder="tu@email.com" type="email" required />

      <Input label="Contraseña" placeholder="••••••••" type="password" required />

      <button className="mt-4 w-full rounded-xl bg-sky-600 py-3 font-semibold text-white hover:bg-sky-700">
        Iniciar sesión
      </button>

      <button
        type="button"
        className="w-full rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
      >
        Continuar con Google
      </button>
    </form>
  );
}
