'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

type CategoryCard = {
  title: string;
  subtitle: string;
  href: string;
};

const CATEGORY_CARDS: CategoryCard[] = [
  { title: 'Hombre', subtitle: 'Ropa deportiva y casual para hombre', href: '/categories/hombre' },
  { title: 'Mujer', subtitle: 'Colección deportiva femenina', href: '/categories/mujer' },
  { title: 'Niños', subtitle: 'Ropa deportiva para los más pequeños', href: '/categories/ninos' },
  {
    title: 'Accesorios',
    subtitle: 'Complementos y accesorios deportivos',
    href: '/categories/accesorios',
  },
];

const POPULAR_SPORTS = [
  { label: 'Running', href: '/categories/running' },
  { label: 'Fútbol', href: '/categories/futbol' },
  { label: 'Baloncesto', href: '/categories/baloncesto' },
  { label: 'Tenis', href: '/categories/tenis' },
  { label: 'Fitness', href: '/categories/fitness' },
  { label: 'Natación', href: '/categories/natacion' },
];

export function Navbar() {
  const [megaOpen, setMegaOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const megaRef = useRef<HTMLDivElement | null>(null);
  const profileRef = useRef<HTMLDivElement | null>(null);

  // Close on outside click / ESC
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setMegaOpen(false);
        setProfileOpen(false);
      }
    }
    function onClick(e: MouseEvent) {
      const t = e.target as Node;
      if (megaRef.current && !megaRef.current.contains(t)) setMegaOpen(false);
      if (profileRef.current && !profileRef.current.contains(t)) setProfileOpen(false);
    }
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/5 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image src="/logo2.png" alt="SportShop" width={80} height={80} />
        </Link>

        {/* Links */}
        <nav className="hidden items-center gap-4 md:flex">
          <Link
            href="/"
            className="rounded-full px-3 py-2 text-sm text-black/70 hover:bg-black/5 hover:text-black"
          >
            Inicio
          </Link>

          {/* Categorías (Mega menu) */}
          <div className="relative" ref={megaRef}>
            <button
              type="button"
              onClick={() => setMegaOpen((v) => !v)}
              aria-expanded={megaOpen}
              className="flex items-center gap-2 rounded-full px-3 py-2 text-sm text-black/70 hover:bg-black/5 hover:text-black focus:outline-none focus:ring-2 focus:ring-black/10"
            >
              <span className={megaOpen ? 'text-sky-600' : ''}>Categorías</span>
              <ChevronDown className={`h-4 w-4 transition ${megaOpen ? 'rotate-180' : ''}`} />
            </button>

            {megaOpen && (
              <div className="absolute left-0 top-[calc(100%+10px)] w-[760px] rounded-2xl border border-black/10 bg-white p-5 shadow-xl">
                {/* Top cards */}
                <div className="grid grid-cols-2 gap-4">
                  {CATEGORY_CARDS.map((c) => (
                    <Link
                      key={c.title}
                      href={c.href}
                      className="group flex items-center gap-3 rounded-xl border border-black/5 bg-white p-3 hover:bg-black/[0.02]"
                      onClick={() => setMegaOpen(false)}
                    >
                      <div className="h-12 w-12 rounded-xl bg-black/5" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <UserIcon className="h-4 w-4 text-sky-600" />
                          <p className="truncate text-sm font-semibold text-black/80">{c.title}</p>
                        </div>
                        <p className="truncate text-xs text-black/50">{c.subtitle}</p>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Popular sports */}
                <div className="mt-5 border-t border-black/5 pt-4">
                  <p className="mb-3 text-sm font-semibold text-black/70">Deportes Populares</p>
                  <div className="grid grid-cols-3 gap-3">
                    {POPULAR_SPORTS.map((s) => (
                      <Link
                        key={s.label}
                        href={s.href}
                        className="rounded-xl border border-black/5 bg-white px-4 py-2 text-center text-sm text-black/60 hover:bg-black/[0.02]"
                        onClick={() => setMegaOpen(false)}
                      >
                        {s.label}
                      </Link>
                    ))}
                  </div>

                  <Link
                    href="/products"
                    className="mt-4 inline-flex items-center gap-2 text-sm text-sky-700 hover:text-sky-800"
                    onClick={() => setMegaOpen(false)}
                  >
                    Ver todos los productos
                  </Link>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Search */}
        <div className="mx-auto hidden w-full max-w-xl md:block">
          <div className="flex items-center gap-2 rounded-full border border-black/10 bg-black/[0.02] px-4 py-2">
            <SearchIcon className="h-4 w-4 text-black/40" />
            <input
              className="w-full bg-transparent text-sm text-black/80 placeholder:text-black/40 focus:outline-none"
              placeholder="Buscar productos..."
            />
          </div>
        </div>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/login"
            className="rounded-full px-3 py-2 text-sm text-black/70 hover:bg-black/5 hover:text-black focus:outline-none focus:ring-2 focus:ring-black/10"
          >
            Iniciar sesion
          </Link>
          {/* Cart */}
          <Link
            href="/cart"
            className="relative rounded-full p-2 hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-black/10"
            aria-label="Carrito"
          >
            <CartIcon className="h-5 w-5 text-black/70" />
            <span className="absolute -right-0.5 -top-0.5 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-sky-600 px-1 text-[11px] font-semibold text-white">
              3
            </span>
          </Link>

          {/* Profile dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={() => setProfileOpen((v) => !v)}
              aria-expanded={profileOpen}
              className="flex items-center gap-2 rounded-full p-1.5 hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-black/10"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-600 text-xs font-semibold text-white">
                A
              </div>
              <ChevronDown className="h-4 w-4 text-black/60" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-[calc(100%+10px)] w-56 rounded-2xl border border-black/10 bg-white p-2 shadow-xl">
                <Link
                  href="/account"
                  className="block rounded-xl px-3 py-2 text-sm text-black/70 hover:bg-black/5"
                  onClick={() => setProfileOpen(false)}
                >
                  Mi cuenta
                </Link>
                <Link
                  href="/account/orders"
                  className="block rounded-xl px-3 py-2 text-sm text-black/70 hover:bg-black/5"
                  onClick={() => setProfileOpen(false)}
                >
                  Mis compras
                </Link>
                <Link
                  href="/admin"
                  className="block rounded-xl px-3 py-2 text-sm text-black/70 hover:bg-black/5"
                  onClick={() => setProfileOpen(false)}
                >
                  Admin
                </Link>
                <div className="my-2 h-px bg-black/5" />
                <button
                  className="w-full rounded-xl px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    // TODO: logout
                  }}
                >
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile search (opcional) */}
      <div className="px-4 pb-3 md:hidden">
        <div className="flex items-center gap-2 rounded-full border border-black/10 bg-black/[0.02] px-4 py-2">
          <SearchIcon className="h-4 w-4 text-black/40" />
          <input
            className="w-full bg-transparent text-sm text-black/80 placeholder:text-black/40 focus:outline-none"
            placeholder="Buscar productos..."
          />
        </div>
      </div>
    </header>
  );
}

/* Icons (sin librerías, para que te funcione ya) */
function ChevronDown({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function SearchIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.2 4.4l2.7 2.7a1 1 0 0 1-1.4 1.4l-2.7-2.7A7 7 0 0 1 2 9Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function CartIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 6h15l-1.5 9h-12L6 6Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M6 6 5.4 3.8A1 1 0 0 0 4.4 3H2.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M9 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM18 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
        fill="currentColor"
      />
    </svg>
  );
}

function UserIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M20 21a8 8 0 1 0-16 0"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
