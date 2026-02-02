'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { WELCOME_COUPON_CODE } from '@/lib/constants';

type Variant = 'guest' | 'logged_available' | 'none';

type WelcomePromoModalProps = {
  variant: Variant;
  open: boolean;
  onClose: () => void;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  onPrimary?: () => void;
  onSecondary?: () => void;
};

export function WelcomePromoModal({
  variant,
  open,
  onClose,
  primaryHref,
  primaryLabel,
  secondaryLabel,
  onPrimary,
  onSecondary,
}: WelcomePromoModalProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) {
      setCopied(false);
    }
  }, [open]);

  if (!open || variant === 'none') return null;

  const isGuest = variant === 'guest';
  const title = isGuest ? '\u{1F389} Tu primer descuento' : 'Tenes un 10% OFF disponible';
  const description = isGuest
    ? 'Registrate y obtene 10% OFF en tu primera compra.'
    : `Usa ${WELCOME_COUPON_CODE} y obtene 10% en esta compra.`;
  const primaryText = primaryLabel || (isGuest ? 'Registrarme' : 'Ir al carrito');
  const secondaryText = secondaryLabel || (isGuest ? 'Mas tarde' : 'Cerrar');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(WELCOME_COUPON_CODE);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (error) {
      setCopied(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        key="welcome-overlay"
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        aria-hidden="true"
      />
      <motion.div
        key="welcome-panel"
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 12 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={onClose}
      >
        <div
          className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-[0_30px_80px_rgba(15,23,42,0.35)]"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(253,224,71,0.35),_transparent_60%)]" />
            <div className="absolute inset-0 bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-100 opacity-90" />
            <div className="relative px-6 py-5">
              <span className="inline-flex items-center rounded-full bg-black/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                10% OFF
              </span>
              <h2 className="mt-3 text-2xl font-extrabold text-slate-900">{title}</h2>
              <p className="mt-2 text-sm text-slate-700">{description}</p>
            </div>
          </div>

          <div className="px-6 pb-6 pt-4">
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Codigo
                </p>
                <p className="text-lg font-extrabold tracking-widest text-slate-900">
                  {WELCOME_COUPON_CODE}
                </p>
              </div>
              <button
                type="button"
                onClick={handleCopy}
                className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white hover:bg-slate-800"
              >
                {copied ? 'Copiado' : 'Copiar'}
              </button>
            </div>

            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center">
              {primaryHref ? (
                <Link
                  href={primaryHref}
                  className="inline-flex flex-1 items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow hover:bg-slate-800"
                >
                  {primaryText}
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={onPrimary}
                  className="inline-flex flex-1 items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow hover:bg-slate-800"
                >
                  {primaryText}
                </button>
              )}
              <button
                type="button"
                onClick={onSecondary || onClose}
                className="inline-flex flex-1 items-center justify-center rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                {secondaryText}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
