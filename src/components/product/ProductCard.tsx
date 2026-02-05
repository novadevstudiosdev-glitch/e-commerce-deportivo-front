'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  IconButton,
  Rating,
  Typography,
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { Product } from '@/types';
import { ROUTES } from '@/lib/routes';
import { formatCurrency, normalizeImageList, calculateDiscount } from '@/lib/utils';
import { useCart } from '@/hooks';
import Swal from 'sweetalert2';

// ============================================
// PRODUCT CARD - COMPONENTE (PRO)
// ============================================

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const router = useRouter();
  const bucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || 'products';
  const images = normalizeImageList(product.images, bucket);
  const primaryImage = images[0] || '/placeholder.png';
  const [imgSrc, setImgSrc] = useState(primaryImage);
  const detailHref = ROUTES.PRODUCT_DETAIL(product.slug);

  useEffect(() => {
    setImgSrc(primaryImage);
  }, [primaryImage]);

  const discountLabel = useMemo(() => {
    if (product.discountPercent && product.discountPercent > 0) {
      return `-${product.discountPercent}%`;
    }
    if (product.originalPrice && product.originalPrice > product.price) {
      return `-${calculateDiscount(product.originalPrice, product.price)}%`;
    }
    return null;
  }, [product.discountPercent, product.originalPrice, product.price]);

  const couponLabel = product.couponBadge;

  const handleAddToCart = async (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (product.sizes && product.sizes.length > 0) {
      await Swal.fire({
        icon: 'info',
        title: 'Elegi tu talle',
        text: 'Este producto tiene talles. Elegi tu talle antes de agregarlo al carrito.',
        confirmButtonText: 'Elegir talle',
        confirmButtonColor: '#0ea5e9',
      });
      router.push(detailHref);
      return;
    }
    addItem(product, 1);
  };

  const handleWishlist = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    // placeholder para favoritos
  };

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        border: '1px solid #E5E7EB',
        bgcolor: '#fff',
        transition: 'all 0.22s ease',
        overflow: 'hidden',
        '@media (hover:hover) and (pointer:fine)': {
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 16px 30px rgba(15, 23, 42, 0.12)',
          },
          '&:hover .quickAdd': {
            opacity: 1,
            transform: 'translateY(0)',
          },
        },
      }}
    >
      <CardActionArea
        component={Link}
        href={ROUTES.PRODUCT_DETAIL(product.slug)}
        sx={{ alignItems: 'stretch' }}
      >
        <Box sx={{ position: 'relative', p: 2, bgcolor: '#F6F7FB' }}>
          <Box sx={{ position: 'relative', aspectRatio: '1 / 1', borderRadius: 2, overflow: 'hidden' }}>
            <Image
              src={imgSrc}
              alt={product.name}
              width={600}
              height={600}
              sizes="(max-width: 768px) 100vw, 260px"
              unoptimized
              className="h-full w-full object-cover"
              onError={() => setImgSrc('/placeholder.png')}
            />
          </Box>

          <IconButton
            size="small"
            onClick={handleWishlist}
            sx={{
              position: 'absolute',
              top: 14,
              right: 14,
              bgcolor: 'rgba(255,255,255,0.9)',
              border: '1px solid rgba(15,23,42,0.08)',
              boxShadow: '0 10px 24px rgba(15, 23, 42, 0.14)',
              backdropFilter: 'blur(6px)',
              color: '#0F172A',
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: '#fff',
                color: '#E11D48',
                transform: 'translateY(-2px)',
                boxShadow: '0 14px 30px rgba(15, 23, 42, 0.2)',
              },
            }}
          >
            <FavoriteBorderIcon fontSize="small" />
          </IconButton>

          {couponLabel && (
            <Chip
              label={couponLabel}
              size="small"
              sx={{
                position: 'absolute',
                top: 14,
                left: 14,
                bgcolor: '#D9F99D',
                color: '#1A2E05',
                fontWeight: 700,
              }}
            />
          )}

          {discountLabel && (
            <Chip
              label={discountLabel}
              size="small"
              sx={{
                position: 'absolute',
                top: couponLabel ? 44 : 14,
                left: 14,
                bgcolor: '#1E293B',
                color: '#fff',
                fontWeight: 700,
              }}
            />
          )}

          <IconButton
            className="quickAdd"
            onClick={handleAddToCart}
            sx={{
              position: 'absolute',
              right: 14,
              bottom: 14,
              bgcolor: '#fff',
              border: '1px solid #E5E7EB',
              boxShadow: '0 8px 20px rgba(15, 23, 42, 0.12)',
              opacity: 0,
              transform: 'translateY(6px)',
              transition: 'all 0.22s ease',
              '&:hover': { bgcolor: '#fff' },
            }}
          >
            <AddShoppingCartIcon fontSize="small" />
          </IconButton>
        </Box>

        <CardContent sx={{ p: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0F172A' }} noWrap>
            {product.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {product.category.name}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
            <Rating value={product.rating ?? 0} precision={0.1} size="small" readOnly />
            <Typography variant="caption" color="text.secondary">
              ({product.reviews ?? 0})
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.2, mt: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#1E88E5' }}>
              {formatCurrency(product.price)}
            </Typography>
            {product.originalPrice && product.originalPrice > product.price && (
              <Typography variant="caption" sx={{ color: '#94A3B8', textDecoration: 'line-through' }}>
                {formatCurrency(product.originalPrice)}
              </Typography>
            )}
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
