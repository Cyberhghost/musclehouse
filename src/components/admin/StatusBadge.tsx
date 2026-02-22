type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled';

const STATUS_MAP: Record<OrderStatus, { label: string; className: string }> = {
  pending: { label: 'En attente', className: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' },
  confirmed: { label: 'Confirmée', className: 'bg-blue-500/20 text-blue-400 border border-blue-500/30' },
  shipped: { label: 'Expédiée', className: 'bg-purple-500/20 text-purple-400 border border-purple-500/30' },
  out_for_delivery: { label: 'En livraison', className: 'bg-orange-500/20 text-orange-400 border border-orange-500/30' },
  delivered: { label: 'Livrée', className: 'bg-green-500/20 text-green-400 border border-green-500/30' },
  cancelled: { label: 'Annulée', className: 'bg-red-500/20 text-red-400 border border-red-500/30' },
};

export default function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_MAP[status as OrderStatus] ?? { label: status, className: 'bg-gray-500/20 text-gray-400 border border-gray-500/30' };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.className}`}>
      {cfg.label}
    </span>
  );
}
