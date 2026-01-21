// ============================================
// CART PAGE
// ============================================

'use client';

import { CartSummary } from '@/components';
import { useCart } from '@/hooks';
import Link from 'next/link';
import { ROUTES } from '@/lib/routes';

export default function CartPage() {
  const { items, removeItem, updateQuantity } = useCart();

  if (items.length === 0) {
    return (
      <div className="py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Carrito Vacío</h1>
        <p className="text-gray-600 mb-6">No tienes productos en tu carrito</p>
        <Link
          href={ROUTES.PRODUCTS}
          className="inline-block bg-blue-600 text-white font-semibold py-2 px-6 rounded hover:bg-blue-700 transition"
        >
          Continuar Comprando
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8">
      <h1 className="text-4xl font-bold mb-8">Tu Carrito</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 p-4 bg-white rounded-lg shadow">
              <div className="flex-1">
                <h3 className="font-semibold">{item.product.name}</h3>
                <p className="text-gray-600">${item.product.price}</p>
              </div>
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => updateQuantity(item.product.id, parseInt(e.target.value))}
                className="w-20 px-2 py-1 border border-gray-300 rounded"
              />
              <button
                onClick={() => removeItem(item.product.id)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>

        <div>
          <CartSummary items={items} />
          <Link
            href={ROUTES.CHECKOUT}
            className="block mt-4 w-full bg-blue-600 text-white font-semibold py-3 text-center rounded hover:bg-blue-700 transition"
          >
            Proceder al Pago
          </Link>
        </div>
      </div>
    </div>
  );
}
