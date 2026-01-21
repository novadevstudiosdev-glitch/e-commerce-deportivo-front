# CONTENIDO DE ARCHIVOS - RESUMEN EJECUTIVO

## 📄 TYPES - src/types/index.ts

```typescript
// Interfaces principales:
- Category: id, name, slug, description, icon
- Product: id, name, slug, description, price, originalPrice, category, images, stock, rating, tags
- CartItem: id, product, quantity, addedAt
- UserProfile: id, email, firstName, lastName, dni, address, city, postalCode, phone, avatar
- Order: id, userId, items, totalAmount, status, shippingAddress, trackingNumber
- Address: street, city, postalCode, country
- AdminStats: totalSales, totalOrders, totalProducts, topProducts, recentOrders, lowStockProducts
- OfferBanner: id, title, description, imageUrl, link, active, showOnce, startDate, endDate
- Offer: id, productId, discountPercentage, discountAmount, active, startDate, endDate
- Session: user, isAdmin, isAuthenticated
- LoginCredentials: email, password
- RegisterData: extends LoginCredentials + firstName, lastName
```

## 🔌 LIB - src/lib/

### api.ts

- Instancia Axios configurada
- Base URL desde variable de entorno
- Interceptors para autenticación (placeholder)
- Interceptors para manejo de errores

### routes.ts

- ROUTES object con todas las rutas
- PUBLIC_ROUTES, PROTECTED_ROUTES, ADMIN_ROUTES arrays

### constants.ts

- CATEGORIES (8 categorías deportivas)
- SORT_OPTIONS (4 opciones de ordenamiento)
- ITEMS_PER_PAGE = 12
- ORDER_STATUS_LABELS (traducción de estados)
- Defaults (AVATAR, LOGO_URL)
- TOAST_DURATION, MIN_PASSWORD_LENGTH

### utils.ts

- formatCurrency(amount, currency)
- formatDate(date)
- formatDateTime(date)
- isValidEmail(email)
- isValidDNI(dni)
- capitalize(str)
- slugify(str)
- calculateDiscount(originalPrice, currentPrice)
- generateId()
- groupBy(items, key)

### validations.ts

- loginSchema
- registerSchema
- profileSchema
- productSchema
- offerSchema (todas con Zod)

### auth.ts

- NextAuth config (placeholder comentado)

---

## 🏪 STORES - src/store/

### useCartStore (Zustand)

```typescript
{
  items: CartItem[]
  addItem(product, quantity) → agrega/incrementa
  removeItem(productId) → elimina
  updateQuantity(productId, quantity) → actualiza
  clearCart() → vacía
  getTotalPrice() → calcula total
  getTotalItems() → cuenta items
}
```

### useUIStore (Zustand)

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

### useAuthStore (Zustand)

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

## 📡 SERVICES - src/services/

### productsService

- getProducts(filters) → GET /products
- getProductBySlug(slug) → GET /products/{slug}
- getProductsByCategory(category) → GET /products/category/{category}
- searchProducts(query) → GET /products/search
- getCategories() → GET /categories

### authService

- login(credentials) → POST /auth/login
- register(data) → POST /auth/register
- loginWithGoogle(token) → POST /auth/google
- getSession() → GET /auth/session
- logout() → POST /auth/logout

### ordersService

- createOrder(items, shippingAddress) → POST /orders
- getUserOrders(userId) → GET /users/{userId}/orders
- getOrderById(orderId) → GET /orders/{orderId}
- getOrderStatus(orderId) → GET /orders/{orderId}/status

### adminService

- getStats() → GET /admin/stats
- createProduct(product) → POST /admin/products
- updateProduct(id, product) → PATCH /admin/products/{id}
- deleteProduct(id) → DELETE /admin/products/{id}
- getOrders() → GET /admin/orders
- updateOrderStatus(orderId, status, trackingNumber) → PATCH /admin/orders/{orderId}
- createOffer(offer) → POST /admin/offers
- getOffers() → GET /admin/offers
- createOfferBanner(banner) → POST /admin/banners
- getActiveOfferBanners() → GET /admin/banners

### shippingService

- calculateShippingCost(postalCode, weight)
- getShippingOptions(postalCode)
- getTrackingStatus(trackingNumber)
- createShipment(orderId, shippingOption)

### notificationsService

- sendOrderConfirmationEmail(email, orderId)
- sendOrderStatusNotification(email, orderId, status)
- notifySeller(orderId, orderDetails)
- sendLowStockAlert(productId, currentStock)

---

## 🎨 COMPONENTES - src/components/

### Layout

- **Navbar**: Logo, navegación, carrito, perfil (skeleton)
- **Footer**: Pie de página
- **CategoryMenu**: Links a categorías con hover
- **SearchBar**: Input + button búsqueda

### Product

- **ProductCard**: Imagen, nombre, precio, descuento%, rating
- **ProductGrid**: Grid responsive con loading skeleton
- **FiltersSidebar**: Filtros por precio (placeholder)

### Cart

- **CartSummary**: Lista de items, total, CTA pago
- **CheckoutForm**: Inputs básicos (nombre, email, dirección)

### Auth

- **AuthFormLogin**: Email, password, submit button
- **AuthFormRegister**: firstName, lastName, email, password x2

### Common

- **ProfileForm**: Inputs para perfil (nombre, email, dni, dirección, teléfono)
- **OrdersTable**: Tabla con ID, fecha, total, estado, seguimiento
- **OffersModal**: Modal one-time con CTA
- **ToastProvider**: Wrapper (placeholder para librería)

### Admin

- **AdminSidebar**: Links a dashboard, productos, órdenes, ofertas
- **AdminProductForm**: Inputs para crear/editar producto
- **AdminOrdersBoard**: Wrapper de OrdersTable

---

## 🎯 RUTAS - src/app/

### Públicas

- `/` → Home page
- `/products` → Catálogo (ProductGrid + FiltersSidebar)
- `/products/[slug]` → Detalle (imagen, descripción, botón añadir carrito)
- `/categories/[category]` → Catálogo filtrado por categoría
- `/cart` → Carrito con opción eliminar/actualizar cantidad
- `/auth/login` → AuthFormLogin + Google button
- `/auth/register` → AuthFormRegister

### Protegidas (RequireAuth)

- `/checkout` → CheckoutForm + CartSummary
- `/account/layout` → Sidebar + navegación
- `/account/profile` → ProfileForm
- `/account/orders` → OrdersTable

### Admin (RequireAdmin)

- `/admin/layout` → AdminSidebar + main
- `/admin/stats` → KPI cards (sales, orders, products, lowStock)
- `/admin/products` → AdminProductForm + lista (placeholder)
- `/admin/orders` → AdminOrdersBoard
- `/admin/offers` → Formulario oferta + lista activas

---

## 🔒 GUARDIAS - src/utils/

### RequireAuth.tsx

- Protege componentes/rutas que requieren sesión
- Si no autenticado → redirect a /auth/login

### requireAdmin.tsx

- Protege componentes/rutas que requieren rol admin
- Si no admin → redirect a home

---

## 🪝 HOOKS - src/hooks/

### useAuth()

```typescript
{
  session,
  isLoading,
  isAuthenticated: !!session?.isAuthenticated,
  isAdmin: session?.isAdmin || false,
  setSession,
  logout
}
```

### useCart()

```typescript
{
  items,
  addItem,
  removeItem,
  updateQuantity,
  clearCart,
  totalPrice: getTotalPrice(),
  totalItems: getTotalItems()
}
```

---

## ⚙️ CONFIGURACIÓN

### package.json

- Dependencies: react, next, zustand, axios, react-hook-form, zod, next-auth
- DevDependencies: TypeScript, ESLint, Prettier, Tailwind, PostCSS
- Scripts: dev, build, start, lint, lint:fix, format

### tsconfig.json

- Target: ES2020
- Module: ESNext
- Paths: @ → src/\*
- Strict mode activado

### tailwind.config.ts

- Content: src/pages, src/components, src/app
- Extends: fontFamily, colors (primary, secondary)

### next.config.js

- reactStrictMode: true
- swcMinify: true
- Images remotePatterns para cualquier dominio
- App dir experimental

### .eslintrc.json

- Extends: next/core-web-vitals, next/typescript
- Desactiva react/react-in-jsx-scope

### .prettierrc

- semi: true, singleQuote: true
- printWidth: 100, tabWidth: 2

### .env.local.example

- NEXT_PUBLIC_API_URL
- NEXTAUTH_URL, NEXTAUTH_SECRET
- Google OAuth (opcional)

---

## 🎨 ESTILOS GLOBALES - src/app/globals.css

```css
:root {
  --primary-color: #0066cc;
  --secondary-color: #666666;
  --success-color: #22c55e;
  --error-color: #ef4444;
  --warning-color: #f59e0b;
  --info-color: #3b82f6;
}

body {
  @apply bg-white text-gray-900;
}
a {
  @apply text-primary hover:text-opacity-80 transition-colors;
}
```

---

## 📝 DOCUMENTACIÓN

- **README.md** - Guía de instalación, estructura, rutas, tipos, hooks
- **ARCHITECTURE.md** - Este documento (tree completo, archivos, resumen)
- **Inline comments** - TODO: markers en todos los services/páginas

---

## 🔑 PUNTOS IMPORTANTES

1. **Todos los servicios son placeholders** - Solo console.log, sin llamadas reales
2. **NextAuth no está configurado** - Solo archivo skeleton comentado
3. **React Hook Form sin implementar** - Solo inputs básicos
4. **No hay lógica de pago** - Solo formulario skeleton
5. **Modal de ofertas es one-time** - Se marca en localStorage con Zustand
6. **Componentes con props tipadas** - Todo con TypeScript
7. **Rutas protegidas con guardias** - RequireAuth, RequireAdmin
8. **Variables de entorno listas** - .env.local.example

---

**Total de archivos: 107**  
**Líneas de código (boilerplate): ~5,000+**  
**Estado: Listo para desarrollo ✅**
