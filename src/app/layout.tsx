import './globals.css';
import AuthBootstrap from '@/components/auth/AuthBootstrap';
import CartBootstrap from '@/components/cart/CartBootstrap';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <AuthBootstrap />
        <CartBootstrap />
        {children}
      </body>
    </html>
  );
}
