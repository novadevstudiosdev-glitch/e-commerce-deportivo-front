import Input from '@/components/common/Input';

export default function RegisterForm() {
  return (
    <form className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input label="Nombre completo" placeholder="Juan Pérez" required />

        <Input label="Correo electrónico" placeholder="tu@email.com" type="email" required />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input label="Contraseña" placeholder="Mínimo 6 caracteres" type="password" required />

        <Input
          label="Confirmar contraseña"
          placeholder="Repite tu contraseña"
          type="password"
          required
        />
      </div>

      <Input label="Teléfono" placeholder="+54 9 11 1234 5678" />

      <Input label="Dirección" placeholder="Calle, Ciudad, Provincia" />

      <button className="mt-4 w-full rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 py-3 font-semibold text-white hover:opacity-90">
        Crear cuenta
      </button>
    </form>
  );
}
