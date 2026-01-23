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
  const totalPrice = useCartStore((state) => state.getTotalPrice());

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Resumen del Carrito</h3>
      <div className="space-y-2 mb-4">
        {displayItems.map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span>
              {item.product.name} x {item.quantity}
            </span>
            <span>{formatCurrency(item.product.price * item.quantity)}</span>
          </div>
        ))}
      </div>
      <div className="border-t pt-4">
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>{formatCurrency(totalPrice)}</span>
        </div>
      </div>
    </div>
  );
}
