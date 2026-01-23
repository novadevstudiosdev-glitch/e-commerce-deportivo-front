// ============================================
// CHECKOUT PAGE (PROTEGIDA)
// ============================================

'use client';

import { CheckoutForm, CartSummary } from '@/components';
import { useCart } from '@/hooks';
import { RequireAuth } from '@/utils/requireAuth';

export default function CheckoutPage() {
  const { items } = useCart();

  return (
    <RequireAuth>
      <div className="py-8">
        <h1 className="text-4xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <CheckoutForm />
          </div>
          <div>
            <CartSummary items={items} />
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}
