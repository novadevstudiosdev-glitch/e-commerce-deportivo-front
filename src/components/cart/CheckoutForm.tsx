'use client';

// ============================================
// CHECKOUT FORM - COMPONENTE (SKELETON)
// ============================================

interface CheckoutFormProps {
  onSubmit?: (data: any) => void;
}

export function CheckoutForm({ onSubmit }: CheckoutFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implementar validación con React Hook Form + Zod
    onSubmit?.({});
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Formulario de Pago</h3>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Nombre"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
          <input
            type="text"
            placeholder="Dirección"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition"
      >
        Completar Compra
      </button>
    </form>
  );
}
