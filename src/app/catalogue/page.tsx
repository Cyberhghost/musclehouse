'use client';
import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';

interface Category {
  id: string;
  name: string;
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
  category: Category;
}

function CatalogueContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('categoryId') || '';

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
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
    <>
      {/* Category tabs */}
      <div className="flex gap-2 flex-wrap mb-8">
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

      {/* Product grid */}
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
    </>
  );
}

export default function CataloguePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-extrabold text-white mb-8">Catalogue</h1>
      <Suspense fallback={
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-dark-800 rounded-xl aspect-square animate-pulse" />
          ))}
        </div>
      }>
        <CatalogueContent />
      </Suspense>
    </div>
  );
}
