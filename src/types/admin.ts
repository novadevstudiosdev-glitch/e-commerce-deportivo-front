// ============================================
// TIPOS ADMIN
// ============================================

export type ApiErrorShape = {
  error?: string;
  message?: string;
};

export type AdminSummaryDTO = {
  totalSales?: number;
  totalOrders?: number;
  pendingPayments?: number;
  totalCustomers?: number;
  totalProducts?: number;
  [key: string]: number | string | boolean | undefined;
};

export type CatalogSize = {
  id: string;
  name: string;
  type: 'ropa' | 'calzado' | 'unico';
  sort_order: number;
};

export type CatalogColor = {
  id: string;
  name: string;
  hex?: string | null;
};

export type CatalogCategory = {
  id: string;
  name: string;
  slug?: string;
};

export type CatalogBrand = {
  id: string;
  name: string;
  slug?: string;
};

export type CatalogSport = {
  id: string;
  name: string;
  slug?: string;
};

export type TopProductDTO = {
  id: string;
  name: string;
  category?: string;
  sales?: number;
  revenue?: number;
  stock?: number;
};

export type PaymentStatus = 'pendiente' | 'aprobado' | 'rechazado' | 'reembolsado';

export type PaymentDTO = {
  id: string;
  orderId?: string;
  userEmail?: string;
  amount?: number | string;
  status?: PaymentStatus;
  method?: string;
  createdAt?: string;
  provider?: string;
  transaction_id?: string | null;
  created_at?: string;
};

export type StockAlertDTO = {
  productId: string;
  productName: string;
  stock: number;
  threshold?: number;
};

export type AdminProductDTO = {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  stock: number;
  category: string;
  slug?: string;
  category_id?: string | null;
  brand_id?: string | null;
  sport_id?: string | null;
  images?: string[] | null;
  is_featured?: boolean;
  is_active?: boolean;
  created_at?: string;
};

export type AdminProductForm = {
  name: string;
  description: string;
  price: number;
  currency: string;
  stock: number;
  category: string;
  images: string[];
  is_featured: boolean;
};

export type AdminProductImageInput = {
  url: string;
  is_main?: boolean;
  sort_order?: number;
};

export type AdminProductImageResponse = {
  id: string;
  url: string;
  is_main: boolean;
  sort_order: number;
};

export type AdminProductVariantInput = {
  size_id?: string | null;
  color_id?: string | null;
  base_price: number;
  discount_percentage?: number;
  stock: number;
  low_stock_threshold?: number;
  sku?: string;
  is_active?: boolean;
};

export type AdminProductVariantResponse = {
  id: string;
  sku: string;
  size: { id: string; name: string } | null;
  color: { id: string; name: string; hex?: string | null } | null;
  base_price: number;
  discount_percentage: number;
  final_price: number;
  stock: number;
  low_stock_threshold: number;
  is_active: boolean;
};

export type AdminProductCreatePayload = {
  name: string;
  description: string;
  category_id: string;
  brand_id?: string | null;
  sport_id?: string | null;
  is_active?: boolean;
  is_featured?: boolean;
  images?: AdminProductImageInput[];
  variants: AdminProductVariantInput[];
};

export type AdminProductCreateResponse = {
  id: string;
  name: string;
  slug?: string | null;
  description: string;
  category_id?: string | null;
  brand_id?: string | null;
  sport_id?: string | null;
  is_active: boolean;
  is_featured: boolean;
  images: AdminProductImageResponse[];
  variants: AdminProductVariantResponse[];
};

export type AdminProductDetail = AdminProductCreateResponse & {
  created_at?: string;
  updated_at?: string;
};

export type CouponType = 'percent' | 'fixed';

export type CouponDTO = {
  id: string;
  code: string;
  type: CouponType;
  value: number;
  starts_at?: string;
  ends_at?: string;
  active?: boolean;
};

export type CouponForm = {
  code: string;
  type: CouponType;
  value: number;
  starts_at?: string;
  ends_at?: string;
  active: boolean;
};

export type PatchOrderPaymentPayload = {
  status: PaymentStatus;
};

export type OrderStatus = 'en_preparacion' | 'enviado' | 'entregado';

export type PatchOrderStatusPayload = {
  status: OrderStatus;
};

export type AdminUserRole = 'admin' | 'vendedor' | 'usuario' | 'customer' | 'user';

export type AdminUserDTO = {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: AdminUserRole;
  is_active?: boolean;
  email_verified?: boolean;
  profile?: {
    first_name?: string;
    last_name?: string;
    dni?: string;
    phone?: string;
    date_of_birth?: string;
    avatar_url?: string;
  };
  created_at?: string;
  updated_at?: string;
};

export type PatchUserPayload = {
  role?: AdminUserRole;
  is_active?: boolean;
};

export type AdminUsersListResponse = {
  page: number;
  limit: number;
  total: number;
  data: AdminUserDTO[];
};
