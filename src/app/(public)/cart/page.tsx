// ============================================
// CART PAGE
// ============================================

'use client';

import Link from 'next/link';
import { ROUTES } from '@/lib/routes';
import { useCart } from '@/hooks';
import { formatCurrency } from '@/lib/utils';
import { CartSummary } from '@/components';

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, totalItems, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-center py-16 text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-600">
          <span className="text-2xl">🛒</span>
        </div>
        <h1 className="mb-3 text-3xl font-bold text-slate-900">Carrito vacio</h1>
        <p className="mb-8 text-sm text-slate-600">
          Todavia no agregaste productos. Explora el catalogo y elegi tus favoritos.
        </p>
        <Link
          href={ROUTES.PRODUCTS}
          className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Ver productos
        </Link>
      </div>
    );
  }

  return (
    <div className="py-10">
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Carrito de compras</h1>
          <p className="mt-2 text-sm text-slate-600">
            {totalItems} producto{totalItems !== 1 ? 's' : ''} en tu carrito
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={clearCart}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            Vaciar carrito
          </button>
          <Link
            href={ROUTES.PRODUCTS}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Seguir comprando
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-4">
          {items.map((item) => {
            const imageUrl = item.product.images?.[0] || '/placeholder.png';
            const lineTotal = item.product.price * item.quantity;

            return (
              <div
                key={item.id}
                className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm md:flex-row md:items-center md:gap-6"
              >
                <div className="h-28 w-full overflow-hidden rounded-xl bg-slate-50 md:h-24 md:w-24">
                  <img src={imageUrl} alt={item.product.name} className="h-full w-full object-cover" />
                </div>

                <div className="flex-1">
                  <p className="text-xs font-semibold uppercase text-slate-400">
                    {item.product.category?.name || 'Producto'}
                  </p>
                  <h3 className="mt-1 text-lg font-semibold text-slate-900">{item.product.name}</h3>
                  <p className="mt-1 text-sm text-slate-500">Precio: {formatCurrency(item.product.price)}</p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    className="h-9 w-9 rounded-full border border-slate-200 text-lg text-slate-700 transition hover:bg-slate-50"
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(event) => {
                      const value = Number(event.target.value);
                      if (!Number.isNaN(value)) {
                        updateQuantity(item.product.id, value);
                      }
                    }}
                    className="h-9 w-16 rounded-lg border border-slate-200 text-center text-sm font-semibold text-slate-900"
                  />
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    className="h-9 w-9 rounded-full border border-slate-200 text-lg text-slate-700 transition hover:bg-slate-50"
                  >
                    +
                  </button>
                </div>

                <div className="flex items-center justify-between gap-4 md:flex-col md:items-end">
                  <p className="text-lg font-semibold text-slate-900">{formatCurrency(lineTotal)}</p>
                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="text-sm font-semibold text-red-500 transition hover:text-red-600"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="space-y-4">
          <CartSummary items={items} />

          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>Subtotal</span>
              <span>{formatCurrency(totalPrice)}</span>
            </div>
            <p className="mt-3 text-xs text-slate-500">
              Finaliza tu compra y selecciona el envio en el checkout.
            </p>
            <Link
              href={ROUTES.CHECKOUT}
              className="mt-4 block w-full rounded-full bg-slate-900 py-3 text-center text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Ir al checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
