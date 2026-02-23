'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  promoPrice?: number | null;
  stock: number;
  imageUrl: string;
  freeShipping: boolean;
  categoryId: string;
  category: Category;
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { dispatch } = useCart();

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(r => (r.ok ? r.json() : null))
      .then(data => { setProduct(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  function addToCart() {
    if (!product) return;
    dispatch({
      type: 'ADD_ITEM',
      item: {
        id: product.id,
        name: product.name,
        price: Number(product.price),
        promoPrice: product.promoPrice ? Number(product.promoPrice) : null,
        quantity,
        imageUrl: product.imageUrl,
        freeShipping: product.freeShipping,
      },
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-10 animate-pulse">
          <div className="aspect-square bg-dark-800 rounded-xl" />
          <div className="space-y-4">
            <div className="h-8 bg-dark-800 rounded w-3/4" />
            <div className="h-6 bg-dark-800 rounded w-1/4" />
            <div className="h-24 bg-dark-800 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-24 text-center text-dark-400">
        <p className="text-xl">Produit introuvable.</p>
        <Link href="/" className="mt-4 inline-block text-primary-400 hover:text-primary-300">
          ← Retour à l&apos;accueil
        </Link>
      </div>
    );
  }

  const effectivePrice = product.promoPrice ? Number(product.promoPrice) : Number(product.price);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="text-sm text-dark-400 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-primary-400 transition-colors">Accueil</Link>
        <span>/</span>
        <Link href={`/?categoryId=${product.categoryId}`} className="hover:text-primary-400 transition-colors">
          {product.category.name}
        </Link>
        <span>/</span>
        <span className="text-dark-200">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Image */}
        <div className="relative aspect-square rounded-xl overflow-hidden bg-dark-800">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            priority
          />
          {product.promoPrice && (
            <span className="absolute top-4 left-4 bg-primary-500 text-white text-sm font-bold px-3 py-1 rounded">
              PROMO
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <p className="text-primary-400 text-sm font-medium mb-1">{product.category.name}</p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">{product.name}</h1>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-3xl font-bold text-primary-500">
              {effectivePrice.toLocaleString('fr-DZ')} DA
            </span>
            {product.promoPrice && (
              <span className="text-dark-500 text-lg line-through">
                {Number(product.price).toLocaleString('fr-DZ')} DA
              </span>
            )}
          </div>

          {/* Stock */}
          <div className="mb-4">
            {product.stock > 0 ? (
              <span className="text-green-400 text-sm font-medium">
                ✓ En stock ({product.stock} disponible{product.stock > 1 ? 's' : ''})
              </span>
            ) : (
              <span className="text-red-400 text-sm font-medium">✗ Rupture de stock</span>
            )}
          </div>

          {product.freeShipping && (
            <div className="mb-4">
              <span className="bg-green-900/40 text-green-400 text-sm font-medium px-3 py-1 rounded-full border border-green-800">
                🚚 Livraison gratuite
              </span>
            </div>
          )}

          {/* Description */}
          <p className="text-dark-300 text-sm leading-relaxed mb-6 flex-1">{product.description}</p>

          {/* Quantity + CTA */}
          {product.stock > 0 && (
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-dark-600 rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-3 py-2 text-dark-300 hover:text-white hover:bg-dark-700 transition-colors"
                >
                  −
                </button>
                <span className="px-4 py-2 text-white font-semibold bg-dark-800">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                  className="px-3 py-2 text-dark-300 hover:text-white hover:bg-dark-700 transition-colors"
                >
                  +
                </button>
              </div>
              <button
                onClick={addToCart}
                className={`flex-1 font-bold py-3 rounded-lg transition-colors text-sm ${
                  added
                    ? 'bg-green-600 text-white'
                    : 'bg-primary-500 hover:bg-primary-600 text-white'
                }`}
              >
                {added ? '✓ Ajouté au panier' : 'Ajouter au Panier'}
              </button>
            </div>
          )}

          <Link
            href="/panier"
            className="mt-3 text-center text-sm text-dark-400 hover:text-primary-400 transition-colors"
          >
            Voir le panier →
          </Link>
        </div>
      </div>
    </div>
  );
}
