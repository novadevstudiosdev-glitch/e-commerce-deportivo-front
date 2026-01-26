// ============================================
// ADDRESSES PAGE (PROTEGIDA)
// ============================================

'use client';

export default function AddressesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">Direcciones de envio</h1>
          <p className="text-sm text-slate-500">Administra tus direcciones guardadas.</p>
        </div>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-full bg-sky-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-sky-600"
        >
          + Anadir Direccion
        </button>
      </div>

      <div className="space-y-4">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-semibold text-slate-900">Carlos Martinez</p>
              <p className="text-xs text-slate-500">Calle Gran Via, 45, 3 B</p>
              <p className="text-xs text-slate-500">28013 Madrid, Madrid</p>
              <p className="text-xs text-slate-500">Telefono: +34 612 345 678</p>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
              Predeterminada
            </span>
          </div>
          <div className="mt-4 flex flex-wrap gap-3 text-xs font-semibold">
            <button className="text-slate-600 hover:text-slate-900" type="button">
              Editar
            </button>
            <button className="text-red-500 hover:text-red-600" type="button">
              Eliminar
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div>
            <p className="text-sm font-semibold text-slate-900">Carlos Martinez</p>
            <p className="text-xs text-slate-500">Avenida Diagonal, 123, 5 A</p>
            <p className="text-xs text-slate-500">08019 Barcelona, Barcelona</p>
            <p className="text-xs text-slate-500">Telefono: +34 612 345 678</p>
          </div>
          <div className="mt-4 flex flex-wrap gap-3 text-xs font-semibold">
            <button className="text-sky-600 hover:text-sky-700" type="button">
              Predeterminada
            </button>
            <button className="text-slate-600 hover:text-slate-900" type="button">
              Editar
            </button>
            <button className="text-red-500 hover:text-red-600" type="button">
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
