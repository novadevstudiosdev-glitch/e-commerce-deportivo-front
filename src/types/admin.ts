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

export type TopProductDTO = {
  id: string;
  name: string;
  category?: string;
  sales?: number;
  revenue?: number;
  stock?: number;
};

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'cancelled';

export type PaymentDTO = {
  id: string;
  orderId?: string;
  userEmail?: string;
  amount?: number;
  status?: PaymentStatus;
  method?: string;
  createdAt?: string;
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

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

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
