'use client';
import { useEffect, useState } from 'react';
import { adminFetch } from '@/lib/admin-fetch';

interface ShippingFee {
  id: string;
  wilaya: string;
  wilayaId: number;
  amount: number;
}

export default function LivraisonPage() {
  const [fees, setFees] = useState<ShippingFee[]>([]);
  const [freeShippingGlobal, setFreeShippingGlobal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [savingGlobal, setSavingGlobal] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const load = async () => {
    try {
      const res = await adminFetch('/api/shipping');
      const data = await res.json();
      setFees(data.fees ?? []);
      setFreeShippingGlobal(data.freeShippingGlobal ?? false);
    } catch {
      setError('Erreur de chargement.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 2500);
  };

  const handleToggleGlobal = async (val: boolean) => {
    setSavingGlobal(true);
    try {
      const res = await adminFetch('/api/shipping', {
        method: 'PUT',
        body: JSON.stringify({ freeShippingGlobal: val }),
      });
      if (res.ok) {
        setFreeShippingGlobal(val);
        showSuccess('Paramètre global sauvegardé.');
      }
    } catch {
      setError('Erreur réseau.');
    } finally {
      setSavingGlobal(false);
    }
  };

  const handleSaveFee = async (fee: ShippingFee) => {
    const newAmount = edits[fee.wilaya];
    if (newAmount === undefined) return;
    if (isNaN(Number(newAmount)) || Number(newAmount) < 0) {
      alert('Montant invalide.');
      return;
    }
    setSaving(fee.wilaya);
    try {
      const res = await adminFetch('/api/shipping', {
        method: 'PUT',
        body: JSON.stringify({ wilaya: fee.wilaya, amount: Number(newAmount) }),
      });
      if (res.ok) {
        setEdits(prev => { const n = { ...prev }; delete n[fee.wilaya]; return n; });
        await load();
        showSuccess(`Frais de livraison pour ${fee.wilaya} sauvegardés.`);
      }
    } catch {
      alert('Erreur lors de la sauvegarde.');
    } finally {
      setSaving(null);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400">Chargement...</div>;
  if (error) return <div className="text-red-400 p-4">{error}</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Livraison</h1>

      {successMsg && (
        <div className="p-3 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 text-sm">
          {successMsg}
        </div>
      )}

      {/* Global toggle */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-5 flex items-center justify-between">
        <div>
          <p className="text-white font-medium">Livraison gratuite globale</p>
          <p className="text-gray-400 text-sm mt-0.5">Activer pour offrir la livraison gratuite sur toutes les wilayas</p>
        </div>
        <button
          onClick={() => handleToggleGlobal(!freeShippingGlobal)}
          disabled={savingGlobal}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50 ${freeShippingGlobal ? 'bg-orange-500' : 'bg-gray-600'}`}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${freeShippingGlobal ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
      </div>

      {/* Fees table */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-700/50">
              <tr>
                <th className="px-4 py-3 text-left text-gray-400 font-medium w-12">#</th>
                <th className="px-4 py-3 text-left text-gray-400 font-medium">Wilaya</th>
                <th className="px-4 py-3 text-left text-gray-400 font-medium">Frais (DA)</th>
                <th className="px-4 py-3 text-left text-gray-400 font-medium w-24">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {fees.map(fee => {
                const editVal = edits[fee.wilaya];
                const currentAmount = editVal !== undefined ? editVal : String(fee.amount);
                const isDirty = editVal !== undefined && Number(editVal) !== Number(fee.amount);
                return (
                  <tr key={fee.id} className="hover:bg-gray-700/30 transition-colors">
                    <td className="px-4 py-2 text-gray-500">{fee.wilayaId}</td>
                    <td className="px-4 py-2 text-white">{fee.wilaya}</td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        min="0"
                        value={currentAmount}
                        onChange={e => setEdits(prev => ({ ...prev, [fee.wilaya]: e.target.value }))}
                        className="w-28 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                      />
                    </td>
                    <td className="px-4 py-2">
                      {isDirty && (
                        <button
                          onClick={() => handleSaveFee(fee)}
                          disabled={saving === fee.wilaya}
                          className="px-3 py-1 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 rounded text-xs text-white transition-colors"
                        >
                          {saving === fee.wilaya ? '...' : 'Sauver'}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {fees.length === 0 && (
                <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-500">Aucune wilaya configurée</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
