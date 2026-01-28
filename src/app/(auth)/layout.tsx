import Link from "next/link";
import Image from "next/image";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F6F8FB]">
      {/* Header */}
      <header className="bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="SportShop"
              width={90}
              height={36}
              style={{ width: 'auto', height: 'auto' }}
            />
          </Link>

          <Link
            href="/"
            className="rounded-full border border-black/10 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Volver al inicio
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 pb-12 pt-8">{children}</main>

      {/* Footer */}
      <footer className="mx-auto max-w-7xl px-6 pb-10 pt-6 text-xs text-slate-500">
        (c) {new Date().getFullYear()} SportShop - Soporte - Envios - Devoluciones
      </footer>
    </div>
  );
}
