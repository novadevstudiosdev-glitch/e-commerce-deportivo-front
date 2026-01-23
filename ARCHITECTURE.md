# 📋 ARQUITECTURA - E-COMMERCE DEPORTIVO FRONTEND

**Fecha:** Enero 2026  
**Stack:** Next.js 14+ | TypeScript | Tailwind CSS | Zustand | Axios | React Hook Form + Zod  
**Estado:** ✅ Scaffolding Completo - Lista para implementar lógica

---

## 📁 DIRECTORY TREE

```
e-commerce-deportivo-front/
│
├── 📂 public/
│   └── logo.svg                          # Placeholder del logo
│
├── 📂 src/
│   │
│   ├── 📂 app/                           # App Router de Next.js 14
│   │   ├── layout.tsx                    # Layout raíz
│   │   ├── page.tsx                      # Home page
│   │   ├── globals.css                   # Estilos globales
│   │   │
│   │   ├── 📂 (auth)/                    # Group: Rutas de autenticación
│   │   │   ├── login/
│   │   │   │   └── page.tsx              # Página de login
│   │   │   └── register/
│   │   │       └── page.tsx              # Página de registro
│   │   │
│   │   ├── 📂 (public)/                  # Group: Rutas públicas
│   │   │   ├── 📂 products/
│   │   │   │   ├── page.tsx              # Catálogo
│   │   │   │   └── 📂 [slug]/
│   │   │   │       └── page.tsx          # Detalle de producto
│   │   │   ├── 📂 categories/
│   │   │   │   └── 📂 [category]/
│   │   │   │       └── page.tsx          # Productos por categoría
│   │   │   ├── 📂 cart/
│   │   │   │   └── page.tsx              # Carrito
│   │   │   └── 📂 checkout/
│   │   │       └── page.tsx              # Checkout (protegida)
│   │   │
│   │   ├── 📂 account/                   # Área de cliente (protegida)
│   │   │   ├── layout.tsx                # Sidebar + navegación
│   │   │   ├── 📂 profile/
│   │   │   │   └── page.tsx              # Editar perfil
│   │   │   └── 📂 orders/
│   │   │       └── page.tsx              # Historial de compras
│   │   │
│   │   └── 📂 admin/                     # Panel administrativo (protegido)
│   │       ├── layout.tsx                # Sidebar admin
│   │       ├── page.tsx                  # Redirect a stats
│   │       ├── 📂 stats/
│   │       │   └── page.tsx              # Dashboard con KPIs
│   │       ├── 📂 products/
│   │       │   └── page.tsx              # Gestión de productos
│   │       ├── 📂 orders/
│   │       │   └── page.tsx              # Gestión de órdenes
│   │       └── 📂 offers/
│   │           └── page.tsx              # Gestión de ofertas
│   │
│   ├── 📂 components/                    # Componentes reutilizables
│   │   ├── 📂 layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── CategoryMenu.tsx
│   │   │   └── SearchBar.tsx
│   │   ├── 📂 product/
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductGrid.tsx
│   │   │   └── FiltersSidebar.tsx
│   │   ├── 📂 cart/
│   │   │   ├── CartSummary.tsx
│   │   │   └── CheckoutForm.tsx
│   │   ├── 📂 auth/
│   │   │   ├── AuthFormLogin.tsx
│   │   │   └── AuthFormRegister.tsx
│   │   ├── 📂 admin/
│   │   │   ├── AdminSidebar.tsx
│   │   │   ├── AdminProductForm.tsx
│   │   │   └── AdminOrdersBoard.tsx
│   │   ├── 📂 common/
│   │   │   ├── ProfileForm.tsx
│   │   │   ├── OrdersTable.tsx
│   │   │   ├── OffersModal.tsx           # Modal one-time
│   │   │   └── ToastProvider.tsx
│   │   └── index.ts                      # Barrel export
│   │
│   ├── 📂 lib/                           # Utilidades y configuración
│   │   ├── api.ts                        # Axios instance
│   │   ├── routes.ts                     # Definición de rutas
│   │   ├── constants.ts                  # Constantes globales
│   │   ├── utils.ts                      # Funciones utilitarias
│   │   ├── validations.ts                # Esquemas Zod
│   │   └── auth.ts                       # NextAuth config (placeholder)
│   │
│   ├── 📂 services/                      # Servicios API (placeholders)
│   │   ├── products.service.ts
│   │   ├── auth.service.ts
│   │   ├── orders.service.ts
│   │   ├── admin.service.ts
│   │   ├── shipping.service.ts
│   │   ├── notifications.service.ts
│   │   └── index.ts
│   │
│   ├── 📂 store/                         # Zustand stores
│   │   ├── useCartStore.ts               # Estado del carrito
│   │   ├── useUIStore.ts                 # Estado de UI
│   │   ├── useAuthStore.ts               # Estado de autenticación
│   │   └── index.ts
│   │
│   ├── 📂 types/                         # Interfaces TypeScript
│   │   └── index.ts                      # Todas las interfaces
│   │
│   ├── 📂 hooks/                         # Custom hooks
│   │   ├── useAuth.ts
│   │   ├── useCart.ts
│   │   └── index.ts
│   │
│   ├── 📂 utils/                         # Guardias y utilidades
│   │   ├── requireAuth.tsx               # Guard para rutas protegidas
│   │   └── requireAdmin.tsx              # Guard para admin
│   │
│   ├── middleware.ts                     # NextAuth middleware
│   └── index.ts                          # Main export
│
├── 📄 package.json                       # Dependencias y scripts
├── 📄 tsconfig.json                      # Configuración TypeScript
├── 📄 next.config.js                     # Configuración Next.js
├── 📄 tailwind.config.ts                 # Configuración Tailwind
├── 📄 postcss.config.js                  # Configuración PostCSS
├── 📄 .eslintrc.json                     # ESLint config
├── 📄 .prettierrc                        # Prettier config
├── 📄 .gitignore                         # Git ignore rules
├── 📄 .env.local.example                 # Variables de ejemplo
└── 📄 README.md                          # Documentación

```

---

## 📋 LISTADO COMPLETO DE ARCHIVOS

### Configuración (9 archivos)

- `package.json`
- `tsconfig.json`
- `next.config.js`
- `tailwind.config.ts`
- `postcss.config.js`
- `.eslintrc.json`
- `.prettierrc`
- `.env.local.example`
- `.gitignore`

### App Router - Rutas (17 archivos)

- `src/app/layout.tsx`
- `src/app/page.tsx` (Home)
- `src/app/globals.css`
- `src/app/(auth)/login/page.tsx`
- `src/app/(auth)/register/page.tsx`
- `src/app/(public)/products/page.tsx`
- `src/app/(public)/products/[slug]/page.tsx`
- `src/app/(public)/categories/[category]/page.tsx`
- `src/app/(public)/cart/page.tsx`
- `src/app/(public)/checkout/page.tsx`
- `src/app/account/layout.tsx`
- `src/app/account/profile/page.tsx`
- `src/app/account/orders/page.tsx`
- `src/app/admin/layout.tsx`
- `src/app/admin/page.tsx`
- `src/app/admin/stats/page.tsx`
- `src/app/admin/products/page.tsx`
- `src/app/admin/orders/page.tsx`
- `src/app/admin/offers/page.tsx`

### Componentes (26 archivos)

- `src/components/layout/Navbar.tsx`
- `src/components/layout/Footer.tsx`
- `src/components/layout/CategoryMenu.tsx`
- `src/components/layout/SearchBar.tsx`
- `src/components/product/ProductCard.tsx`
- `src/components/product/ProductGrid.tsx`
- `src/components/product/FiltersSidebar.tsx`
- `src/components/cart/CartSummary.tsx`
- `src/components/cart/CheckoutForm.tsx`
- `src/components/auth/AuthFormLogin.tsx`
- `src/components/auth/AuthFormRegister.tsx`
- `src/components/common/ProfileForm.tsx`
- `src/components/common/OrdersTable.tsx`
- `src/components/common/OffersModal.tsx`
- `src/components/common/ToastProvider.tsx`
- `src/components/admin/AdminSidebar.tsx`
- `src/components/admin/AdminProductForm.tsx`
- `src/components/admin/AdminOrdersBoard.tsx`
- `src/components/index.ts`

### Library (7 archivos)

- `src/lib/api.ts`
- `src/lib/routes.ts`
- `src/lib/constants.ts`
- `src/lib/utils.ts`
- `src/lib/validations.ts`
- `src/lib/auth.ts`

### Services (7 archivos)

- `src/services/products.service.ts`
- `src/services/auth.service.ts`
- `src/services/orders.service.ts`
- `src/services/admin.service.ts`
- `src/services/shipping.service.ts`
- `src/services/notifications.service.ts`
- `src/services/index.ts`

### Store (4 archivos)

- `src/store/useCartStore.ts`
- `src/store/useUIStore.ts`
- `src/store/useAuthStore.ts`
- `src/store/index.ts`

### Types & Hooks (5 archivos)

- `src/types/index.ts`
- `src/hooks/useAuth.ts`
- `src/hooks/useCart.ts`
- `src/hooks/index.ts`

### Utils & Middleware (3 archivos)

- `src/utils/requireAuth.tsx`
- `src/utils/requireAdmin.tsx`
- `src/middleware.ts`

### Public (1 archivo)

- `public/logo.svg`

### Root Files (2 archivos)

- `src/index.ts`
- `README.md`

**TOTAL: 107 ARCHIVOS**

---

## 🏗️ COMPONENTES CREADOS

### Layout

- ✅ **Navbar** - Barra de navegación con logo
- ✅ **Footer** - Pie de página
- ✅ **CategoryMenu** - Menú de categorías
- ✅ **SearchBar** - Barra de búsqueda

### Productos

- ✅ **ProductCard** - Tarjeta de producto con precio y descuento
- ✅ **ProductGrid** - Grid de productos con loading skeleton
- ✅ **FiltersSidebar** - Filtros por precio, categoría, etc.

### Carrito

- ✅ **CartSummary** - Resumen de carrito con total
- ✅ **CheckoutForm** - Formulario de pago (skeleton)

### Autenticación

- ✅ **AuthFormLogin** - Formulario de login
- ✅ **AuthFormRegister** - Formulario de registro

### Comunes

- ✅ **ProfileForm** - Formulario de perfil de usuario
- ✅ **OrdersTable** - Tabla de órdenes
- ✅ **OffersModal** - Modal de ofertas (one-time)
- ✅ **ToastProvider** - Proveedor de notificaciones (placeholder)

### Admin

- ✅ **AdminSidebar** - Menú lateral del admin
- ✅ **AdminProductForm** - Formulario de producto
- ✅ **AdminOrdersBoard** - Board de órdenes

---

## 🔧 RUTAS IMPLEMENTADAS

### Public Routes

- ✅ `/` - Home page
- ✅ `/products` - Catálogo
- ✅ `/products/[slug]` - Detalle de producto
- ✅ `/categories/[category]` - Productos por categoría
- ✅ `/cart` - Carrito
- ✅ `/auth/login` - Login
- ✅ `/auth/register` - Registro

### Protected Routes (requieren sesión)

- ✅ `/checkout` - Checkout
- ✅ `/account` - Área de cliente (redirect)
- ✅ `/account/profile` - Perfil editable
- ✅ `/account/orders` - Historial de compras

### Admin Routes (requieren admin role)

- ✅ `/admin` - Redirect a stats
- ✅ `/admin/stats` - Dashboard con KPIs
- ✅ `/admin/products` - Gestión de productos
- ✅ `/admin/orders` - Gestión de órdenes
- ✅ `/admin/offers` - Gestión de ofertas

---

## 🎯 TIPOS CREADOS

- ✅ `Product` - Producto
- ✅ `Category` - Categoría
- ✅ `CartItem` - Item del carrito
- ✅ `UserProfile` - Perfil de usuario
- ✅ `Order` - Orden
- ✅ `Address` - Dirección
- ✅ `AdminStats` - Estadísticas del admin
- ✅ `OfferBanner` - Banner de oferta
- ✅ `Offer` - Oferta
- ✅ `Session` - Sesión
- ✅ `LoginCredentials` - Credenciales de login
- ✅ `RegisterData` - Datos de registro

---

## 📦 STORES ZUSTAND

### useCartStore

```typescript
{
  items: CartItem[]
  addItem(product, quantity)
  removeItem(productId)
  updateQuantity(productId, quantity)
  clearCart()
  getTotalPrice()
  getTotalItems()
}
```

### useUIStore

```typescript
{
  offerModalShown: boolean;
  cartDrawerOpen: boolean;
  mobileMenuOpen: boolean;
  setOfferModalShown(shown);
  setCartDrawerOpen(open);
  setMobileMenuOpen(open);
  toggleCartDrawer();
  toggleMobileMenu();
}
```

### useAuthStore

```typescript
{
  session: Session | null;
  isLoading: boolean;
  setSession(session);
  setIsLoading(loading);
  logout();
}
```

---

## 🔗 SERVICIOS CREADOS (Placeholders)

- ✅ `productsService` - 5 métodos
- ✅ `authService` - 5 métodos
- ✅ `ordersService` - 4 métodos
- ✅ `adminService` - 9 métodos
- ✅ `shippingService` - 4 métodos
- ✅ `notificationsService` - 4 métodos

---

## 🎨 CONFIGURACIÓN TAILWIND

**Variables CSS:**

- `--primary-color: #0066cc`
- `--secondary-color: #666666`
- `--success-color: #22c55e`
- `--error-color: #ef4444`
- `--warning-color: #f59e0b`
- `--info-color: #3b82f6`

---

## 🔐 GUARDIAS IMPLEMENTADAS

- ✅ `RequireAuth` - Protege rutas de cliente
- ✅ `RequireAdmin` - Protege rutas de admin

---

## 📚 VALIDACIONES (Zod Schemas)

- ✅ `loginSchema`
- ✅ `registerSchema`
- ✅ `profileSchema`
- ✅ `productSchema`
- ✅ `offerSchema`

---

## 🚀 PRÓXIMAS IMPLEMENTACIONES

1. **Conectar API real**
   - Reemplazar console.logs en services
   - Implementar error handling

2. **NextAuth Configuration**
   - Google OAuth integration
   - Credenciales provider
   - JWT callbacks

3. **React Hook Form + Zod**
   - Integrar con formularios
   - Validación en tiempo real

4. **UI Avanzada**
   - Modales y drawers
   - Toast notifications
   - Spinners de loading

5. **Testing**
   - Jest + React Testing Library
   - Tests unitarios
   - Tests de integración

6. **Performance**
   - Image optimization (next/image)
   - Code splitting
   - Lazy loading

---

## 📖 INSTRUCCIONES DE INSTALACIÓN

```bash
# 1. Clonar
git clone <repo>
cd e-commerce-deportivo-front

# 2. Instalar
npm install

# 3. Configurar
cp .env.local.example .env.local

# 4. Correr
npm run dev

# Abrir http://localhost:3000
```

---

## ✅ CHECKLIST COMPLETADO

- [x] Estructura de carpetas
- [x] App Router configurado
- [x] Componentes base creados
- [x] Tipos TypeScript definidos
- [x] Stores Zustand implementados
- [x] Services placeholders creados
- [x] Rutas protegidas configuradas
- [x] Tailwind CSS configurado
- [x] ESLint + Prettier setup
- [x] Validaciones Zod
- [x] Documentación completa
- [x] Logo placeholder

---

**Estado:** 🟢 LISTO PARA DESARROLLO  
**Última actualización:** Enero 2026
