// ============================================
// ORDERS PAGE (PROTEGIDA)
// ============================================

'use client';

import { OrdersTable } from '@/components';
import { useState, useEffect } from 'react';
import { Order } from '@/types';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Cargar �rdenes del usuario
    setIsLoading(false);
  }, []);

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-slate-900">Historial de pedidos</h1>
        <p className="text-sm text-slate-500">Revisa el estado de tus compras recientes.</p>
      </div>
      <OrdersTable orders={orders} isLoading={isLoading} />
    </div>
  );
}
