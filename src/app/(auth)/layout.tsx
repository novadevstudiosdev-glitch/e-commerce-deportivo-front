import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F6F8FB]">
      {/* Header */}
      <header className="mx-auto max-w-7xl px-6 py-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-base font-semibold text-slate-900">
            Sport<span className="text-sky-600">Shop</span>
          </Link>

          <Link href="/" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            Volver al inicio
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 pb-12">{children}</main>

      {/* Footer */}
      <footer className="mx-auto max-w-7xl px-6 pb-10 pt-6 text-xs text-slate-500">
        © {new Date().getFullYear()} SportShop • Soporte • Envíos • Devoluciones
      </footer>
    </div>
  );
}
