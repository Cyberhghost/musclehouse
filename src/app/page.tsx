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
    <div className="bg-dark-950">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 py-24 px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/20 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-white mb-4">
            MUSCLE HOUSE <span className="text-primary-500">DZ</span>
          </h1>
          <p className="text-xl sm:text-2xl text-dark-300 mb-10 font-light">
            Votre partenaire nutrition sportive en Algérie
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/catalogue"
              className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-4 px-10 rounded-lg text-lg transition-colors shadow-lg shadow-primary-900/30"
            >
              Acheter Maintenant
            </Link>
            <Link
              href="/catalogue"
              className="border-2 border-primary-500 text-primary-400 hover:bg-primary-500 hover:text-white font-bold py-4 px-10 rounded-lg text-lg transition-colors"
            >
              Voir le Catalogue
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-bold text-white mb-8">Nos Catégories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map(cat => (
              <Link
                key={cat.id}
                href={`/catalogue?categoryId=${cat.id}`}
                className="group bg-dark-800 rounded-xl overflow-hidden border border-dark-700 hover:border-primary-600 transition-colors"
              >
                {cat.imageUrl ? (
                  <div className="relative aspect-video">
                    <Image src={cat.imageUrl} alt={cat.name} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="aspect-video bg-gradient-to-br from-primary-900/30 to-dark-700 flex items-center justify-center">
                    <span className="text-4xl">💪</span>
                  </div>
                )}
                <div className="p-3">
                  <p className="text-dark-100 font-semibold group-hover:text-primary-400 transition-colors text-sm text-center">
                    {cat.name}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      {products.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">Produits Vedettes</h2>
            <Link href="/catalogue" className="text-primary-400 hover:text-primary-300 text-sm font-medium transition-colors">
              Voir tout →
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {products.map(product => (
              <Link
                key={product.id}
                href={`/produit/${product.id}`}
                className="group bg-dark-800 rounded-xl overflow-hidden border border-dark-700 hover:border-primary-600 transition-colors"
              >
                <div className="relative aspect-square bg-dark-700">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.promoPrice && (
                    <span className="absolute top-2 left-2 bg-primary-500 text-white text-xs font-bold px-2 py-1 rounded">
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
                  <p className="text-dark-100 font-semibold text-sm line-clamp-2 mb-2">{product.name}</p>
                  <div className="flex items-center gap-2">
                    {product.promoPrice ? (
                      <>
                        <span className="text-primary-400 font-bold">{Number(product.promoPrice).toLocaleString('fr-DZ')} DA</span>
                        <span className="text-dark-500 text-xs line-through">{Number(product.price).toLocaleString('fr-DZ')} DA</span>
                      </>
                    ) : (
                      <span className="text-primary-400 font-bold">{Number(product.price).toLocaleString('fr-DZ')} DA</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* USP */}
      <section className="bg-dark-900 border-t border-dark-700 py-16 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center gap-3">
            <span className="text-5xl">✅</span>
            <h3 className="text-white font-bold text-lg">Produits Authentiques</h3>
            <p className="text-dark-400 text-sm">Tous nos produits sont 100% originaux et certifiés.</p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <span className="text-5xl">🚀</span>
            <h3 className="text-white font-bold text-lg">Livraison Rapide</h3>
            <p className="text-dark-400 text-sm">Livraison dans toute l'Algérie sous 24-72h.</p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <span className="text-5xl">💰</span>
            <h3 className="text-white font-bold text-lg">Meilleurs Prix</h3>
            <p className="text-dark-400 text-sm">Prix compétitifs et promotions régulières.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
