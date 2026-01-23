import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-black/5 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-14">
        {/* Top */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Sport<span className="text-sky-600">Shop</span>
            </h3>
            <p className="mt-3 text-sm text-slate-600">
              Tu tienda de ropa y accesorios deportivos. Rendimiento, estilo y calidad en un solo
              lugar.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900">Tienda</h4>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li>
                <Link href="/products" className="hover:text-sky-600">
                  Productos
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-sky-600">
                  Categorías
                </Link>
              </li>
              <li>
                <Link href="/products?sort=deals" className="hover:text-sky-600">
                  Ofertas
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-sky-600">
                  Carrito
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900">Cuenta</h4>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li>
                <Link href="/login" className="hover:text-sky-600">
                  Iniciar sesión
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-sky-600">
                  Registrarse
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-sky-600">
                  Mi cuenta
                </Link>
              </li>
              <li>
                <Link href="/account/orders" className="hover:text-sky-600">
                  Mis compras
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900">Ayuda</h4>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li>
                <Link href="#" className="hover:text-sky-600">
                  Soporte
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-sky-600">
                  Envíos
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-sky-600">
                  Cambios y devoluciones
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-sky-600">
                  Términos y condiciones
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="my-10 h-px bg-black/5" />

        {/* Bottom */}
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} SportShop. Todos los derechos reservados.
          </p>

          <div className="flex items-center gap-4 text-slate-500">
            <span className="text-xs">Argentina</span>
            <span className="h-1 w-1 rounded-full bg-slate-400" />
            <span className="text-xs">Español</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
