'use client';

import { Order } from '@/types';
import { formatCurrency, formatDateTime, ORDER_STATUS_LABELS } from '@/lib/utils';

// ============================================
// ORDERS TABLE - COMPONENTE
// ============================================

interface OrdersTableProps {
  orders: Order[];
  isLoading?: boolean;
}

export function OrdersTable({ orders, isLoading }: OrdersTableProps) {
  if (isLoading) {
    return <div className="text-center py-8">Cargando órdenes...</div>;
  }

  if (orders.length === 0) {
    return <div className="text-center py-8 text-gray-500">No hay órdenes</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-100 border-b">
          <tr>
            <th className="px-4 py-3 text-left font-semibold">ID</th>
            <th className="px-4 py-3 text-left font-semibold">Fecha</th>
            <th className="px-4 py-3 text-left font-semibold">Total</th>
            <th className="px-4 py-3 text-left font-semibold">Estado</th>
            <th className="px-4 py-3 text-left font-semibold">Seguimiento</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-3">{order.id}</td>
              <td className="px-4 py-3">{formatDateTime(order.createdAt)}</td>
              <td className="px-4 py-3">{formatCurrency(order.totalAmount)}</td>
              <td className="px-4 py-3">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                  {ORDER_STATUS_LABELS[order.status]}
                </span>
              </td>
              <td className="px-4 py-3">{order.trackingNumber || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
