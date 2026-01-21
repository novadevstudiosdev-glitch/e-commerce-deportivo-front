// ============================================
// ADMIN ORDERS PAGE
// ============================================

'use client';

import { AdminOrdersBoard } from '@/components';
import { useState, useEffect } from 'react';
import { Order } from '@/types';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Cargar órdenes
    setIsLoading(false);
  }, []);

  const handleStatusChange = (orderId: string, status: string) => {
    // TODO: Actualizar estado de orden
    console.log('Updating order status:', { orderId, status });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Gestionar Órdenes</h1>
      <AdminOrdersBoard orders={orders} isLoading={isLoading} onStatusChange={handleStatusChange} />
    </div>
  );
}
