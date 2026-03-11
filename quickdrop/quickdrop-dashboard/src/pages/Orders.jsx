import { useState, useCallback, useMemo } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Skeleton } from '../components/ui/Skeleton';
import { Button } from '../components/ui/Button';
import { TrackingStep } from '../components/ui/TrackingStep';
import { Modal } from '../components/ui/Modal';
import { useWebSocket } from '../hooks/useWebSocket';

// ------ Mock data (replace with API fetch ------
const MOCK_DELIVERIES = [
  { id: 1, order_id: 'ORD-001', status: 'IN_TRANSIT', recipient_name: 'Alice Wanjiru', delivery_location: 'Nairobi CBD', amount: '350.00', payment_status: 'PAID', tracking_steps: [
    { key: 'PENDING', label: 'Order Placed', is_complete: true, is_current: false },
    { key: 'ASSIGNED', label: 'Courier Assigned', is_complete: true, is_current: false },
    { key: 'PICKED_UP', label: 'Picked Up', is_complete: true, is_current: false },
    { key: 'IN_TRANSIT', label: 'In Transit', is_complete: false, is_current: true },
    { key: 'DELIVERED', label: 'Delivered', is_complete: false, is_current: false },
  ]},
  { id: 2, order_id: 'ORD-002', status: 'PENDING', recipient_name: 'James Otieno', delivery_location: 'Westlands, Nairobi', amount: '220.00', payment_status: 'PENDING', tracking_steps: [
    { key: 'PENDING', label: 'Order Placed', is_complete: false, is_current: true },
    { key: 'ASSIGNED', label: 'Courier Assigned', is_complete: false, is_current: false },
    { key: 'PICKED_UP', label: 'Picked Up', is_complete: false, is_current: false },
    { key: 'IN_TRANSIT', label: 'In Transit', is_complete: false, is_current: false },
    { key: 'DELIVERED', label: 'Delivered', is_complete: false, is_current: false },
  ]},
  { id: 3, order_id: 'ORD-003', status: 'DELIVERED', recipient_name: 'Fatuma Hassan', delivery_location: 'Karen, Nairobi', amount: '480.00', payment_status: 'PAID', tracking_steps: [
    { key: 'PENDING', label: 'Order Placed', is_complete: true, is_current: false },
    { key: 'ASSIGNED', label: 'Courier Assigned', is_complete: true, is_current: false },
    { key: 'PICKED_UP', label: 'Picked Up', is_complete: true, is_current: false },
    { key: 'IN_TRANSIT', label: 'In Transit', is_complete: true, is_current: false },
    { key: 'DELIVERED', label: 'Delivered', is_complete: false, is_current: true },
  ]},
];

const STATUS_FILTERS = ['All', 'PENDING', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'];

export default function Orders() {
  const [loading] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() =>
    MOCK_DELIVERIES.filter(d => {
      const matchSearch = d.order_id.toLowerCase().includes(search.toLowerCase()) ||
        d.recipient_name.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'All' || d.status === statusFilter;
      return matchSearch && matchStatus;
    }),
  [search, statusFilter]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Orders</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Manage and track all delivery orders</p>
        </div>
        <Button size="md">New Order</Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by order ID or recipient..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {STATUS_FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                statusFilter === f
                  ? 'bg-rose-500 text-white'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-rose-300'
              }`}
            >
              {f === 'All' ? 'All Orders' : f.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <Card noPad>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-700">
                {['Order ID', 'Recipient', 'Destination', 'Amount', 'Status', 'Payment', ''].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {loading
                ? Array(5).fill(0).map((_, i) => (
                    <tr key={i}>
                      {Array(7).fill(0).map((_, j) => (
                        <td key={j} className="px-5 py-4"><Skeleton className="h-4 w-full" /></td>
                      ))}
                    </tr>
                  ))
                : filtered.map(d => (
                    <tr key={d.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-5 py-4 font-mono font-semibold text-slate-700 dark:text-slate-200">{d.order_id}</td>
                      <td className="px-5 py-4 text-slate-700 dark:text-slate-300">{d.recipient_name}</td>
                      <td className="px-5 py-4 text-slate-500 dark:text-slate-400 truncate max-w-[160px]">{d.delivery_location}</td>
                      <td className="px-5 py-4 font-medium text-slate-700 dark:text-slate-200">KES {d.amount}</td>
                      <td className="px-5 py-4"><Badge status={d.status} /></td>
                      <td className="px-5 py-4"><Badge status={d.payment_status} /></td>
                      <td className="px-5 py-4">
                        <Button variant="ghost" size="sm" onClick={() => setSelected(d)}>View</Button>
                      </td>
                    </tr>
                  ))
              }
            </tbody>
          </table>
          {!loading && filtered.length === 0 && (
            <div className="py-16 text-center text-slate-400">No orders match your filter.</div>
          )}
        </div>
      </Card>

      {/* Detail modal with tracking stepper */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title={`Order ${selected?.order_id}`} size="md">
        {selected && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><p className="text-slate-400 mb-0.5">Recipient</p><p className="font-medium dark:text-slate-100">{selected.recipient_name}</p></div>
              <div><p className="text-slate-400 mb-0.5">Destination</p><p className="font-medium dark:text-slate-100">{selected.delivery_location}</p></div>
              <div><p className="text-slate-400 mb-0.5">Amount</p><p className="font-medium dark:text-slate-100">KES {selected.amount}</p></div>
              <div><p className="text-slate-400 mb-0.5">Payment</p><Badge status={selected.payment_status} /></div>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">Delivery Progress</p>
              <TrackingStep steps={selected.tracking_steps} />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
