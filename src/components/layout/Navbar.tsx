'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { useAuthStore } from '@/store';
import { useCart } from '@/hooks';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Swal from 'sweetalert2';

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
  const router = useRouter();
  const { session, logout } = useAuthStore();
  const canAccessAdmin = session?.role === 'admin' || session?.role === 'vendedor';
  const adminHref = session?.role === 'vendedor' ? '/admin/products' : '/admin';
  const { totalItems } = useCart();
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isAuthPage = pathname === '/login' || pathname === '/register';
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (pathname === '/products') {
      setSearchTerm(searchParams.get('search') ?? '');
    } else {
      setSearchTerm('');
    }
  }, [pathname, searchParams]);

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = searchTerm.trim();
    if (!value) {
      router.push('/products');
      return;
    }
    router.push(`/products?search=${encodeURIComponent(value)}`);
  };

  const handleLogout = async () => {
    const result = await Swal.fire({
      icon: 'warning',
      title: '¿Cerrar sesión?',
      text: '¿Estás seguro de que deseas cerrar sesión?',
      showCancelButton: true,
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
    });

    if (result.isConfirmed) {
      logout();
      router.push('/');
      await Swal.fire({
        icon: 'success',
        title: 'Sesión cerrada',
        text: 'Has cerrado sesión correctamente.',
        confirmButtonColor: '#0ea5e9',
      });
    }
  };
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
          <Image
            src="/logo.png"
            alt="SportShop"
            width={120}
            height={120}
            style={{ width: 'auto', height: 'auto' }}
          />
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
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center gap-2 rounded-full border border-black/10 bg-black/[0.02] px-4 py-2"
          >
            <SearchIcon className="h-4 w-4 text-black/40" />
            <input
              className="w-full bg-transparent text-sm text-black/80 placeholder:text-black/40 focus:outline-none"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </form>
        </div>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-2">
          {!isClient ? null : session?.isAuthenticated ? (
            <>
              {/* Carrito solo cuando está logueado */}
              <Link
                href="/cart"
                className="relative rounded-full p-2 hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-black/10"
                aria-label="Carrito"
              >
                <CartIcon className="h-5 w-5 text-black/70" />
                <span className="absolute -right-0.5 -top-0.5 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-sky-600 px-1 text-[11px] font-semibold text-white">{totalItems}</span>
              </Link>

              {/* Profile dropdown cuando está logueado */}
              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  onClick={() => setProfileOpen((v) => !v)}
                  aria-expanded={profileOpen}
                  className="flex items-center gap-2 rounded-full px-3 py-1.5 hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-black/10"
                >
                  <span className="hidden text-sm font-medium text-sky-600 sm:inline">
                    ¡Hola, {session?.user?.firstName || 'Usuario'}!
                  </span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-600 text-xs font-semibold text-white">
                    {(session?.user?.firstName || 'U').charAt(0).toUpperCase()}
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 text-black/60 transition ${profileOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-[calc(100%+10px)] w-56 rounded-2xl border border-black/10 bg-white p-2 shadow-xl">
                    <div className="px-3 py-2 text-sm text-black/60">
                      <p className="font-semibold text-black/80">
                        {session?.user?.firstName} {session?.user?.lastName}
                      </p>
                      <p className="text-xs">{session?.user?.email}</p>
                    </div>
                    <div className="my-2 h-px bg-black/5" />
                    <Link
                      href="/account/profile"
                      className="block rounded-xl px-3 py-2 text-sm text-black/70 hover:bg-black/5"
                      onClick={() => setProfileOpen(false)}
                    >
                      Mi perfil
                    </Link>
                    <Link
                      href="/account/orders"
                      className="block rounded-xl px-3 py-2 text-sm text-black/70 hover:bg-black/5"
                      onClick={() => setProfileOpen(false)}
                    >
                      Mis pedidos
                    </Link>
                    <Link
                      href="/account/addresses"
                      className="block rounded-xl px-3 py-2 text-sm text-black/70 hover:bg-black/5"
                      onClick={() => setProfileOpen(false)}
                    >
                      Direcciones
                    </Link>
                    <Link
                      href="/account/preferences"
                      className="block rounded-xl px-3 py-2 text-sm text-black/70 hover:bg-black/5"
                      onClick={() => setProfileOpen(false)}
                    >
                      Preferencias
                    </Link>
                    {canAccessAdmin && (
                      <Link
                        href={adminHref}
                        className="block rounded-xl px-3 py-2 text-sm text-black/70 hover:bg-black/5"
                        onClick={() => setProfileOpen(false)}
                      >
                        Admin
                      </Link>
                    )}
                    <div className="my-2 h-px bg-black/5" />
                    <button
                      className="w-full rounded-xl px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                      type="button"
                      onClick={() => {
                        setProfileOpen(false);
                        handleLogout();
                      }}
                    >
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Cuando NO está logueado */}
              <Link
                href="/register"
                className="rounded-full px-4 py-2 text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 transition focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                Registrarse
              </Link>
              <Link
                href="/login"
                className="rounded-full px-4 py-2 text-sm text-black/70 hover:bg-black/5 hover:text-black focus:outline-none focus:ring-2 focus:ring-black/10"
              >
                Iniciar sesion
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile search (opcional) */}
      <div className="px-4 pb-3 md:hidden">
        <form
          onSubmit={handleSearchSubmit}
          className="flex items-center gap-2 rounded-full border border-black/10 bg-black/[0.02] px-4 py-2"
        >
          <SearchIcon className="h-4 w-4 text-black/40" />
          <input
            className="w-full bg-transparent text-sm text-black/80 placeholder:text-black/40 focus:outline-none"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </form>

        <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1">
          <Link
            href="/"
            className="whitespace-nowrap rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-semibold text-black/70"
          >
            Inicio
          </Link>
          {CATEGORY_CARDS.map((category) => (
            <Link
              key={category.title}
              href={category.href}
              className="whitespace-nowrap rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-semibold text-black/70"
            >
              {category.title}
            </Link>
          ))}
        </div>
      </div>
      {isAuthPage && (
        <div className="border-t border-black/5 bg-white">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-2 text-xs text-black/60">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-black/[0.04] px-3 py-1">Envios a todo el pais</span>
              <span className="rounded-full bg-black/[0.04] px-3 py-1">Cambios faciles</span>
              <span className="rounded-full bg-black/[0.04] px-3 py-1">Pago seguro</span>
            </div>
            <div className="hidden sm:flex items-center gap-3">
              <Link
                href="/product-catalog"
                className="font-semibold text-sky-700 hover:text-sky-800"
              >
                Ver catalogo
              </Link>
              <Link href="/" className="text-black/60 hover:text-black/80">
                Inicio
              </Link>
            </div>
          </div>
        </div>
      )}
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




