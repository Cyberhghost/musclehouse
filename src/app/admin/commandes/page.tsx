'use client';
import { useEffect, useState } from 'react';
import { adminFetch } from '@/lib/admin-fetch';
import StatusBadge from '@/components/admin/StatusBadge';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  wilaya: string;
  totalAmount: number;
  status: string;
  trackingNumber: string | null;
  notes: string | null;
  createdAt: string;
  items: OrderItem[];
}

const STATUSES = [
  { key: '', label: 'Toutes' },
  { key: 'pending', label: 'En attente' },
  { key: 'confirmed', label: 'Confirmées' },
  { key: 'shipped', label: 'Expédiées' },
  { key: 'out_for_delivery', label: 'En livraison' },
  { key: 'delivered', label: 'Livrées' },
  { key: 'cancelled', label: 'Annulées' },
];

const STATUS_OPTIONS = [
  { value: 'pending', label: 'En attente' },
  { value: 'confirmed', label: 'Confirmée' },
  { value: 'shipped', label: 'Expédiée' },
  { value: 'out_for_delivery', label: 'En livraison' },
  { value: 'delivered', label: 'Livrée' },
  { value: 'cancelled', label: 'Annulée' },
];

export default function CommandesPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const load = async (status?: string) => {
    setLoading(true);
    try {
      const url = status ? `/api/orders?status=${status}` : '/api/orders';
      const res = await adminFetch(url);
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch {
      setError('Erreur de chargement des commandes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(activeTab || undefined); }, [activeTab]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const res = await adminFetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        await load(activeTab || undefined);
        if (selectedOrder?.id === orderId) {
          const updated = await adminFetch(`/api/orders/${orderId}`);
          setSelectedOrder(await updated.json());
        }
      }
    } catch {
      alert('Erreur lors de la mise à jour du statut.');
    } finally {
      setUpdatingId(null);
    }
  };

  const fmt = (n: number) => `${Number(n).toLocaleString('fr-DZ')} DA`;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Commandes</h1>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {STATUSES.map(s => (
          <button
            key={s.key}
            onClick={() => setActiveTab(s.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === s.key ? 'bg-orange-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {error && <div className="text-red-400">{error}</div>}

      {loading ? (
        <div className="flex items-center justify-center h-40 text-gray-400">Chargement...</div>
      ) : (
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-700/50">
                <tr>
                  <th className="px-4 py-3 text-left text-gray-400 font-medium">ID</th>
                  <th className="px-4 py-3 text-left text-gray-400 font-medium">Client</th>
                  <th className="px-4 py-3 text-left text-gray-400 font-medium">Téléphone</th>
                  <th className="px-4 py-3 text-left text-gray-400 font-medium">Wilaya</th>
                  <th className="px-4 py-3 text-left text-gray-400 font-medium">Total</th>
                  <th className="px-4 py-3 text-left text-gray-400 font-medium">Statut</th>
                  <th className="px-4 py-3 text-left text-gray-400 font-medium">Date</th>
                  <th className="px-4 py-3 text-left text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {orders.length === 0 && (
                  <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-500">Aucune commande</td></tr>
                )}
                {orders.map(o => (
                  <tr key={o.id} className="hover:bg-gray-700/30 transition-colors">
                    <td className="px-4 py-3 font-mono text-gray-400 text-xs">{o.id.slice(0, 8)}…</td>
                    <td className="px-4 py-3 text-white">{o.customerName}</td>
                    <td className="px-4 py-3 text-gray-300">{o.phone}</td>
                    <td className="px-4 py-3 text-gray-300">{o.wilaya}</td>
                    <td className="px-4 py-3 text-orange-400 font-medium">{fmt(o.totalAmount)}</td>
                    <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                    <td className="px-4 py-3 text-gray-400 whitespace-nowrap">{new Date(o.createdAt).toLocaleDateString('fr-DZ')}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2 items-center">
                        <select
                          value={o.status}
                          onChange={e => handleStatusChange(o.id, e.target.value)}
                          disabled={updatingId === o.id}
                          className="bg-gray-700 border border-gray-600 text-gray-200 text-xs rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-orange-500 disabled:opacity-50"
                        >
                          {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                        </select>
                        <button
                          onClick={() => setSelectedOrder(o)}
                          className="px-3 py-1 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 rounded text-xs transition-colors whitespace-nowrap"
                        >
                          Détails
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order detail modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-gray-800 rounded-2xl w-full max-w-lg border border-gray-700 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-700 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Détail de la Commande</h2>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-white">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-400">ID</p>
                  <p className="text-white font-mono text-xs break-all">{selectedOrder.id}</p>
                </div>
                <div>
                  <p className="text-gray-400">Date</p>
                  <p className="text-white">{new Date(selectedOrder.createdAt).toLocaleString('fr-DZ')}</p>
                </div>
                <div>
                  <p className="text-gray-400">Client</p>
                  <p className="text-white">{selectedOrder.customerName}</p>
                </div>
                <div>
                  <p className="text-gray-400">Téléphone</p>
                  <p className="text-white">{selectedOrder.phone}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-400">Adresse</p>
                  <p className="text-white">{selectedOrder.address}, {selectedOrder.wilaya}</p>
                </div>
                {selectedOrder.notes && (
                  <div className="col-span-2">
                    <p className="text-gray-400">Notes</p>
                    <p className="text-white">{selectedOrder.notes}</p>
                  </div>
                )}
                {selectedOrder.trackingNumber && (
                  <div className="col-span-2">
                    <p className="text-gray-400">Numéro de suivi</p>
                    <p className="text-orange-400 font-mono">{selectedOrder.trackingNumber}</p>
                  </div>
                )}
                <div>
                  <p className="text-gray-400">Statut</p>
                  <div className="mt-1"><StatusBadge status={selectedOrder.status} /></div>
                </div>
                <div>
                  <p className="text-gray-400">Total</p>
                  <p className="text-orange-400 font-semibold">{fmt(selectedOrder.totalAmount)}</p>
                </div>
              </div>

              <div>
                <p className="text-gray-400 text-sm mb-2">Articles</p>
                <div className="space-y-2">
                  {selectedOrder.items.map(item => (
                    <div key={item.id} className="flex items-center justify-between bg-gray-700/50 rounded-lg px-3 py-2 text-sm">
                      <span className="text-white">{item.name}</span>
                      <span className="text-gray-300">x{item.quantity}</span>
                      <span className="text-orange-400">{fmt(Number(item.price) * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-gray-400 text-sm mb-1">Changer le statut</p>
                <div className="flex flex-wrap gap-2">
                  {STATUS_OPTIONS.map(s => (
                    <button
                      key={s.value}
                      onClick={() => handleStatusChange(selectedOrder.id, s.value)}
                      disabled={selectedOrder.status === s.value || updatingId === selectedOrder.id}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                        selectedOrder.status === s.value
                          ? 'bg-orange-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-700 flex justify-end">
              <button onClick={() => setSelectedOrder(null)} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors">Fermer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
