// ============================================
// TIPOS BASE DE LA APLICACIÓN
// ============================================

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: Category;
  images: string[];
  stock: number;
  rating?: number;
  reviews?: number;
  tags?: string[];
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  addedAt: Date;
}

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  dni?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  phone?: string;
  avatar?: string;
  createdAt: Date;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  status: OrderStatus;
  shippingAddress: Address;
  trackingNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Address {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface AdminStats {
  totalSales: number;
  totalOrders: number;
  totalProducts: number;
  topProducts: Product[];
  recentOrders: Order[];
  lowStockProducts: Product[];
}

export interface OfferBanner {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  link?: string;
  active: boolean;
  showOnce: boolean;
  startDate: Date;
  endDate: Date;
}

export interface Offer {
  id: string;
  productId: string;
  discountPercentage: number;
  discountAmount?: number;
  active: boolean;
  startDate: Date;
  endDate: Date;
}

export interface Session {
  user: UserProfile;
  isAdmin: boolean;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  firstName: string;
  lastName: string;
  phone?: string;
}

