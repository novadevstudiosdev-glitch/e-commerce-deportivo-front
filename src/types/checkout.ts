import { CartItem } from '@/types';

export type ShippingMethod = 'pickup' | 'standard' | 'express';

export interface CheckoutContact {
  firstName: string;
  lastName: string;
  dni: string;
  email: string;
  phone: string;
}

export interface CheckoutAddress {
  street: string;
  number: string;
  floor: string;
  city: string;
  province: string;
  postalCode: string;
}

export interface CheckoutPayment {
  cardName: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
  acceptTerms: boolean;
}

export interface CheckoutForm {
  contact: CheckoutContact;
  address: CheckoutAddress;
  shippingMethod: ShippingMethod;
  payment: CheckoutPayment;
}

export interface CheckoutOrderSummary {
  id: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  shippingMethod: ShippingMethod;
  contact: CheckoutContact;
  address: CheckoutAddress;
}
