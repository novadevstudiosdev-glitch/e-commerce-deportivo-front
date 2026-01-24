'use client';

import { CartItem } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { useCartStore } from '@/store';

// ============================================
// CART SUMMARY - COMPONENTE
// ============================================

interface CartSummaryProps {
  items?: CartItem[];
}

export function CartSummary({ items }: CartSummaryProps) {
  const storeItems = useCartStore((state) => state.items);
  const displayItems = items || storeItems;
  const subtotal = displayItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );
  const shipping = subtotal > 0 ? 0 : 0;
  const taxes = 0;
  const total = subtotal + shipping + taxes;

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">Resumen del carrito</h3>
      <p className="mt-1 text-xs text-slate-500">Revision de productos y totales</p>

      <div className="mt-5 space-y-3 text-sm">
        {displayItems.map((item) => (
          <div key={item.id} className="flex items-start justify-between gap-3">
            <div>
              <p className="font-medium text-slate-900">{item.product.name}</p>
              <p className="text-xs text-slate-500">Cantidad: {item.quantity}</p>
            </div>
            <span className="font-semibold text-slate-700">
              {formatCurrency(item.product.price * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-2 border-t border-slate-100 pt-4 text-sm">
        <div className="flex items-center justify-between text-slate-600">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between text-slate-600">
          <span>Envio</span>
          <span>{shipping === 0 ? 'Gratis' : formatCurrency(shipping)}</span>
        </div>
        <div className="flex items-center justify-between text-slate-600">
          <span>Impuestos</span>
          <span>{formatCurrency(taxes)}</span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-lg font-semibold text-slate-900">
        <span>Total</span>
        <span>{formatCurrency(total)}</span>
      </div>
    </div>
  );
}
