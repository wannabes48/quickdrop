import { useState, useCallback, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, DollarSign, Package, Star } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Skeleton } from '../components/ui/Skeleton';
import { Badge } from '../components/ui/Badge';

const RANGE_OPTIONS = ['Daily', 'Weekly', 'Monthly'];

// Mock data generator
const generateData = (range) => {
  const now = new Date();
  if (range === 'Daily') {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now); d.setDate(d.getDate() - (6 - i));
      return { date: d.toLocaleDateString('en', { weekday: 'short' }), amount: Math.round(Math.random() * 2000 + 500) };
    });
  }
  if (range === 'Weekly') {
    return Array.from({ length: 8 }, (_, i) => ({
      date: `Wk ${i + 1}`, amount: Math.round(Math.random() * 10000 + 3000)
    }));
  }
  return Array.from({ length: 12 }, (_, i) => ({
    date: new Date(now.getFullYear(), i).toLocaleDateString('en', { month: 'short' }),
    amount: Math.round(Math.random() * 40000 + 10000)
  }));
};

const StatCard = ({ icon: Icon, label, value, sub, color = 'rose' }) => {
  const colors = { rose: 'bg-rose-50 text-rose-500 dark:bg-rose-900/30', blue: 'bg-blue-50 text-blue-500 dark:bg-blue-900/30', green: 'bg-green-50 text-green-500 dark:bg-green-900/30', amber: 'bg-amber-50 text-amber-500 dark:bg-amber-900/30' };
  return (
    <Card className="flex items-start gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${colors[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
        <p className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-0.5">{value}</p>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>
    </Card>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl px-4 py-2.5 shadow-lg text-sm">
      <p className="font-medium text-slate-600 dark:text-slate-300 mb-1">{label}</p>
      <p className="text-rose-500 font-bold">KES {payload[0].value.toLocaleString()}</p>
    </div>
  );
};

export default function Earnings() {
  const [range, setRange] = useState('Weekly');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(() => {
    setLoading(true);
    // Simulate API fetch: GET /api/earnings/?range=Weekly
    setTimeout(() => {
      setData(generateData(range));
      setLoading(false);
    }, 800);
  }, [range]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const total = data.reduce((s, d) => s + d.amount, 0);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Earnings</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Your income overview across all deliveries</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={DollarSign} label="Total Earned" value={`KES ${total.toLocaleString()}`} sub={`${range} total`} color="rose" />
        <StatCard icon={Package} label="Deliveries" value="47" sub="Completed this period" color="blue" />
        <StatCard icon={TrendingUp} label="Avg per Delivery" value={`KES ${Math.round(total / (data.length || 1)).toLocaleString()}`} color="green" />
        <StatCard icon={Star} label="Rating" value="4.8 / 5.0" sub="Based on 47 ratings" color="amber" />
      </div>

      {/* Chart */}
      <Card header={
        <div className="flex items-center justify-between w-full">
          <span className="font-semibold text-slate-800 dark:text-slate-100">Earnings Chart</span>
          <div className="flex gap-1">
            {RANGE_OPTIONS.map(r => (
              <button key={r} onClick={() => setRange(r)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  range === r ? 'bg-rose-500 text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >{r}</button>
            ))}
          </div>
        </div>
      }>
        {loading
          ? <Skeleton className="h-64 w-full rounded-xl" />
          : (
            <ResponsiveContainer width="100%" height={256}>
              <AreaChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 8 }}>
                <defs>
                  <linearGradient id="earningsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.1)" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false}
                  tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone" dataKey="amount"
                  stroke="#f43f5e" strokeWidth={2.5}
                  fill="url(#earningsGrad)"
                  dot={{ r: 3, fill: '#f43f5e', strokeWidth: 0 }}
                  activeDot={{ r: 5, fill: '#f43f5e' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )
        }
      </Card>
    </div>
  );
}