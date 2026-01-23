# 🚀 QUICK START GUIDE - DESARROLLO

## Paso 1: Instalación

```bash
cd e-commerce-deportivo-front
npm install
cp .env.local.example .env.local
npm run dev
```

Abre http://localhost:3000

---

## Paso 2: Conectar API Real

### En cada archivo de service:

**Antes (placeholder):**

```typescript
// src/services/products.service.ts
async getProducts(filters?) {
  console.log('Fetching products...', filters);
  return { products: [], total: 0 };
}
```

**Después (real):**

```typescript
async getProducts(filters?) {
  const response = await api.get('/products', { params: filters });
  return response.data;
}
```

---

## Paso 3: Implementar React Hook Form

### Componente con RHF:

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/lib/validations';

interface AuthFormLoginProps {
  onSubmit?: (data: any) => void;
}

export function AuthFormLogin({ onSubmit }: AuthFormLoginProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input
        {...register('email')}
        type="email"
        placeholder="Email"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
      />
      {errors.email && <span className="text-red-600">{errors.email.message}</span>}

      <input
        {...register('password')}
        type="password"
        placeholder="Password"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
      />
      {errors.password && <span className="text-red-600">{errors.password.message}</span>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
      >
        {isSubmitting ? 'Cargando...' : 'Ingresar'}
      </button>
    </form>
  );
}
```

---

## Paso 4: Usar Zustand Store

### En componente:

```typescript
'use client';
import { useCart } from '@/hooks';

export function CartPage() {
  const { items, addItem, removeItem, totalPrice } = useCart();

  const handleAddToCart = (product: Product) => {
    addItem(product, 1);
  };

  return (
    <div>
      <h1>Tu Carrito ({items.length} items)</h1>
      {items.map((item) => (
        <div key={item.id}>
          {item.product.name} - Cantidad: {item.quantity}
          <button onClick={() => removeItem(item.product.id)}>Eliminar</button>
        </div>
      ))}
      <p>Total: ${totalPrice}</p>
    </div>
  );
}
```

---

## Paso 5: Implementar NextAuth

### Configurar en lib/auth.ts:

```typescript
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions = {
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Llamar a tu API
        const response = await fetch('http://localhost:3001/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials),
        });

        if (response.ok) {
          const user = await response.json();
          return user; // { id, email, name, role }
        }
        return null;
      },
    }),
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  pages: {
    signIn: '/auth/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
      }
      return session;
    },
  },
};

export const handler = NextAuth(authOptions);
```

### Crear route handler en app/api/auth/[...nextauth]/route.ts:

```typescript
import { handler } from '@/lib/auth';
export const GET = handler;
export const POST = handler;
```

---

## Paso 6: Proteger Rutas

### Con middleware.ts:

```typescript
import { withAuth } from 'next-auth/middleware';

export const middleware = withAuth({
  callbacks: {
    authorized: ({ token }) => !!token,
  },
});

export const config = {
  matcher: ['/account/:path*', '/admin/:path*', '/checkout/:path*'],
};
```

---

## Paso 7: Agregar Notificaciones (Toast)

### Usar librería como sonner:

```bash
npm install sonner
```

### En layout.tsx:

```typescript
import { Toaster } from 'sonner';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
```

### En componentes:

```typescript
import { toast } from 'sonner';

export function Component() {
  const handleClick = () => {
    toast.success('¡Producto añadido al carrito!');
  };

  return <button onClick={handleClick}>Añadir</button>;
}
```

---

## Paso 8: Añadir shadcn/ui (Opcional)

```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add table
```

### Usar en componentes:

```typescript
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function LoginForm() {
  return (
    <form className="space-y-4">
      <Input type="email" placeholder="Email" />
      <Input type="password" placeholder="Password" />
      <Button type="submit">Ingresar</Button>
    </form>
  );
}
```

---

## Paso 9: Testing

### Instalar Jest + React Testing Library:

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom
```

### Crear jest.config.js:

```javascript
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
};

module.exports = createJestConfig(customJestConfig);
```

### Escribir test:

```typescript
import { render, screen } from '@testing-library/react';
import { ProductCard } from '@/components/product/ProductCard';

describe('ProductCard', () => {
  it('renders product name', () => {
    const product = {
      id: '1',
      name: 'Test Product',
      price: 100,
      // ...
    };

    render(<ProductCard product={product} />);
    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });
});
```

---

## Paso 10: Deploy a Vercel

```bash
git add .
git commit -m "Initial commit"
git push origin main

# En Vercel:
# 1. Importar repositorio
# 2. Configurar variables de entorno
# 3. Deploy
```

---

## Flujo de Desarrollo Típico

### 1. Agregar Funcionalidad Nueva

```typescript
// 1. Crear tipo en src/types/index.ts
interface NewFeature {
  id: string;
  name: string;
  // ...
}

// 2. Crear servicio en src/services/
export const newFeatureService = {
  async getFeatures() {
    return api.get('/new-feature');
  },
};

// 3. Crear store si necesita estado global
export const useNewFeatureStore = create((set) => ({
  features: [],
  setFeatures: (features) => set({ features }),
}));

// 4. Crear componentes
export function NewFeatureCard({ feature }: { feature: NewFeature }) {
  return <div>{feature.name}</div>;
}

// 5. Crear página
export default function NewFeaturePage() {
  const [features, setFeatures] = useState([]);

  useEffect(() => {
    // Llamar servicio
    newFeatureService.getFeatures().then(setFeatures);
  }, []);

  return (
    <div>
      {features.map((f) => (
        <NewFeatureCard key={f.id} feature={f} />
      ))}
    </div>
  );
}
```

---

## Checklist Antes de Producción

- [ ] Reemplazar todos los console.log en services
- [ ] Conectar API real
- [ ] Implementar NextAuth
- [ ] Agregar validaciones con React Hook Form + Zod
- [ ] Implementar toast notifications
- [ ] Configurar variables de entorno en Vercel
- [ ] Ejecutar tests
- [ ] Optimizar imágenes
- [ ] Configurar SEO (metadata)
- [ ] Revisar performance (Lighthouse)
- [ ] Hacer backup de base de datos
- [ ] Probar en múltiples navegadores
- [ ] Revisar seguridad (CORS, CSRF)
- [ ] Setup de monitoreo

---

## Comandos Útiles

```bash
# Desarrollo
npm run dev          # Iniciar servidor

# Build
npm run build        # Compilar para producción
npm run start        # Iniciar servidor de producción

# Lint & Format
npm run lint         # Ejecutar ESLint
npm run lint:fix     # Arreglar errors de lint
npm run format       # Formatear con Prettier

# Testing
npm test             # Ejecutar tests

# Git
git status           # Ver cambios
git add .            # Agregar cambios
git commit -m "msg"  # Commitear
git push             # Subir a repo
```

---

**Listo para empezar a desarrollar! 🎉**
