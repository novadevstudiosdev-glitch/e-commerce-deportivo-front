// ============================================
// HOME PAGE
// ============================================

export default function HomePage() {
  return (
    <div>
      <div className="text-center py-12">
        <h1 className="text-5xl font-bold mb-4">Bienvenido a SportWear</h1>
        <p className="text-xl text-gray-600">Tu tienda de ropa y accesorios deportivos</p>
      </div>

      <section className="py-12 bg-gray-50 rounded-lg">
        <h2 className="text-3xl font-bold mb-8 text-center">Categorías</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="p-6 bg-white rounded-lg shadow text-center hover:shadow-lg transition"
            >
              <p className="font-semibold">Categoría {i + 1}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
