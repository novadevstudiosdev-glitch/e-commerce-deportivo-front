'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Sora } from 'next/font/google';
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Container,
  CssBaseline,
  Divider,
  Drawer,
  FormControlLabel,
  Grid,
  IconButton,
  Paper,
  Rating,
  Slider,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import FilterListIcon from '@mui/icons-material/FilterList';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useCart } from '@/hooks';
import { productsService, ProductPublic } from '@/services/products.service';
import { buildProductSlug, capitalize, formatCurrency, normalizeImageList, slugify } from '@/lib/utils';
import { getCouponBadgeLabel, type Coupon } from '@/lib/coupons';
import { ROUTES } from '@/lib/routes';
import Swal from 'sweetalert2';

const sora = Sora({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

type Product = {
  id: string;
  name: string;
  slug?: string;
  brand: string;
  categories: string[];
  price: number;
  oldPrice?: number;
  discount?: number;
  isFeatured?: boolean;
  rating: number;
  reviews: number;
  sizes: string[];
  colors?: string[];
  couponBadge?: string;
  image: string;
};

const BRANDS = ['Nike', 'Adidas', 'Puma', 'Reebok', 'Under Armour'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const theme = createTheme({
  palette: {
    primary: { main: '#1E88E5' },
    background: { default: '#F6F7FB' },
  },
  shape: {
    borderRadius: 16,
  },
  typography: {
    fontFamily: '"Sora", "Manrope", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 700,
          borderRadius: 12,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
  },
});

function mapToCatalogProduct(product: ProductPublic): Product {
  const categoryName = product.category || 'general';
  const categorySlug = slugify(categoryName) || 'general';

  const bucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || 'products';
  const images = normalizeImageList(product.images, bucket);
  const image = images[0] || '/placeholder.png';

  const isFeatured = product.is_featured;
  const price = toNumber(product.price) ?? 0;
  const discountPercent = toNumber(product.discount_percent);
  const original = toNumber(product.original_price);
  let oldPrice = original;
  if (!oldPrice && discountPercent && discountPercent > 0 && discountPercent < 100) {
    oldPrice = Math.round((price / (1 - discountPercent / 100)) * 100) / 100;
  }
  const couponBadge = getActiveCouponLabel(product);

  return {
    id: product.id,
    name: product.name,
    slug: buildProductSlug(product.name, product.id),
    brand: capitalize(categorySlug),
    categories: [categorySlug],
    price,
    oldPrice,
    discount: discountPercent ?? (isFeatured ? 10 : undefined),
    isFeatured,
    rating: toNumber(product.rating) ?? 0,
    reviews: toNumber(product.reviews) ?? toNumber(product.reviews_count) ?? 0,
    sizes: normalizeStringArray(product.sizes),
    colors: normalizeStringArray(product.colors),
    couponBadge,
    image,
  };
}

function getDiscountLabel(product: Product) {
  if (product.discount) return `-${product.discount}%`;
  if (product.oldPrice && product.oldPrice > product.price) {
    const pct = Math.round((1 - product.price / product.oldPrice) * 100);
    return `-${pct}%`;
  }
  if (product.isFeatured) return 'Destacado';
  return null;
}

export default function ProductCatalogPage() {
  const { addItem } = useCart();
  const router = useRouter();

  // ✅ SIN any: tipamos params
  const params = useParams<{ slug?: string; category?: string }>();
  const searchParams = useSearchParams();

  const categoryFromQuery = (searchParams.get('category') ?? '').toLowerCase();

  const categoryFromRoute =
    typeof params.slug === 'string'
      ? params.slug.toLowerCase()
      : typeof params.category === 'string'
        ? params.category.toLowerCase()
        : '';

  const activeCategory = categoryFromQuery || categoryFromRoute;

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // ✅ Traer TODOS los productos (250)
        const all = await productsService.getAllProducts({ sort: 'newest', includeCoupons: true });
        console.log('TOTAL TRAIDOS:', all.length);

        if (!isMounted) return;
        setProducts(all.map(mapToCatalogProduct));
      } catch (err) {
        console.error('Error cargando products desde Supabase:', err);
        if (!isMounted) return;
        setProducts([]);
        setError('No se pudieron cargar los productos.');
      } finally {
        if (!isMounted) return;
        setIsLoading(false);
      }
    };

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const priceBounds = useMemo(() => {
    if (products.length === 0) return { min: 0, max: 0 };
    const prices = products.map((p) => p.price);
    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices)),
    };
  }, [products]);

  const [tempMin, setTempMin] = useState(priceBounds.min);
  const [tempMax, setTempMax] = useState(priceBounds.max);
  const [priceMin, setPriceMin] = useState(priceBounds.min);
  const [priceMax, setPriceMax] = useState(priceBounds.max);

  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const brands = useMemo(() => {
    const derived = Array.from(new Set(products.map((product) => product.brand))).sort();
    return derived.length > 0 ? derived : BRANDS;
  }, [products]);

  const sizes = useMemo(() => {
    const derived = Array.from(new Set(products.flatMap((product) => product.sizes))).sort();
    return derived.length > 0 ? derived : SIZES;
  }, [products]);

  const hasSizes = sizes.length > 0;

  useEffect(() => {
    setTempMin(priceBounds.min);
    setTempMax(priceBounds.max);
    setPriceMin(priceBounds.min);
    setPriceMax(priceBounds.max);
  }, [priceBounds.min, priceBounds.max]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (activeCategory) {
        if (activeCategory === 'ofertas') {
          const hasDiscount =
            Boolean(product.discount) ||
            Boolean(product.isFeatured) ||
            (product.oldPrice && product.oldPrice > product.price);
          if (!hasDiscount) return false;
        } else if (!product.categories.includes(activeCategory)) {
          return false;
        }
      }

      if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) {
        return false;
      }

      if (hasSizes && selectedSizes.length > 0) {
        const hasSize = product.sizes.some((size) => selectedSizes.includes(size));
        if (!hasSize) return false;
      }

      if (product.price < priceMin || product.price > priceMax) {
        return false;
      }

      return true;
    });
  }, [activeCategory, hasSizes, priceMin, priceMax, products, selectedBrands, selectedSizes]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const applyPrice = () => {
    setPriceMin(Math.min(tempMin, tempMax));
    setPriceMax(Math.max(tempMin, tempMax));
  };

  const handleAddToCart = (product: Product) => {
    const primaryCategory = product.categories[0] || 'general';
    const slug = product.slug ?? buildProductSlug(product.name, product.id);
    const detailHref = ROUTES.PRODUCT_DETAIL(slug);

    if (product.sizes && product.sizes.length > 0) {
      void Swal.fire({
        icon: 'info',
        title: 'Elegi tu talle',
        text: 'Este producto tiene talles. Elegi tu talle antes de agregarlo al carrito.',
        confirmButtonText: 'Elegir talle',
        confirmButtonColor: '#0ea5e9',
      }).then(() => router.push(detailHref));
      return;
    }

    addItem(
      {
        id: product.id,
        name: product.name,
        slug,
        description: product.name,
        price: product.price,
        originalPrice: product.oldPrice,
        category: {
          id: primaryCategory,
          name: primaryCategory,
          slug: primaryCategory,
        },
        images: [product.image],
        stock: 999,
        rating: product.rating,
        reviews: product.reviews,
        tags: [product.brand],
      },
      1
    );
  };

  const sidebarContent = (
    <Paper variant="outlined" sx={{ borderColor: '#E5E7EB', p: 2, bgcolor: '#fff' }}>
      <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
        Filtros
      </Typography>

      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle2" fontWeight={700}>
          Rango de Precio
        </Typography>

        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
          <TextField
            label="Minimo"
            size="small"
            value={tempMin}
            onChange={(e) => setTempMin(Number(e.target.value) || priceBounds.min)}
            type="number"
            fullWidth
          />
          <TextField
            label="Maximo"
            size="small"
            value={tempMax}
            onChange={(e) => setTempMax(Number(e.target.value) || priceBounds.max)}
            type="number"
            fullWidth
          />
        </Stack>

        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
          Minimo
        </Typography>
        <Slider
          value={Math.min(tempMin, tempMax)}
          min={priceBounds.min}
          max={priceBounds.max}
          onChange={(_, value) => setTempMin(Math.min(value as number, tempMax))}
          sx={{ mt: 0.5 }}
        />

        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          Maximo
        </Typography>
        <Slider
          value={Math.max(tempMin, tempMax)}
          min={priceBounds.min}
          max={priceBounds.max}
          onChange={(_, value) => setTempMax(Math.max(value as number, tempMin))}
          sx={{ mt: 0.5 }}
        />

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2, bgcolor: '#0F2A3D', '&:hover': { bgcolor: '#0B2233' } }}
          onClick={applyPrice}
        >
          Aplicar Precio
        </Button>
      </Box>

      <Divider sx={{ my: 2 }} />

      {brands.length > 0 && (
        <Box>
          <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
            Marcas
          </Typography>
          <Stack spacing={0.5}>
            {brands.map((brand) => (
              <FormControlLabel
                key={brand}
                control={
                  <Checkbox
                    size="small"
                    checked={selectedBrands.includes(brand)}
                    onChange={() => toggleBrand(brand)}
                  />
                }
                label={
                  <Typography variant="body2" color="text.secondary">
                    {brand}
                  </Typography>
                }
              />
            ))}
          </Stack>
        </Box>
      )}

      <Divider sx={{ my: 2 }} />

      {hasSizes && (
        <Box>
          <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
            Tallas
          </Typography>
          <Stack direction="row" flexWrap="wrap" gap={1}>
            {sizes.map((size) => (
              <Chip
                key={size}
                label={size}
                variant={selectedSizes.includes(size) ? 'filled' : 'outlined'}
                color={selectedSizes.includes(size) ? 'primary' : 'default'}
                onClick={() => toggleSize(size)}
                size="small"
                sx={{ fontWeight: 600 }}
              />
            ))}
          </Stack>
        </Box>
      )}
    </Paper>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box className={sora.className} sx={{ bgcolor: '#F6F7FB', minHeight: '100vh', pb: 6 }}>
        <Container maxWidth={false} sx={{ maxWidth: 1320, px: { xs: 2, md: 3 }, pt: 3 }}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            justifyContent="space-between"
            sx={{ mb: 2 }}
          >
            <Box>
              <Typography variant="h5" fontWeight={800}>
                Catalogo de Productos
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {isLoading
                  ? 'Cargando productos...'
                  : `${filteredProducts.length} productos encontrados`}
              </Typography>
            </Box>

            <Stack direction="row" spacing={1} alignItems="center">
              {isMobile && (
                <Button
                  variant="outlined"
                  startIcon={<FilterListIcon />}
                  onClick={() => setFiltersOpen(true)}
                >
                  Filtros
                </Button>
              )}
            </Stack>
          </Stack>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '280px 1fr' },
              gap: 3,
              alignItems: 'start',
            }}
          >
            {!isMobile && <Box>{sidebarContent}</Box>}

            <Box>
              {error && (
                <Typography variant="body2" color="error" sx={{ mb: 2 }}>
                  {error}
                </Typography>
              )}

              {isLoading ? (
                <Typography variant="body2" color="text.secondary">
                  Cargando productos...
                </Typography>
              ) : filteredProducts.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No hay productos disponibles.
                </Typography>
              ) : (
                <Grid container spacing={2}>
                  {filteredProducts.map((product) => {
                    const discountLabel = getDiscountLabel(product);
                    const detailHref = ROUTES.PRODUCT_DETAIL(
                      product.slug ?? buildProductSlug(product.name, product.id)
                    );

                    return (
                      <Grid item xs={12} sm={6} lg={3} key={product.id}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            border: '1px solid #E5E7EB',
                            boxShadow: '0 4px 12px rgba(15, 23, 42, 0.08)',
                            transition: 'all 220ms ease',
                            '&:hover': {
                              transform: 'translateY(-4px)',
                              boxShadow: '0 10px 24px rgba(15, 23, 42, 0.14)',
                            },
                          }}
                        >
                          <Box
                            sx={{
                              position: 'relative',
                              bgcolor: '#F1F3F6',
                              borderRadius: 2,
                              height: 180,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              overflow: 'hidden',
                            }}
                          >
                            {discountLabel && (
                              <Chip
                                label={discountLabel}
                                size="small"
                                sx={{
                                  position: 'absolute',
                                  top: product.couponBadge ? 42 : 10,
                                  left: 10,
                                  bgcolor: '#2E7D32',
                                  color: '#fff',
                                  fontWeight: 700,
                                }}
                              />
                            )}

                            {product.couponBadge && (
                              <Chip
                                label={product.couponBadge}
                                size="small"
                                sx={{
                                  position: 'absolute',
                                  top: 10,
                                  left: 10,
                                  bgcolor: '#D9F99D',
                                  color: '#1A2E05',
                                  fontWeight: 700,
                                }}
                              />
                            )}

                            <IconButton
                              size="small"
                              sx={{
                                position: 'absolute',
                                top: 8,
                                right: 8,
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

                            <Box
                              component="img"
                              src={product.image}
                              alt={product.name}
                              onError={(event) => {
                                const target = event.currentTarget as HTMLImageElement;
                                target.src = '/placeholder.png';
                              }}
                              sx={{ width: '100%', height: '100%', objectFit: 'contain' }}
                            />
                          </Box>

                          <Box sx={{ mt: 2 }}>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ textTransform: 'uppercase', fontWeight: 700 }}
                            >
                              {product.brand}
                            </Typography>

                            <Link href={detailHref} className="no-underline">
                              <Typography
                                variant="subtitle1"
                                sx={{
                                  fontWeight: 700,
                                  mt: 0.5,
                                  minHeight: 44,
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                  color: 'inherit',
                                }}
                              >
                                {product.name}
                              </Typography>
                            </Link>

                            <Stack
                              direction="row"
                              spacing={0.5}
                              alignItems="center"
                              sx={{ mt: 0.5 }}
                            >
                              <Rating
                                value={product.rating}
                                precision={0.1}
                                readOnly
                                size="small"
                              />
                              <Typography variant="caption" color="text.secondary">
                                ({product.reviews})
                              </Typography>
                            </Stack>

                            <Stack direction="row" spacing={1} alignItems="baseline" sx={{ mt: 1 }}>
                              <Typography
                                variant="subtitle1"
                                sx={{ color: '#1E88E5', fontWeight: 800 }}
                              >
                                {formatCurrency(product.price)}
                              </Typography>
                              {product.oldPrice && (
                                <Typography
                                  variant="caption"
                                  sx={{ color: '#94A3B8', textDecoration: 'line-through' }}
                                >
                                  {formatCurrency(product.oldPrice)}
                                </Typography>
                              )}
                            </Stack>

                            <Button
                              variant="contained"
                              fullWidth
                              startIcon={<ShoppingCartIcon />}
                              sx={{
                                mt: 1.5,
                                bgcolor: '#1E88E5',
                                '&:hover': { bgcolor: '#1565C0' },
                              }}
                              onClick={() => handleAddToCart(product)}
                            >
                              Anadir al carrito
                            </Button>
                          </Box>
                        </Paper>
                      </Grid>
                    );
                  })}
                </Grid>
              )}
            </Box>
          </Box>
        </Container>
      </Box>

      <Drawer
        anchor="left"
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        PaperProps={{ sx: { p: 2, width: 300, bgcolor: '#F6F7FB' } }}
      >
        {sidebarContent}
      </Drawer>
    </ThemeProvider>
  );
}

function toNumber(value: number | string | null | undefined): number | undefined {
  if (typeof value === 'number') return Number.isFinite(value) ? value : undefined;
  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
}

function normalizeStringArray(value: ProductPublic['sizes'] | ProductPublic['colors']): string[] {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === 'string' && item.trim() !== '');
  }
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.filter((item): item is string => typeof item === 'string' && item.trim() !== '');
      }
    } catch {
      // ignore
    }
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

function getActiveCouponLabel(product: ProductPublic): string | undefined {
  const rows = product.coupon_products ?? [];
  const now = new Date();

  for (const row of rows) {
    const coupon = row.coupons;
    if (!coupon) continue;
    if (coupon.is_active === false) continue;
    if (coupon.starts_at && new Date(coupon.starts_at) > now) continue;
    if (coupon.ends_at && new Date(coupon.ends_at) < now) continue;

    const normalized: Coupon = {
      ...coupon,
      discount_value: Number(coupon.discount_value),
    };
    const label = getCouponBadgeLabel(normalized);
    if (label) return label;
  }

  return undefined;
}
