'use client';
import { useState } from 'react';

type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled';

interface TrackingResult {
  id: string;
  status: OrderStatus;
  trackingNumber: string;
  customerName: string;
  wilaya: string;
  createdAt: string;
  updatedAt: string;
}

const STATUS_STEPS: { key: OrderStatus; label: string }[] = [
  { key: 'pending', label: 'En attente' },
  { key: 'confirmed', label: 'Confirmée' },
  { key: 'shipped', label: 'Expédiée' },
  { key: 'out_for_delivery', label: 'En livraison' },
  { key: 'delivered', label: 'Livrée' },
];

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'bg-yellow-900/40 text-yellow-400 border-yellow-700',
  confirmed: 'bg-blue-900/40 text-blue-400 border-blue-700',
  shipped: 'bg-primary-900/40 text-primary-400 border-primary-700',
  out_for_delivery: 'bg-purple-900/40 text-purple-400 border-purple-700',
  delivered: 'bg-green-900/40 text-green-400 border-green-700',
  cancelled: 'bg-red-900/40 text-red-400 border-red-700',
};

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'En attente',
  confirmed: 'Confirmée',
  shipped: 'Expédiée',
  out_for_delivery: 'En livraison',
  delivered: 'Livrée',
  cancelled: 'Annulée',
};

export default function SuiviPage() {
  const [trackingInput, setTrackingInput] = useState('');
  const [result, setResult] = useState<TrackingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const tn = trackingInput.trim();
    if (!tn) return;
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch(`/api/tracking/${encodeURIComponent(tn)}`);
      if (res.status === 404) {
        setError('Aucune commande trouvée avec ce numéro de suivi.');
        return;
      }
      if (!res.ok) {
        setError('Une erreur est survenue. Veuillez réessayer.');
        return;
      }
      const data: TrackingResult = await res.json();
      setResult(data);
    } catch {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  }

  const activeStepIndex = result
    ? STATUS_STEPS.findIndex(s => s.key === result.status)
    : -1;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-extrabold text-white mb-2">Suivi de commande</h1>
      <p className="text-dark-400 mb-10">Entrez votre numéro de suivi pour suivre votre commande.</p>

      <form onSubmit={handleSearch} className="flex gap-3 mb-8">
        <input
          type="text"
          value={trackingInput}
          onChange={e => setTrackingInput(e.target.value)}
          placeholder="Numéro de suivi..."
          className="flex-1 bg-dark-800 border border-dark-600 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-primary-500 transition-colors"
        />
        <button
          type="submit"
          disabled={loading || !trackingInput.trim()}
          className="bg-primary-500 hover:bg-primary-600 disabled:bg-dark-600 disabled:text-dark-400 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors text-sm"
        >
          {loading ? '...' : 'Rechercher'}
        </button>
      </form>

      {error && (
        <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 text-red-400 text-sm mb-6">
          {error}
        </div>
      )}

      {result && (
        <div className="bg-dark-800 rounded-xl border border-dark-700 overflow-hidden">
          <div className="p-5 border-b border-dark-700 flex items-start justify-between gap-4">
            <div>
              <p className="text-dark-400 text-xs mb-1">Numéro de suivi</p>
              <p className="text-primary-400 font-mono font-bold">{result.trackingNumber}</p>
            </div>
            <span className={`px-3 py-1 rounded-full border text-xs font-bold ${STATUS_COLORS[result.status]}`}>
              {STATUS_LABELS[result.status]}
            </span>
          </div>

          <div className="p-5 border-b border-dark-700 grid grid-cols-2 gap-4">
            <div>
              <p className="text-dark-400 text-xs mb-1">Client</p>
              <p className="text-white text-sm font-medium">{result.customerName}</p>
            </div>
            <div>
              <p className="text-dark-400 text-xs mb-1">Wilaya</p>
              <p className="text-white text-sm font-medium">{result.wilaya}</p>
            </div>
            <div>
              <p className="text-dark-400 text-xs mb-1">Date de commande</p>
              <p className="text-white text-sm">
                {new Date(result.createdAt).toLocaleDateString('fr-DZ', {
                  day: '2-digit', month: 'long', year: 'numeric',
                })}
              </p>
            </div>
            <div>
              <p className="text-dark-400 text-xs mb-1">Dernière mise à jour</p>
              <p className="text-white text-sm">
                {new Date(result.updatedAt).toLocaleDateString('fr-DZ', {
                  day: '2-digit', month: 'long', year: 'numeric',
                })}
              </p>
            </div>
          </div>

          {/* Status flow */}
          {result.status !== 'cancelled' && (
            <div className="p-5">
              <p className="text-dark-400 text-xs mb-4">Progression de la commande</p>
              <div className="flex items-center gap-0">
                {STATUS_STEPS.map((step, idx) => {
                  const isDone = idx <= activeStepIndex;
                  const isActive = idx === activeStepIndex;
                  return (
                    <div key={step.key} className="flex items-center flex-1 last:flex-none">
                      <div className="flex flex-col items-center gap-1">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${
                            isDone
                              ? 'bg-primary-500 border-primary-500 text-white'
                              : 'bg-dark-900 border-dark-600 text-dark-500'
                          } ${isActive ? 'ring-2 ring-primary-400 ring-offset-2 ring-offset-dark-800' : ''}`}
                        >
                          {isDone ? '✓' : idx + 1}
                        </div>
                        <span className={`text-[10px] text-center leading-tight w-14 ${isDone ? 'text-primary-400' : 'text-dark-500'}`}>
                          {step.label}
                        </span>
                      </div>
                      {idx < STATUS_STEPS.length - 1 && (
                        <div className={`flex-1 h-0.5 mb-5 ${idx < activeStepIndex ? 'bg-primary-500' : 'bg-dark-700'}`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {result.status === 'cancelled' && (
            <div className="p-5">
              <div className="bg-red-900/20 border border-red-800 rounded-lg p-3 text-red-400 text-sm text-center">
                Cette commande a été annulée.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
