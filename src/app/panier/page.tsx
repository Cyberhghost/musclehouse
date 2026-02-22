'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

const WILAYAS = [
  'Adrar', 'Chlef', 'Laghouat', 'Oum El Bouaghi', 'Batna', 'Béjaïa', 'Biskra',
  'Béchar', 'Blida', 'Bouira', 'Tamanrasset', 'Tébessa', 'Tlemcen', 'Tiaret',
  'Tizi Ouzou', 'Alger', 'Djelfa', 'Jijel', 'Sétif', 'Saïda', 'Skikda',
  'Sidi Bel Abbès', 'Annaba', 'Guelma', 'Constantine', 'Médéa', 'Mostaganem',
  "M'Sila", 'Mascara', 'Ouargla', 'Oran', 'El Bayadh', 'Illizi',
  'Bordj Bou Arréridj', 'Boumerdès', 'El Tarf', 'Tindouf', 'Tissemsilt',
  'El Oued', 'Khenchela', 'Souk Ahras', 'Tipaza', 'Mila', 'Aïn Defla',
  'Naâma', 'Aïn Témouchent', 'Ghardaïa', 'Relizane',
];

interface OrderSuccess {
  id: string;
  totalAmount: number;
  status: string;
}

export default function PanierPage() {
  const { state, dispatch, total } = useCart();
  const [form, setForm] = useState({
    customerName: '',
    phone: '',
    address: '',
    wilaya: '',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState<OrderSuccess | null>(null);

  function updateQty(id: string, qty: number) {
    dispatch({ type: 'UPDATE_QUANTITY', id, quantity: qty });
  }

  function removeItem(id: string) {
    dispatch({ type: 'REMOVE_ITEM', id });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (state.items.length === 0) return;

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          items: state.items.map(item => ({
            productId: item.id,
            name: item.name,
            price: item.promoPrice ?? item.price,
            quantity: item.quantity,
            freeShipping: item.freeShipping,
          })),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error?.formErrors?.[0] || 'Une erreur est survenue. Veuillez réessayer.');
        return;
      }

      const order: OrderSuccess = await res.json();
      setSuccess(order);
      dispatch({ type: 'CLEAR' });
    } catch {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <div className="bg-dark-800 rounded-2xl p-10 border border-green-800">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-extrabold text-white mb-2">Commande confirmée!</h2>
          <p className="text-dark-300 mb-4">
            Votre commande a été passée avec succès. Nous vous contacterons bientôt.
          </p>
          <div className="bg-dark-900 rounded-lg p-4 mb-6 text-left">
            <p className="text-dark-400 text-sm mb-1">Numéro de commande :</p>
            <p className="text-primary-400 font-mono font-bold break-all">{success.id}</p>
            <p className="text-dark-400 text-sm mt-3 mb-1">Montant total :</p>
            <p className="text-white font-bold">{Number(success.totalAmount).toLocaleString('fr-DZ')} DA</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/suivi" className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 px-6 rounded-lg transition-colors">
              Suivre ma commande
            </Link>
            <Link href="/catalogue" className="border border-dark-600 text-dark-300 hover:text-white font-bold py-3 px-6 rounded-lg transition-colors">
              Continuer les achats
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-extrabold text-white mb-8">Mon Panier</h1>

      {state.items.length === 0 ? (
        <div className="text-center py-24 text-dark-400">
          <div className="text-6xl mb-4">🛒</div>
          <p className="text-xl mb-4">Votre panier est vide.</p>
          <Link href="/catalogue" className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 px-8 rounded-lg transition-colors">
            Voir le catalogue
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart items + form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Cart items */}
            <div className="bg-dark-800 rounded-xl border border-dark-700 overflow-hidden">
              <div className="p-4 border-b border-dark-700">
                <h2 className="font-semibold text-white">Articles ({state.items.length})</h2>
              </div>
              <div className="divide-y divide-dark-700">
                {state.items.map(item => (
                  <div key={item.id} className="p-4 flex items-start gap-4">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-dark-700 flex-shrink-0">
                      <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-dark-100 font-medium text-sm line-clamp-2 mb-1">{item.name}</p>
                      <p className="text-primary-400 font-bold text-sm">
                        {(item.promoPrice ?? item.price).toLocaleString('fr-DZ')} DA
                      </p>
                      {item.freeShipping && (
                        <p className="text-green-400 text-xs mt-1">Livraison gratuite</p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center border border-dark-600 rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateQty(item.id, item.quantity - 1)}
                          className="px-2 py-1 text-dark-400 hover:text-white hover:bg-dark-700 transition-colors text-sm"
                        >
                          −
                        </button>
                        <span className="px-3 py-1 text-white text-sm font-semibold bg-dark-800">{item.quantity}</span>
                        <button
                          onClick={() => updateQty(item.id, item.quantity + 1)}
                          className="px-2 py-1 text-dark-400 hover:text-white hover:bg-dark-700 transition-colors text-sm"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-xs text-dark-500 hover:text-red-400 transition-colors"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Checkout form */}
            <div className="bg-dark-800 rounded-xl border border-dark-700 overflow-hidden">
              <div className="p-4 border-b border-dark-700">
                <h2 className="font-semibold text-white">Informations de livraison</h2>
              </div>
              <form onSubmit={handleSubmit} className="p-4 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-dark-300 mb-1" htmlFor="customerName">
                      Nom complet *
                    </label>
                    <input
                      id="customerName"
                      type="text"
                      required
                      value={form.customerName}
                      onChange={e => setForm(f => ({ ...f, customerName: e.target.value }))}
                      className="w-full bg-dark-900 border border-dark-600 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-primary-500 transition-colors"
                      placeholder="Votre nom complet"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-dark-300 mb-1" htmlFor="phone">
                      Téléphone *
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      required
                      value={form.phone}
                      onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      className="w-full bg-dark-900 border border-dark-600 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-primary-500 transition-colors"
                      placeholder="0X XX XX XX XX"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-dark-300 mb-1" htmlFor="address">
                    Adresse *
                  </label>
                  <input
                    id="address"
                    type="text"
                    required
                    value={form.address}
                    onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                    className="w-full bg-dark-900 border border-dark-600 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-primary-500 transition-colors"
                    placeholder="Numéro, rue, quartier"
                  />
                </div>
                <div>
                  <label className="block text-sm text-dark-300 mb-1" htmlFor="wilaya">
                    Wilaya *
                  </label>
                  <select
                    id="wilaya"
                    required
                    value={form.wilaya}
                    onChange={e => setForm(f => ({ ...f, wilaya: e.target.value }))}
                    className="w-full bg-dark-900 border border-dark-600 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-primary-500 transition-colors"
                  >
                    <option value="">Sélectionnez votre wilaya</option>
                    {WILAYAS.map(w => (
                      <option key={w} value={w}>{w}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-dark-300 mb-1" htmlFor="notes">
                    Notes (optionnel)
                  </label>
                  <textarea
                    id="notes"
                    rows={3}
                    value={form.notes}
                    onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                    className="w-full bg-dark-900 border border-dark-600 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-primary-500 transition-colors resize-none"
                    placeholder="Instructions spéciales, point de repère..."
                  />
                </div>

                {error && (
                  <div className="bg-red-900/30 border border-red-700 rounded-lg p-3 text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting || state.items.length === 0}
                  className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-dark-600 disabled:text-dark-400 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-colors text-sm"
                >
                  {submitting ? 'Traitement en cours...' : 'Passer la Commande'}
                </button>
              </form>
            </div>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-dark-800 rounded-xl border border-dark-700 overflow-hidden sticky top-20">
              <div className="p-4 border-b border-dark-700">
                <h2 className="font-semibold text-white">Récapitulatif</h2>
              </div>
              <div className="p-4 space-y-3">
                {state.items.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-dark-400 line-clamp-1 flex-1 mr-2">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="text-dark-200 flex-shrink-0">
                      {((item.promoPrice ?? item.price) * item.quantity).toLocaleString('fr-DZ')} DA
                    </span>
                  </div>
                ))}
                <div className="border-t border-dark-700 pt-3 mt-3">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-dark-400">Sous-total</span>
                    <span className="text-dark-200">{total.toLocaleString('fr-DZ')} DA</span>
                  </div>
                  <div className="flex justify-between text-sm mb-3">
                    <span className="text-dark-400">Livraison</span>
                    <span className="text-dark-400 text-xs">Calculée à la commande</span>
                  </div>
                  <div className="flex justify-between font-bold text-base border-t border-dark-700 pt-3">
                    <span className="text-white">Total estimé</span>
                    <span className="text-primary-400">{total.toLocaleString('fr-DZ')} DA+</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
