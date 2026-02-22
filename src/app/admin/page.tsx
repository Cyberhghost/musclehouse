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
  wilaya: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

interface Stats {
  todayOrders: number;
  weekOrders: number;
  monthOrders: number;
  todayRevenue: number;
  weekRevenue: number;
  monthRevenue: number;
  byStatus: Record<string, number>;
}

function computeStats(orders: Order[]): Stats {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(startOfDay);
  startOfWeek.setDate(startOfDay.getDate() - startOfDay.getDay());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const byStatus: Record<string, number> = {};
  let todayOrders = 0, weekOrders = 0, monthOrders = 0;
  let todayRevenue = 0, weekRevenue = 0, monthRevenue = 0;

  for (const o of orders) {
    const d = new Date(o.createdAt);
    const amount = Number(o.totalAmount);
    byStatus[o.status] = (byStatus[o.status] || 0) + 1;
    if (d >= startOfMonth) { monthOrders++; monthRevenue += amount; }
    if (d >= startOfWeek) { weekOrders++; weekRevenue += amount; }
    if (d >= startOfDay) { todayOrders++; todayRevenue += amount; }
  }

  return { todayOrders, weekOrders, monthOrders, todayRevenue, weekRevenue, monthRevenue, byStatus };
}

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
      <p className="text-gray-400 text-sm">{label}</p>
      <p className="text-2xl font-bold text-white mt-1">{value}</p>
      {sub && <p className="text-gray-500 text-xs mt-1">{sub}</p>}
    </div>
  );
}

export default function DashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    adminFetch('/api/orders')
      .then(r => r.json())
      .then(data => { setOrders(Array.isArray(data) ? data : []); })
      .catch(() => setError('Erreur lors du chargement des commandes.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400">Chargement...</div>;
  if (error) return <div className="text-red-400 p-4">{error}</div>;

  const stats = computeStats(orders);
  const recent = orders.slice(0, 10);

  const fmt = (n: number) => `${n.toLocaleString('fr-DZ')} DA`;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Tableau de Bord</h1>

      {/* Revenue cards */}
      <div>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Revenus</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label="Aujourd'hui" value={fmt(stats.todayRevenue)} sub={`${stats.todayOrders} commande(s)`} />
          <StatCard label="Cette semaine" value={fmt(stats.weekRevenue)} sub={`${stats.weekOrders} commande(s)`} />
          <StatCard label="Ce mois" value={fmt(stats.monthRevenue)} sub={`${stats.monthOrders} commande(s)`} />
        </div>
      </div>

      {/* Status breakdown */}
      <div>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Par Statut</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {['pending','confirmed','shipped','out_for_delivery','delivered','cancelled'].map(s => (
            <div key={s} className="bg-gray-800 rounded-xl p-4 border border-gray-700 text-center">
              <p className="text-2xl font-bold text-white">{stats.byStatus[s] || 0}</p>
              <div className="mt-1"><StatusBadge status={s} /></div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent orders */}
      <div>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Commandes Récentes</h2>
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-700/50">
                <tr>
                  <th className="px-4 py-3 text-left text-gray-400 font-medium">ID</th>
                  <th className="px-4 py-3 text-left text-gray-400 font-medium">Client</th>
                  <th className="px-4 py-3 text-left text-gray-400 font-medium">Wilaya</th>
                  <th className="px-4 py-3 text-left text-gray-400 font-medium">Total</th>
                  <th className="px-4 py-3 text-left text-gray-400 font-medium">Statut</th>
                  <th className="px-4 py-3 text-left text-gray-400 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {recent.length === 0 && (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500">Aucune commande</td></tr>
                )}
                {recent.map(o => (
                  <tr key={o.id} className="hover:bg-gray-700/30 transition-colors">
                    <td className="px-4 py-3 font-mono text-gray-400 text-xs">{o.id.slice(0, 8)}…</td>
                    <td className="px-4 py-3 text-white">{o.customerName}</td>
                    <td className="px-4 py-3 text-gray-300">{o.wilaya}</td>
                    <td className="px-4 py-3 text-orange-400 font-medium">{fmt(Number(o.totalAmount))}</td>
                    <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                    <td className="px-4 py-3 text-gray-400">{new Date(o.createdAt).toLocaleDateString('fr-DZ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
