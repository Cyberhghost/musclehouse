'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

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
  stock: number;
  imageUrl: string;
  freeShipping: boolean;
  categoryId: string;
}

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const { dispatch } = useCart();

  useEffect(() => {
    fetch('/api/categories')
      .then(r => r.json())
      .then(setCategories)
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const url = selectedCategory
      ? `/api/products?categoryId=${selectedCategory}`
      : '/api/products';
    fetch(url)
      .then(r => r.json())
      .then(data => { setProducts(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [selectedCategory]);

  function addToCart(product: Product) {
    dispatch({
      type: 'ADD_ITEM',
      item: {
        id: product.id,
        name: product.name,
        price: Number(product.price),
        promoPrice: product.promoPrice ? Number(product.promoPrice) : null,
        quantity: 1,
        imageUrl: product.imageUrl,
        freeShipping: product.freeShipping,
      },
    });
  }

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
            <a
              href="#produits"
              className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-4 px-10 rounded-lg text-lg transition-colors shadow-lg shadow-primary-900/30"
            >
              Acheter Maintenant
            </a>
            <Link
              href="/contact"
              className="border-2 border-primary-500 text-primary-400 hover:bg-primary-500 hover:text-white font-bold py-4 px-10 rounded-lg text-lg transition-colors"
            >
              Nous Contacter
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
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(selectedCategory === cat.id ? '' : cat.id);
                  const el = document.getElementById('produits');
                  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                  el?.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth' });
                }}
                className={`group rounded-xl overflow-hidden border transition-colors text-left ${
                  selectedCategory === cat.id
                    ? 'border-primary-500 bg-dark-700'
                    : 'bg-dark-800 border-dark-700 hover:border-primary-600'
                }`}
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
                  <p className={`font-semibold text-sm text-center transition-colors ${
                    selectedCategory === cat.id ? 'text-primary-400' : 'text-dark-100 group-hover:text-primary-400'
                  }`}>
                    {cat.name}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Products */}
      <section id="produits" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white">
            {selectedCategory
              ? categories.find(c => c.id === selectedCategory)?.name ?? 'Produits'
              : 'Tous nos Produits'}
          </h2>
          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory('')}
              className="text-primary-400 hover:text-primary-300 text-sm font-medium transition-colors"
            >
              Voir tout ×
            </button>
          )}
        </div>

        {/* Category filter tabs */}
        {categories.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-6">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                !selectedCategory
                  ? 'bg-primary-500 text-white'
                  : 'bg-dark-800 text-dark-300 hover:bg-dark-700 border border-dark-600'
              }`}
            >
              Tout
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-primary-500 text-white'
                    : 'bg-dark-800 text-dark-300 hover:bg-dark-700 border border-dark-600'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-dark-800 rounded-xl aspect-square animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24 text-dark-400">
            <p className="text-xl">Aucun produit disponible.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {products.map(product => (
              <div
                key={product.id}
                className="group bg-dark-800 rounded-xl overflow-hidden border border-dark-700 hover:border-primary-600 transition-colors flex flex-col"
              >
                <Link href={`/produit/${product.id}`} className="relative aspect-square bg-dark-700 block">
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
                    <span className="absolute top-2 right-2 bg-green-600 text-white text-xs font-bold px-1.5 py-0.5 rounded text-[10px]">
                      Livraison gratuite
                    </span>
                  )}
                </Link>
                <div className="p-3 flex flex-col flex-1">
                  <Link href={`/produit/${product.id}`}>
                    <p className="text-dark-100 font-semibold text-sm line-clamp-2 mb-2 hover:text-primary-400 transition-colors">
                      {product.name}
                    </p>
                  </Link>
                  <div className="flex items-center gap-2 mb-3">
                    {product.promoPrice ? (
                      <>
                        <span className="text-primary-400 font-bold text-sm">
                          {Number(product.promoPrice).toLocaleString('fr-DZ')} DA
                        </span>
                        <span className="text-dark-500 text-xs line-through">
                          {Number(product.price).toLocaleString('fr-DZ')} DA
                        </span>
                      </>
                    ) : (
                      <span className="text-primary-400 font-bold text-sm">
                        {Number(product.price).toLocaleString('fr-DZ')} DA
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => addToCart(product)}
                    disabled={product.stock === 0}
                    className="mt-auto w-full bg-primary-500 hover:bg-primary-600 disabled:bg-dark-600 disabled:text-dark-400 disabled:cursor-not-allowed text-white text-sm font-semibold py-2 rounded-lg transition-colors"
                  >
                    {product.stock === 0 ? 'Rupture de stock' : 'Ajouter au Panier'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

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
