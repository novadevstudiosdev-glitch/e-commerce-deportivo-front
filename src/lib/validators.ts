// ============================================
// VALIDADORES DE FRONTEND
// ============================================

import { MIN_PASSWORD_LENGTH } from '@/lib/constants';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim().toLowerCase());
}

export function isValidPassword(password: string, minLength: number = MIN_PASSWORD_LENGTH): boolean {
  return password.trim().length >= minLength;
}
