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
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-3xl font-bold mb-6">Mis �"rdenes</h1>
      <OrdersTable orders={orders} isLoading={isLoading} />
    </div>
  );
}

