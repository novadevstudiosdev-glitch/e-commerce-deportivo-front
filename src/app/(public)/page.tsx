"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { productsService, ProductPublic } from "@/services/products.service";
import { buildProductSlug, formatCurrency } from "@/lib/utils";

type Slide = {
  title: string;
  subtitle: string;
  cta: string;
  href: string;
  image: string; // /public/...
};

type CategoryCard = {
  title: string;
  href: string;
  image: string;
  icon: "user" | "bag";
};

type FeaturedProduct = {
  id: string;
  title: string;
  category: string;
  price: string;
  badge?: "Oferta" | "Nuevo";
  image: string;
  href: string;
};

const SLIDES: Slide[] = [
  {
    title: "Nueva Colección\nPrimavera 2026",
    subtitle: "Descubrí las últimas tendencias en ropa deportiva",
    cta: "Explorar Ahora",
    href: "/products",
    image: "/carrusel1.jpeg",
  },
  {
    title: "Entrená con\nestilo y confort",
    subtitle: "Outfits para gym, running y training",
    cta: "Descubrir Más",
    href: "/categories/fitness",
    image: "/carrusel2.jpg",
  },
  {
    title: "Accesorios\nimprescindibles",
    subtitle: "Todo lo que necesitás para tu rutina",
    cta: "Ver Accesorios",
    href: "/categories/accesorios",
    image: "/carrusel3.avif",
  },
];

const CATEGORY_CARDS: CategoryCard[] = [
  { title: "Hombre", href: "/categories/hombre", image: "/categoriaHombre.webp", icon: "user" },
  { title: "Mujer", href: "/categories/mujer", image: "/categoriaMujer.avif", icon: "user" },
  { title: "Accesorios", href: "/categories/accesorios", image: "/categoriaAccesorios.avif", icon: "bag" },
];

const FEATURED: FeaturedProduct[] = [
  {
    id: "p1",
    title: "Zapatillas Running",
    category: "CALZADO",
    price: "$ 129.999,00",
    badge: "Oferta",
    image: "/zapatillas%20running.avif",
    href: "/products",
  },
  {
    id: "p2",
    title: "Remera Técnica",
    category: "ROPA",
    price: "$ 34.999,00",
    image: "/remeraTecnica.jpg",
    href: "/products",
  },
  {
    id: "p3",
    title: "Jogger Training",
    category: "ROPA",
    price: "$ 59.999,00",
    badge: "Nuevo",
    image: "/jogger%20training.webp",
    href: "/products",
  },
  {
    id: "p4",
    title: "Mochila Deportiva",
    category: "ACCESORIOS",
    price: "$ 79.999,00",
    image: "/mochilaDeportiva.avif",
    href: "/products",
  },
];

function mapToFeatured(product: ProductPublic): FeaturedProduct {
  const image =
    product.images && product.images.length > 0 ? product.images[0] : "/placeholder.png";
  return {
    id: product.id,
    title: product.name,
    category: (product.category || "producto").toUpperCase(),
    price: formatCurrency(Number(product.price), product.currency || "ARS"),
    badge: product.is_featured ? "Oferta" : undefined,
    image,
    href: `/products/${buildProductSlug(product.name, product.id)}`,
  };
}

export default function HomePage() {
  const [featured, setFeatured] = useState<FeaturedProduct[]>(FEATURED);

  useEffect(() => {
    let isMounted = true;

    const loadFeatured = async () => {
      try {
        const response = await productsService.getProducts({ limit: 50, sort: "newest" });
        let items = response.data.filter((item) => item.is_featured);
        if (items.length === 0) {
          items = response.data.slice(0, 4);
        } else {
          items = items.slice(0, 4);
        }

        if (!isMounted) return;
        setFeatured(items.map(mapToFeatured));
      } catch (err) {
        if (!isMounted) return;
        setFeatured(FEATURED);
      }
    };

    loadFeatured();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="bg-white">
      <HeroCarousel />

      {/* Categorías (igual al video) */}
      <section className="bg-white py-14">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-center text-4xl font-extrabold tracking-tight text-slate-900">
            Explora Nuestras Categorías
          </h2>
          <p className="mt-3 text-center text-base text-slate-600">
            Encuentra el equipamiento perfecto para tu estilo de vida activo
          </p>

          <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
            {CATEGORY_CARDS.map((c) => (
              <Link
                key={c.title}
                href={c.href}
                className="group relative overflow-hidden rounded-3xl shadow-[0_12px_30px_rgba(2,6,23,0.10)]"
              >
                <div className="relative h-[320px] w-full">
                  <Image
                    src={c.image}
                    alt={c.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    priority={false}
                  />
                  {/* overlay bottom */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                </div>

                <div className="absolute bottom-6 left-6 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-500 text-white shadow">
                    {c.icon === "user" ? <UserIcon className="h-5 w-5" /> : <BagIcon className="h-5 w-5" />}
                  </span>
                  <p className="text-2xl font-extrabold text-white drop-shadow">{c.title}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Productos destacados (igual al video) */}
      <section className="bg-white pb-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h3 className="text-4xl font-extrabold tracking-tight text-slate-900">Productos Destacados</h3>
              <p className="mt-2 text-base text-slate-600">Los favoritos de nuestros clientes</p>
            </div>

            <Link href="/products" className="flex items-center gap-2 text-sky-600 hover:text-sky-700">
              Ver Todo <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p) => (
              <Link
                key={p.id}
                href={p.href}
                className="group rounded-3xl bg-white shadow-[0_12px_30px_rgba(2,6,23,0.10)] ring-1 ring-black/5 transition hover:-translate-y-0.5"
              >
                <div className="relative overflow-hidden rounded-3xl">
                  <div className="relative aspect-[4/3] w-full bg-slate-100">
                    <Image
                      src={p.image}
                      alt={p.title}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-[1.03]"
                      sizes="(max-width: 1024px) 50vw, 25vw"
                    />
                  </div>

                  {/* Badge (Oferta/Nuevo) */}
                  {p.badge && (
                    <span
                      className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold ${
                        p.badge === "Oferta" ? "bg-lime-300 text-lime-950" : "bg-sky-500 text-white"
                      }`}
                    >
                      {p.badge}
                    </span>
                  )}

                  {/* Heart */}
                  <button
                    type="button"
                    className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow hover:bg-white"
                    onClick={(e) => e.preventDefault()}
                    aria-label="Favorito"
                  >
                    <HeartIcon className="h-5 w-5" />
                  </button>
                </div>

                <div className="px-5 pb-5 pt-4">
                  <p className="text-xs font-semibold tracking-wide text-slate-500">{p.category}</p>
                  <p className="mt-2 text-base font-semibold text-slate-900">{p.title}</p>
                  <p className="mt-2 text-sm text-slate-700">{p.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

/* ===== Hero Carousel (igual al video) ===== */
function HeroCarousel() {
  const slides = useMemo(() => SLIDES, []);
  const [index, setIndex] = useState(0);

  // Auto-play (suave como el video)
  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 6000);
    return () => clearInterval(id);
  }, [slides.length]);

  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length);
  const next = () => setIndex((i) => (i + 1) % slides.length);

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 pt-4">
        <div className="relative overflow-hidden rounded-2xl">
          {/* Slides */}
          <div className="relative h-[420px] w-full md:h-[520px]">
            {slides.map((s, i) => (
              <div
                key={s.title}
                className={`absolute inset-0 transition-opacity duration-700 ${i === index ? "opacity-100" : "opacity-0"}`}
                aria-hidden={i !== index}
              >
                <Image
                  src={s.image}
                  alt={s.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 1200px"
                  quality={100}
                  priority={i === 0}
                />

                {/* Content */}
                <div className="absolute left-8 top-1/2 w-[min(560px,90%)] -translate-y-1/2 md:left-12">
                  <h1 className="whitespace-pre-line text-4xl font-extrabold leading-tight text-white drop-shadow md:text-6xl">
                    {s.title}
                  </h1>
                  <p className="mt-4 text-lg text-white/90 drop-shadow">{s.subtitle}</p>

                  <Link
                    href={s.href}
                    className="mt-7 inline-flex items-center gap-3 rounded-xl bg-sky-500 px-6 py-4 text-sm font-semibold text-white shadow hover:bg-sky-600"
                  >
                    {s.cta} <ArrowRight className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Arrows (círculo gris) */}
          <button
            type="button"
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/35 p-3 text-white hover:bg-black/45"
            aria-label="Anterior"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            type="button"
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/35 p-3 text-white hover:bg-black/45"
            aria-label="Siguiente"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Dots (píldora abajo centro) */}
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-full bg-black/25 px-4 py-2">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                className={`h-2.5 rounded-full transition-all ${
                  i === index ? "w-10 bg-white" : "w-2.5 bg-white/60 hover:bg-white/80"
                }`}
                aria-label={`Ir al slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ===== Icons (sin librerías) ===== */
function ArrowRight({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M11.2 3.5a.9.9 0 0 1 1.27 0l5.03 5.03a.9.9 0 0 1 0 1.27l-5.03 5.03a.9.9 0 1 1-1.27-1.27l3.5-3.5H3.5a.9.9 0 1 1 0-1.8h11.7l-3.5-3.5a.9.9 0 0 1 0-1.27Z" />
    </svg>
  );
}

function ChevronLeft({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M12.78 15.53a.75.75 0 0 1-1.06 0l-5-5a.75.75 0 0 1 0-1.06l5-5a.75.75 0 1 1 1.06 1.06L8.31 10l4.47 4.47a.75.75 0 0 1 0 1.06Z" />
    </svg>
  );
}

function ChevronRight({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M7.22 4.47a.75.75 0 0 1 1.06 0l5 5a.75.75 0 0 1 0 1.06l-5 5a.75.75 0 1 1-1.06-1.06L11.69 10 7.22 5.53a.75.75 0 0 1 0-1.06Z" />
    </svg>
  );
}

function HeartIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 21s-7-4.6-9.4-9.1C.9 8.8 2.4 6 5.4 5.2c1.7-.5 3.6.1 4.8 1.5C11.4 5.3 13.3 4.7 15 5.2c3 .8 4.5 3.6 2.8 6.7C19 16.4 12 21 12 21Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UserIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M20 21a8 8 0 1 0-16 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function BagIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 8h12l-1 13H7L6 8Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M9 8a3 3 0 0 1 6 0"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

