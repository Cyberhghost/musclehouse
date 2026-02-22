import Link from 'next/link';
import Image from 'next/image';

interface Category {
  id: string;
  name: string;
  imageUrl?: string | null;
}

interface Product {
  id: string;
  name: string;
  price: number;
  promoPrice?: number | null;
  imageUrl: string;
  freeShipping: boolean;
}

async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/categories`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/products`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.slice(0, 8);
  } catch {
    return [];
  }
}

export default async function Home() {
  const [categories, products] = await Promise.all([getCategories(), getFeaturedProducts()]);

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gray-900 py-24 px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="inline-block bg-primary-500 text-white text-sm font-semibold px-4 py-1 rounded-full mb-6">
            Performance authentique
          </span>
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-white mb-4 leading-tight">
            POUSSE TES LIMITES
          </h1>
          <p className="text-2xl sm:text-3xl text-primary-400 font-bold mb-10">
            LA PERFORMANCE COMMENCE ICI
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/catalogue"
              className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-4 px-10 rounded-lg text-lg transition-colors shadow-lg"
            >
              Acheter Maintenant
            </Link>
            <Link
              href="/catalogue"
              className="border-2 border-white text-white hover:bg-white hover:text-gray-900 font-bold py-4 px-10 rounded-lg text-lg transition-colors"
            >
              Voir le Catalogue
            </Link>
          </div>
        </div>
      </section>

      {/* USP strip */}
      <section className="bg-black text-white py-3 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-2 text-center text-sm font-medium">
          <div className="flex items-center justify-center gap-2">
            <span>✅</span> Produits 100% authentiques
          </div>
          <div className="flex items-center justify-center gap-2">
            <span>🚀</span> Livraison dans toute l&apos;Algérie
          </div>
          <div className="flex items-center justify-center gap-2">
            <span>💰</span> Meilleurs prix garantis
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Nos Catégories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map(cat => (
              <Link
                key={cat.id}
                href={`/catalogue?categoryId=${cat.id}`}
                className="group bg-gray-50 rounded-xl overflow-hidden border border-gray-200 hover:border-primary-500 hover:shadow-md transition-all"
              >
                {cat.imageUrl ? (
                  <div className="relative aspect-video">
                    <Image src={cat.imageUrl} alt={cat.name} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="aspect-video bg-gray-100 flex items-center justify-center">
                    <span className="text-4xl">💪</span>
                  </div>
                )}
                <div className="p-3">
                  <p className="text-gray-800 font-semibold group-hover:text-primary-600 transition-colors text-sm text-center">
                    {cat.name}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Promos banner */}
      <section className="bg-primary-500 py-6 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-white font-bold text-lg">🎉 Profitez de nos promotions exclusives — Stocks limités !</p>
          <Link
            href="/catalogue"
            className="inline-block mt-3 bg-white text-primary-600 font-bold py-2 px-8 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Voir les promos
          </Link>
        </div>
      </section>

      {/* Latest Products */}
      {products.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Derniers Produits</h2>
            <Link href="/catalogue" className="text-primary-500 hover:text-primary-600 text-sm font-semibold transition-colors">
              Voir tout →
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {products.map(product => (
              <Link
                key={product.id}
                href={`/produit/${product.id}`}
                className="group bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-primary-400 hover:shadow-lg transition-all"
              >
                <div className="relative aspect-square bg-gray-100">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.promoPrice && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                      PROMO
                    </span>
                  )}
                  {product.freeShipping && (
                    <span className="absolute top-2 right-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">
                      Livraison gratuite
                    </span>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-gray-800 font-semibold text-sm line-clamp-2 mb-2">{product.name}</p>
                  <div className="flex items-center gap-2">
                    {product.promoPrice ? (
                      <>
                        <span className="text-primary-600 font-bold">{Number(product.promoPrice).toLocaleString('fr-DZ')} DA</span>
                        <span className="text-gray-400 text-xs line-through">{Number(product.price).toLocaleString('fr-DZ')} DA</span>
                      </>
                    ) : (
                      <span className="text-primary-600 font-bold">{Number(product.price).toLocaleString('fr-DZ')} DA</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* USP */}
      <section className="bg-gray-50 border-t border-gray-200 py-16 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center gap-3">
            <span className="text-5xl">✅</span>
            <h3 className="text-gray-900 font-bold text-lg">Produits Authentiques</h3>
            <p className="text-gray-600 text-sm">Tous nos produits sont 100% originaux et certifiés.</p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <span className="text-5xl">🚀</span>
            <h3 className="text-gray-900 font-bold text-lg">Livraison Rapide</h3>
            <p className="text-gray-600 text-sm">Livraison dans toute l&apos;Algérie sous 24-72h.</p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <span className="text-5xl">💰</span>
            <h3 className="text-gray-900 font-bold text-lg">Meilleurs Prix</h3>
            <p className="text-gray-600 text-sm">Prix compétitifs et promotions régulières.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
