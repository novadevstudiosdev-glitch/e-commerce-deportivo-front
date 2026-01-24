// ============================================
// VALIDACIONES CON ZOD
// ============================================

import { z } from 'zod';
import { MIN_PASSWORD_LENGTH } from '@/lib/constants';

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z
    .string()
    .min(
      MIN_PASSWORD_LENGTH,
      `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`
    ),
});

export const registerSchema = z
  .object({
    firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
    email: z.string().email('Email inválido'),
    password: z
      .string()
      .min(
        MIN_PASSWORD_LENGTH,
        `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`
      ),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'Las contraseñas no coinciden',
    path: ['passwordConfirm'],
  });

export const profileSchema = z.object({
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  dni: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
});

export const productSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  price: z.number().positive('El precio debe ser positivo'),
  stock: z.number().int().positive('El stock debe ser un número positivo'),
  categoryId: z.string().min(1, 'Selecciona una categoría'),
});

export const offerSchema = z.object({
  productId: z.string().min(1, 'Selecciona un producto'),
  discountPercentage: z.number().min(1).max(100, 'El descuento debe estar entre 1 y 100%'),
  startDate: z.date(),
  endDate: z.date(),
});

