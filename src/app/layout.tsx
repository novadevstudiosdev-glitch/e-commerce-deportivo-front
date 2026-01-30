import './globals.css';
import AuthBootstrap from '@/components/auth/AuthBootstrap';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <AuthBootstrap />
        {children}
      </body>
    </html>
  );
}
