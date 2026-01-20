// ============================================
// ADMIN LAYOUT
// ============================================

'use client';

import { RequireAdmin } from '@/utils/requireAdmin';
import { AdminSidebar } from '@/components';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAdmin>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 ml-64 p-8">{children}</main>
      </div>
    </RequireAdmin>
  );
}
