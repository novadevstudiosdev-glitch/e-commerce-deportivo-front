'use client';

import { Order } from '@/types';
import { OrdersTable } from '../common/OrdersTable';

// ============================================
// ADMIN ORDERS BOARD - COMPONENTE
// ============================================

interface AdminOrdersBoardProps {
  orders: Order[];
  isLoading?: boolean;
}

export function AdminOrdersBoard({ orders, isLoading }: AdminOrdersBoardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Ordenes</h2>
      <OrdersTable orders={orders} isLoading={isLoading} />
    </div>
  );
}
