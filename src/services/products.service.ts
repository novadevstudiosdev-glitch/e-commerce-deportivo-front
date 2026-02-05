import { supabase } from '@/lib/supabaseClient';

// ============================================
// SERVICIOS DE PRODUCTOS
// ============================================

type ProductRow = {
  id: string;
  name: string;
  description: string;
  price?: number | string | null;
  currency?: string | null;
  stock?: number | null;
  category?: string | null;
  category_id?: string | null;
  is_featured?: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
  is_active?: boolean | null;
  discount_percent?: number | string | null;
  original_price?: number | string | null;
  sku?: string | null;
  target?: string | null;
  low_stock_threshold?: number | null;
  coupon_products?: ProductPublic['coupon_products'];
  rating?: number | string | null;
  reviews?: number | string | null;
  reviews_count?: number | string | null;
  specs?: { label: string; value: string }[] | string | null;
};

type ProductImageRow = {
  product_id: string;
  url: string;
  is_main?: boolean | null;
  sort_order?: number | null;
};

type ProductVariantRow = {
  product_id: string;
  sku?: string | null;
  size_id?: string | null;
  color_id?: string | null;
  base_price?: number | string | null;
  final_price?: number | string | null;
  discount_percentage?: number | null;
  stock?: number | null;
  is_active?: boolean | null;
};

type SizeRow = {
  id: string;
  name: string;
  type?: string | null;
  sort_order?: number | null;
};

type ColorRow = {
  id: string;
  name: string;
  hex?: string | null;
};

type CategoryRow = {
  id: string;
  name: string;
  slug?: string | null;
};

export interface ProductPublic {
  id: string;
  name: string;
  description: string;
  price: string; // numeric a veces llega como string
  currency: string;
  stock: number;
  category: string;
  images?: string[] | null;
  is_featured: boolean;
  created_at: string;
  updated_at?: string;
  is_active?: boolean;
  discount_percent?: number | string | null;
  original_price?: number | string | null;
  sku?: string | null;
  sizes?: string[] | string | null;
  colors?: string[] | string | null;
  rating?: number | string | null;
  reviews?: number | string | null;
  reviews_count?: number | string | null;
  specs?: { label: string; value: string }[] | string | null;
  target?: string | null;
  low_stock_threshold?: number | null;
  coupon_products?: Array<{
    coupons?: {
      id: string;
      code: string;
      title: string;
      discount_type: 'percent' | 'fixed';
      discount_value: number | string;
      starts_at?: string | null;
      ends_at?: string | null;
      is_active?: boolean;
    } | null;
  }> | null;
}

export interface ProductListResponse {
  page: number;
  limit: number;
  total: number;
  data: ProductPublic[];
}

export const productsService = {
  /**
   * ✅ Traer TODOS los productos (recomendado para 250 items)
   */
  async getAllProducts(filters?: {
    category?: string;
    search?: string;
    sort?: string;
    includeCoupons?: boolean;
  }): Promise<ProductPublic[]> {
    const selectWithCoupons = '*, coupon_products(coupons(*))';
    const select = filters?.includeCoupons ? selectWithCoupons : '*';
    let query = supabase.from('products').select(select);

    if (filters?.category) query = query.eq('category', filters.category);
    if (filters?.search) query = query.ilike('name', `%${filters.search}%`);

    switch (filters?.sort) {
      case 'oldest':
        query = query.order('created_at', { ascending: true });
        break;
      case 'price_asc':
        query = query.order('price', { ascending: true });
        break;
      case 'price_desc':
        query = query.order('price', { ascending: false });
        break;
      case 'newest':
      default:
        query = query.order('created_at', { ascending: false });
        break;
    }

    let { data, error } = await query;

    if (error && filters?.includeCoupons) {
      const message = error.message || '';
      if (message.includes('coupon_products') || message.includes('relationship')) {
        const fallback = await supabase.from('products').select('*');
        data = fallback.data ?? null;
        error = fallback.error ?? null;
      }
    }

    if (error) throw new Error(error.message);

    return buildProducts((data ?? []) as ProductRow[]);
  },

  /**
   * (Si querés paginación server-side, esto sigue existiendo)
   */
  async getProducts(filters?: {
    category?: string;
    search?: string;
    sort?: string;
    page?: number;
    limit?: number;
    includeCoupons?: boolean;
  }): Promise<ProductListResponse> {
    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 12;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const selectWithCoupons = '*, coupon_products(coupons(*))';
    const select = filters?.includeCoupons ? selectWithCoupons : '*';
    let query = supabase.from('products').select(select, { count: 'exact' });

    if (filters?.category) query = query.eq('category', filters.category);
    if (filters?.search) query = query.ilike('name', `%${filters.search}%`);

    switch (filters?.sort) {
      case 'oldest':
        query = query.order('created_at', { ascending: true });
        break;
      case 'price_asc':
        query = query.order('price', { ascending: true });
        break;
      case 'price_desc':
        query = query.order('price', { ascending: false });
        break;
      case 'newest':
      default:
        query = query.order('created_at', { ascending: false });
        break;
    }

    let { data, error, count } = await query.range(from, to);

    if (error && filters?.includeCoupons) {
      const message = error.message || '';
      if (message.includes('coupon_products') || message.includes('relationship')) {
        const fallback = await supabase
          .from('products')
          .select('*', { count: 'exact' })
          .range(from, to);
        data = fallback.data ?? null;
        error = fallback.error ?? null;
        count = fallback.count ?? null;
      }
    }

    if (error) throw new Error(error.message);

    const built = await buildProducts((data ?? []) as ProductRow[]);

    return {
      page,
      limit,
      total: count ?? 0,
      data: built,
    };
  },

  /**
   * Obtener producto por ID
   */
  async getProductById(id: string): Promise<ProductPublic> {
    const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
    if (error) throw new Error(error.message);
    const built = await buildProducts([data as ProductRow]);
    if (!built[0]) {
      throw new Error('Producto no encontrado.');
    }
    return built[0];
  },
};

function toNumber(value: number | string | null | undefined): number | null {
  if (value === null || value === undefined) return null;
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

async function buildProducts(products: ProductRow[]): Promise<ProductPublic[]> {
  if (products.length === 0) return [];

  const productIds = products.map((product) => product.id);

  const [{ data: images }, { data: variants }] = await Promise.all([
    supabase
      .from('product_images')
      .select('product_id,url,is_main,sort_order')
      .in('product_id', productIds),
    supabase
      .from('product_variants')
      .select('product_id,sku,size_id,color_id,base_price,final_price,discount_percentage,stock,is_active')
      .in('product_id', productIds),
  ]);

  const imageRows = (images ?? []) as ProductImageRow[];
  const variantRows = (variants ?? []) as ProductVariantRow[];

  const sizeIds = Array.from(
    new Set(
      variantRows
        .map((variant) => variant.size_id)
        .filter((id): id is string => Boolean(id))
    )
  );
  const colorIds = Array.from(
    new Set(
      variantRows
        .map((variant) => variant.color_id)
        .filter((id): id is string => Boolean(id))
    )
  );

  const categoryIds = Array.from(
    new Set(
      products
        .map((product) => product.category_id)
        .filter((id): id is string => Boolean(id))
    )
  );

  const [sizesResponse, colorsResponse, categoriesResponse] = await Promise.all([
    sizeIds.length
      ? supabase.from('sizes').select('id,name,type,sort_order').in('id', sizeIds)
      : Promise.resolve({ data: [] }),
    colorIds.length
      ? supabase.from('colors').select('id,name,hex').in('id', colorIds)
      : Promise.resolve({ data: [] }),
    categoryIds.length
      ? supabase.from('categories').select('id,name,slug').in('id', categoryIds)
      : Promise.resolve({ data: [] }),
  ]);

  const sizesById = new Map(
    (sizesResponse.data ?? ([] as SizeRow[])).map((size) => [size.id, size])
  );
  const colorsById = new Map(
    (colorsResponse.data ?? ([] as ColorRow[])).map((color) => [color.id, color])
  );
  const categoriesById = new Map(
    (categoriesResponse.data ?? ([] as CategoryRow[])).map((category) => [category.id, category])
  );

  const imagesByProduct = imageRows.reduce((acc, row) => {
    const list = acc.get(row.product_id) ?? [];
    list.push(row);
    acc.set(row.product_id, list);
    return acc;
  }, new Map<string, ProductImageRow[]>());

  const variantsByProduct = variantRows.reduce((acc, row) => {
    const list = acc.get(row.product_id) ?? [];
    list.push(row);
    acc.set(row.product_id, list);
    return acc;
  }, new Map<string, ProductVariantRow[]>());

  return products.map((product) => {
    const variants = (variantsByProduct.get(product.id) ?? []).filter(
      (variant) => variant.is_active !== false
    );

    const imageList = (imagesByProduct.get(product.id) ?? [])
      .slice()
      .sort((a, b) => {
        const mainDiff = Number(b.is_main) - Number(a.is_main);
        if (mainDiff !== 0) return mainDiff;
        return (a.sort_order ?? 0) - (b.sort_order ?? 0);
      })
      .map((row) => row.url)
      .filter((url) => typeof url === 'string' && url.trim() !== '');

    const variantPrices = variants
      .map((variant) => toNumber(variant.final_price ?? variant.base_price))
      .filter((value): value is number => value !== null);

    const variantDiscounts = variants
      .map((variant) => variant.discount_percentage ?? 0)
      .filter((value): value is number => Number.isFinite(value));

    const priceFallback = toNumber(product.price) ?? 0;
    const price = variantPrices.length > 0 ? Math.min(...variantPrices) : priceFallback;
    const discount =
      variantDiscounts.length > 0
        ? Math.max(...variantDiscounts)
        : toNumber(product.discount_percent) ?? 0;
    const stockFromVariants = variants.reduce(
      (sum, variant) => sum + (variant.stock ?? 0),
      0
    );
    const stock = variants.length > 0 ? stockFromVariants : product.stock ?? 0;

    const sizeNames = Array.from(
      new Set(
        variants
          .map((variant) => (variant.size_id ? sizesById.get(variant.size_id)?.name : null))
          .filter((name): name is string => Boolean(name))
      )
    );

    const colorNames = Array.from(
      new Set(
        variants
          .map((variant) => (variant.color_id ? colorsById.get(variant.color_id)?.name : null))
          .filter((name): name is string => Boolean(name))
      )
    );

    const categoryFromId = product.category_id
      ? categoriesById.get(product.category_id)?.name
      : null;
    const categoryName = product.category ?? categoryFromId ?? product.target ?? 'general';

    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: price.toString(),
      currency: product.currency ?? 'ARS',
      stock,
      category: categoryName,
      images: imageList,
      is_featured: Boolean(product.is_featured),
      created_at: product.created_at ?? new Date().toISOString(),
      updated_at: product.updated_at ?? undefined,
      is_active: product.is_active ?? true,
      discount_percent: discount,
      original_price: product.original_price ?? null,
      sku: product.sku ?? variants[0]?.sku ?? null,
      sizes: sizeNames,
      colors: colorNames,
      rating: product.rating ?? null,
      reviews: product.reviews ?? null,
      reviews_count: product.reviews_count ?? null,
      specs: product.specs ?? null,
      target: product.target ?? null,
      low_stock_threshold: product.low_stock_threshold ?? null,
      coupon_products: product.coupon_products ?? null,
    } satisfies ProductPublic;
  });
}
