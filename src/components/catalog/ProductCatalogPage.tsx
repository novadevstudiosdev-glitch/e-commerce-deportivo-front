"use client";

import { useMemo, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Sora } from "next/font/google";
import {
  Badge,
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
  Popover,
  Rating,
  Slider,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import FilterListIcon from "@mui/icons-material/FilterList";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

type Product = {
  id: string;
  name: string;
  brand: string;
  categories: string[];
  price: number;
  oldPrice?: number;
  discount?: number;
  rating: number;
  reviews: number;
  sizes: string[];
  image: string;
};

type CartItem = {
  id: string;
  name: string;
  size: string;
  qty: number;
  price: number;
  image: string;
};

const BRANDS = ["Nike", "Adidas", "Puma", "Reebok", "Under Armour"];
const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

const PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Zapatillas Running Pro Max",
    brand: "Nike",
    categories: ["calzado", "hombre"],
    price: 89.99,
    oldPrice: 119.99,
    discount: 25,
    rating: 4.6,
    reviews: 128,
    sizes: ["M", "L", "XL"],
    image: "/zapatillas%20running.avif",
  },
  {
    id: "p2",
    name: "Camiseta Tecnica Dry-Fit",
    brand: "Adidas",
    categories: ["ropa", "hombre"],
    price: 34.99,
    oldPrice: 49.99,
    discount: 30,
    rating: 4.5,
    reviews: 256,
    sizes: ["S", "M", "L", "XL"],
    image: "/remeraTecnica.jpg",
  },
  {
    id: "p3",
    name: "Pantalon Deportivo Flex",
    brand: "Puma",
    categories: ["ropa", "hombre"],
    price: 49.99,
    oldPrice: 69.99,
    discount: 29,
    rating: 4.4,
    reviews: 89,
    sizes: ["M", "L", "XL"],
    image: "https://source.unsplash.com/600x600/?sports-pants",
  },
  {
    id: "p4",
    name: "Chaqueta Cortaviento Trail",
    brand: "Reebok",
    categories: ["ropa", "hombre"],
    price: 79.99,
    oldPrice: 99.99,
    discount: 20,
    rating: 4.3,
    reviews: 145,
    sizes: ["M", "L", "XL"],
    image: "https://source.unsplash.com/600x600/?sports-jacket",
  },
  {
    id: "p5",
    name: "Mochila Deportiva 30L",
    brand: "Under Armour",
    categories: ["accesorios"],
    price: 39.99,
    oldPrice: 54.99,
    discount: 27,
    rating: 4.2,
    reviews: 203,
    sizes: [],
    image: "/mochilaDeportiva.avif",
  },
  {
    id: "p6",
    name: "Calcetines Running Pack 3",
    brand: "Nike",
    categories: ["accesorios"],
    price: 14.99,
    oldPrice: 19.99,
    discount: 25,
    rating: 4.1,
    reviews: 312,
    sizes: ["S", "M", "L"],
    image: "https://source.unsplash.com/600x600/?running-socks",
  },
  {
    id: "p7",
    name: "Gorra Deportiva Ajustable",
    brand: "Adidas",
    categories: ["accesorios"],
    price: 19.99,
    oldPrice: 24.99,
    discount: 20,
    rating: 4.5,
    reviews: 167,
    sizes: [],
    image: "https://source.unsplash.com/600x600/?sport-cap",
  },
  {
    id: "p8",
    name: "Sudadera con Capucha",
    brand: "Puma",
    categories: ["ropa", "mujer"],
    price: 59.99,
    oldPrice: 79.99,
    discount: 25,
    rating: 4.6,
    reviews: 421,
    sizes: ["S", "M", "L", "XL"],
    image: "https://source.unsplash.com/600x600/?hoodie",
  },
  {
    id: "p9",
    name: "Leggings Training High-Rise",
    brand: "Nike",
    categories: ["ropa", "mujer"],
    price: 44.99,
    oldPrice: 59.99,
    discount: 25,
    rating: 4.7,
    reviews: 298,
    sizes: ["XS", "S", "M", "L"],
    image: "https://source.unsplash.com/600x600/?leggings",
  },
  {
    id: "p10",
    name: "Top Deportivo Seamless",
    brand: "Adidas",
    categories: ["ropa", "mujer"],
    price: 29.99,
    rating: 4.3,
    reviews: 118,
    sizes: ["XS", "S", "M", "L"],
    image: "https://source.unsplash.com/600x600/?sports-bra",
  },
  {
    id: "p11",
    name: "Zapatillas Urban Motion",
    brand: "Reebok",
    categories: ["calzado", "mujer"],
    price: 84.99,
    oldPrice: 99.99,
    discount: 15,
    rating: 4.2,
    reviews: 92,
    sizes: ["S", "M", "L", "XL"],
    image: "https://source.unsplash.com/600x600/?sneakers",
  },
  {
    id: "p12",
    name: "Short Running UltraLight",
    brand: "Under Armour",
    categories: ["ropa", "hombre"],
    price: 32.99,
    rating: 4.1,
    reviews: 76,
    sizes: ["S", "M", "L", "XL"],
    image: "https://source.unsplash.com/600x600/?running-shorts",
  },
  {
    id: "p13",
    name: "Campera Termica Pro",
    brand: "Puma",
    categories: ["ropa", "hombre"],
    price: 69.99,
    oldPrice: 89.99,
    discount: 22,
    rating: 4.4,
    reviews: 64,
    sizes: ["M", "L", "XL"],
    image: "https://source.unsplash.com/600x600/?puffer-jacket",
  },
  {
    id: "p14",
    name: "Balon Futbol Match",
    brand: "Adidas",
    categories: ["accesorios"],
    price: 24.99,
    rating: 4.5,
    reviews: 59,
    sizes: [],
    image: "https://source.unsplash.com/600x600/?soccer-ball",
  },
  {
    id: "p15",
    name: "Guantes Entrenamiento Grip",
    brand: "Nike",
    categories: ["accesorios"],
    price: 18.99,
    rating: 4.2,
    reviews: 84,
    sizes: ["S", "M", "L"],
    image: "https://source.unsplash.com/600x600/?training-gloves",
  },
  {
    id: "p16",
    name: "Botella Hidratacion 1L",
    brand: "Reebok",
    categories: ["accesorios"],
    price: 12.99,
    rating: 4.0,
    reviews: 103,
    sizes: [],
    image: "https://source.unsplash.com/600x600/?water-bottle",
  },
  {
    id: "p17",
    name: "Set Bandas Elasticos",
    brand: "Under Armour",
    categories: ["accesorios"],
    price: 21.99,
    rating: 4.3,
    reviews: 140,
    sizes: [],
    image: "https://source.unsplash.com/600x600/?resistance-bands",
  },
  {
    id: "p18",
    name: "Zapatillas Trail Xtreme",
    brand: "Adidas",
    categories: ["calzado", "hombre"],
    price: 99.99,
    oldPrice: 129.99,
    discount: 23,
    rating: 4.6,
    reviews: 177,
    sizes: ["M", "L", "XL"],
    image: "https://source.unsplash.com/600x600/?trail-running-shoes",
  },
  {
    id: "p19",
    name: "Jogger Performance",
    brand: "Nike",
    categories: ["ropa", "hombre"],
    price: 54.99,
    oldPrice: 69.99,
    discount: 21,
    rating: 4.4,
    reviews: 97,
    sizes: ["S", "M", "L", "XL"],
    image: "/jogger%20training.webp",
  },
  {
    id: "p20",
    name: "Camiseta Manga Larga Run",
    brand: "Reebok",
    categories: ["ropa", "mujer"],
    price: 39.99,
    rating: 4.2,
    reviews: 73,
    sizes: ["S", "M", "L"],
    image: "https://source.unsplash.com/600x600/?long-sleeve-shirt",
  },
  {
    id: "p21",
    name: "Shorts Ciclista Compresion",
    brand: "Adidas",
    categories: ["ropa", "mujer"],
    price: 27.99,
    rating: 4.1,
    reviews: 54,
    sizes: ["XS", "S", "M", "L"],
    image: "https://source.unsplash.com/600x600/?cycling-shorts",
  },
  {
    id: "p22",
    name: "Chamarra Ligera Wind",
    brand: "Under Armour",
    categories: ["ropa", "mujer"],
    price: 64.99,
    oldPrice: 79.99,
    discount: 19,
    rating: 4.3,
    reviews: 62,
    sizes: ["S", "M", "L", "XL"],
    image: "https://source.unsplash.com/600x600/?windbreaker",
  },
  {
    id: "p23",
    name: "Zapatos Training Core",
    brand: "Puma",
    categories: ["calzado", "hombre"],
    price: 74.99,
    rating: 4.2,
    reviews: 81,
    sizes: ["M", "L", "XL"],
    image: "https://source.unsplash.com/600x600/?gym-shoes",
  },
  {
    id: "p24",
    name: "Hoodie Essential Sport",
    brand: "Nike",
    categories: ["ropa", "hombre"],
    price: 58.99,
    rating: 4.5,
    reviews: 119,
    sizes: ["S", "M", "L", "XL"],
    image: "https://source.unsplash.com/600x600/?sports-hoodie",
  },
];

const CART_ITEMS: CartItem[] = [
  {
    id: "c1",
    name: "Zapatillas Running Pro Max",
    size: "42",
    qty: 1,
    price: 89.99,
    image: "/zapatillas%20running.avif",
  },
  {
    id: "c2",
    name: "Camiseta Tecnica Dry-Fit",
    size: "M",
    qty: 2,
    price: 34.99,
    image: "/remeraTecnica.jpg",
  },
  {
    id: "c3",
    name: "Mochila Deportiva 30L",
    size: "Unica",
    qty: 1,
    price: 39.99,
    image: "/mochilaDeportiva.avif",
  },
];

const theme = createTheme({
  palette: {
    primary: { main: "#1E88E5" },
    background: { default: "#F6F7FB" },
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
          textTransform: "none",
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

function formatPrice(value: number) {
  return `$${value.toFixed(2)}`;
}

function getDiscountLabel(product: Product) {
  if (product.discount) return `-${product.discount}%`;
  if (product.oldPrice && product.oldPrice > product.price) {
    const pct = Math.round((1 - product.price / product.oldPrice) * 100);
    return `-${pct}%`;
  }
  return null;
}

export default function ProductCatalogPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const categoryFromQuery = searchParams.get("category")?.toLowerCase() ?? "";
  const categoryFromRoute =
    typeof params?.slug === "string"
      ? params.slug.toLowerCase()
      : typeof params?.category === "string"
        ? params.category.toLowerCase()
        : "";
  const activeCategory = categoryFromQuery || categoryFromRoute;

  const priceBounds = useMemo(() => {
    const prices = PRODUCTS.map((p) => p.price);
    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices)),
    };
  }, []);

  const [tempMin, setTempMin] = useState(priceBounds.min);
  const [tempMax, setTempMax] = useState(priceBounds.max);
  const [priceMin, setPriceMin] = useState(priceBounds.min);
  const [priceMax, setPriceMax] = useState(priceBounds.max);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [cartAnchor, setCartAnchor] = useState<HTMLElement | null>(null);

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const cartOpen = Boolean(cartAnchor);

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      if (activeCategory) {
        if (activeCategory === "ofertas") {
          const hasDiscount =
            Boolean(product.discount) ||
            (product.oldPrice && product.oldPrice > product.price);
          if (!hasDiscount) return false;
        } else if (!product.categories.includes(activeCategory)) {
          return false;
        }
      }

      if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) {
        return false;
      }

      if (selectedSizes.length > 0) {
        const hasSize = product.sizes.some((size) => selectedSizes.includes(size));
        if (!hasSize) return false;
      }

      if (product.price < priceMin || product.price > priceMax) {
        return false;
      }

      return true;
    });
  }, [activeCategory, priceMin, priceMax, selectedBrands, selectedSizes]);

  const cartTotal = useMemo(() => {
    return CART_ITEMS.reduce((sum, item) => sum + item.price * item.qty, 0);
  }, []);

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

  const sidebarContent = (
    <Paper
      variant="outlined"
      sx={{
        borderColor: "#E5E7EB",
        p: 2,
        bgcolor: "#fff",
      }}
    >
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
        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: "block" }}>
          Minimo
        </Typography>
        <Slider
          value={Math.min(tempMin, tempMax)}
          min={priceBounds.min}
          max={priceBounds.max}
          onChange={(_, value) =>
            setTempMin(Math.min(value as number, tempMax))
          }
          sx={{ mt: 0.5 }}
        />
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
          Maximo
        </Typography>
        <Slider
          value={Math.max(tempMin, tempMax)}
          min={priceBounds.min}
          max={priceBounds.max}
          onChange={(_, value) =>
            setTempMax(Math.max(value as number, tempMin))
          }
          sx={{ mt: 0.5 }}
        />
        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2, bgcolor: "#0F2A3D", "&:hover": { bgcolor: "#0B2233" } }}
          onClick={applyPrice}
        >
          Aplicar Precio
        </Button>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box>
        <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
          Marcas
        </Typography>
        <Stack spacing={0.5}>
          {BRANDS.map((brand) => (
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

      <Divider sx={{ my: 2 }} />

      <Box>
        <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
          Tallas
        </Typography>
        <Stack direction="row" flexWrap="wrap" gap={1}>
          {SIZES.map((size) => (
            <Chip
              key={size}
              label={size}
              variant={selectedSizes.includes(size) ? "filled" : "outlined"}
              color={selectedSizes.includes(size) ? "primary" : "default"}
              onClick={() => toggleSize(size)}
              size="small"
              sx={{ fontWeight: 600 }}
            />
          ))}
        </Stack>
      </Box>
    </Paper>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box className={sora.className} sx={{ bgcolor: "#F6F7FB", minHeight: "100vh", pb: 6 }}>
        <Container
          maxWidth={false}
          sx={{
            maxWidth: 1320,
            px: { xs: 2, md: 3 },
            pt: 3,
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems={{ xs: "flex-start", sm: "center" }}
            justifyContent="space-between"
            sx={{ mb: 2 }}
          >
            <Box>
              <Typography variant="h5" fontWeight={800}>
                Catalogo de Productos
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {filteredProducts.length} productos encontrados
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
              <IconButton
                onClick={(event) => setCartAnchor(event.currentTarget)}
                sx={{ bgcolor: "#fff", border: "1px solid #E5E7EB" }}
              >
                <Badge color="primary" badgeContent={CART_ITEMS.length}>
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
            </Stack>
          </Stack>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "280px 1fr" },
              gap: 3,
              alignItems: "start",
            }}
          >
            {!isMobile && <Box>{sidebarContent}</Box>}

            <Box>
              <Grid container spacing={2}>
                {filteredProducts.map((product) => {
                  const discountLabel = getDiscountLabel(product);
                  return (
                    <Grid item xs={12} sm={6} lg={3} key={product.id}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          border: "1px solid #E5E7EB",
                          boxShadow: "0 4px 12px rgba(15, 23, 42, 0.08)",
                          transition: "all 220ms ease",
                          "&:hover": {
                            transform: "translateY(-4px)",
                            boxShadow: "0 10px 24px rgba(15, 23, 42, 0.14)",
                          },
                        }}
                      >
                        <Box
                          sx={{
                            position: "relative",
                            bgcolor: "#F1F3F6",
                            borderRadius: 2,
                            height: 180,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "hidden",
                          }}
                        >
                          {discountLabel && (
                            <Chip
                              label={discountLabel}
                              size="small"
                              sx={{
                                position: "absolute",
                                top: 10,
                                left: 10,
                                bgcolor: "#2E7D32",
                                color: "#fff",
                                fontWeight: 700,
                              }}
                            />
                          )}
                          <IconButton
                            size="small"
                            sx={{
                              position: "absolute",
                              top: 8,
                              right: 8,
                              bgcolor: "#fff",
                              boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                              "&:hover": { bgcolor: "#fff" },
                            }}
                          >
                            <FavoriteBorderIcon fontSize="small" />
                          </IconButton>
                          <Box
                            component="img"
                            src={product.image}
                            alt={product.name}
                            sx={{
                              width: "100%",
                              height: "100%",
                              objectFit: "contain",
                            }}
                          />
                        </Box>

                        <Box sx={{ mt: 2 }}>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ textTransform: "uppercase", fontWeight: 700 }}
                          >
                            {product.brand}
                          </Typography>
                          <Typography
                            variant="subtitle1"
                            sx={{
                              fontWeight: 700,
                              mt: 0.5,
                              minHeight: 44,
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {product.name}
                          </Typography>
                          <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.5 }}>
                            <Rating value={product.rating} precision={0.1} readOnly size="small" />
                            <Typography variant="caption" color="text.secondary">
                              ({product.reviews})
                            </Typography>
                          </Stack>
                          <Stack direction="row" spacing={1} alignItems="baseline" sx={{ mt: 1 }}>
                            <Typography variant="subtitle1" sx={{ color: "#1E88E5", fontWeight: 800 }}>
                              {formatPrice(product.price)}
                            </Typography>
                            {product.oldPrice && (
                              <Typography
                                variant="caption"
                                sx={{ color: "#94A3B8", textDecoration: "line-through" }}
                              >
                                {formatPrice(product.oldPrice)}
                              </Typography>
                            )}
                          </Stack>

                          {product.sizes.length > 0 && (
                            <Stack direction="row" spacing={0.5} sx={{ mt: 1, flexWrap: "wrap" }}>
                              {product.sizes.map((size) => (
                                <Chip key={size} label={size} size="small" variant="outlined" />
                              ))}
                            </Stack>
                          )}

                          <Button
                            variant="contained"
                            fullWidth
                            startIcon={<ShoppingCartIcon />}
                            sx={{
                              mt: 1.5,
                              bgcolor: "#1E88E5",
                              "&:hover": { bgcolor: "#1565C0" },
                            }}
                          >
                            Anadir al carrito
                          </Button>
                        </Box>
                      </Paper>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          </Box>
        </Container>
      </Box>

      <Drawer
        anchor="left"
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        PaperProps={{ sx: { p: 2, width: 300, bgcolor: "#F6F7FB" } }}
      >
        {sidebarContent}
      </Drawer>

      <Popover
        open={cartOpen}
        anchorEl={cartAnchor}
        onClose={() => setCartAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{ sx: { p: 2, width: 320, borderRadius: 3, boxShadow: "0 10px 24px rgba(0,0,0,0.15)" } }}
      >
        <Typography variant="subtitle1" fontWeight={700}>
          Carrito de Compras
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {CART_ITEMS.length} articulos
        </Typography>

        <Stack spacing={1.5} sx={{ mt: 2, maxHeight: 280, overflowY: "auto" }}>
          {CART_ITEMS.map((item) => (
            <Stack direction="row" spacing={1.5} key={item.id} alignItems="center">
              <Box
                component="img"
                src={item.image}
                alt={item.name}
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  bgcolor: "#F1F3F6",
                  objectFit: "contain",
                  p: 0.5,
                }}
              />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2" fontWeight={600} noWrap>
                  {item.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Talla: {item.size} | Cant: {item.qty}
                </Typography>
              </Box>
              <Box sx={{ textAlign: "right" }}>
                <Typography variant="body2" fontWeight={700} color="primary">
                  {formatPrice(item.price)}
                </Typography>
                <IconButton size="small" sx={{ mt: 0.5 }}>
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Box>
            </Stack>
          ))}
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2" fontWeight={700}>
            Total:
          </Typography>
          <Typography variant="body1" fontWeight={800} color="primary">
            {formatPrice(cartTotal)}
          </Typography>
        </Stack>

        <Stack spacing={1} sx={{ mt: 2 }}>
          <Button variant="outlined" fullWidth>
            Ver Carrito
          </Button>
          <Button variant="contained" fullWidth>
            Finalizar Compra
          </Button>
        </Stack>
      </Popover>
    </ThemeProvider>
  );
}
