'use client';

import { useEffect, useState } from 'react';
import { useUIStore } from '@/store';

// ============================================
// OFFERS MODAL - COMPONENTE (ONE-TIME)
// ============================================

interface OffersModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function OffersModal({ isOpen, onClose }: OffersModalProps) {
  const { offerModalShown, setOfferModalShown } = useUIStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!offerModalShown && isOpen) {
      setIsModalOpen(true);
    }
  }, [offerModalShown, isOpen]);

  const handleClose = () => {
    setOfferModalShown(true);
    setIsModalOpen(false);
    onClose?.();
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 p-6">
        <h2 className="text-2xl font-bold mb-4">Ofertas Especiales</h2>
        <p className="text-gray-600 mb-6">Descuentos exclusivos para ti</p>
        <button
          onClick={handleClose}
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Ver Ofertas
        </button>
      </div>
    </div>
  );
}
