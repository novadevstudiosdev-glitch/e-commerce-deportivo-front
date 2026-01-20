import { Navbar, Footer } from '@/components';

// ============================================
// ROOT LAYOUT
// ============================================

export const metadata = {
  title: 'SportWear - E-commerce Deportivo',
  description: 'Catálogo de ropa y accesorios deportivos',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-white text-gray-900">
        <Navbar />
        <main className="min-h-screen max-w-7xl mx-auto px-4 py-8">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
