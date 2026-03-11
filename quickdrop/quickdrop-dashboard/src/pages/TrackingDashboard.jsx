import { useState } from 'react';
import { Search, MapPin, Phone, MessageCircle, Navigation2, Plus, ChevronRight } from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, Cell } from 'recharts';

// ─── Mock Data ───────────────────────────────────────────────────────────────
const PARTNERS = [
  { id: 1, name: 'Shiphike - For Packages', count: 98 },
  { id: 2, name: 'Roambee',                count: 11 },
  { id: 3, name: 'Post Hawk',              count: 22 },
  { id: 4, name: 'Loginext',               count: 53 },
  { id: 5, name: 'Forwardo',               count: 27 },
  { id: 6, name: 'Lopez Pallets',          count: 17 },
  { id: 7, name: 'Sonosolve',              count: 94 },
];

const TRUCKS = [
  {
    id: 'RE-74ER453TR5', status: 'On Route', isActive: true,
    time: '02:47:24', left: '56 min left',
    stops: ['E15 Sheffield', 'E17 Hathaway', 'E19 Westbrook', 'E22 Angeles'],
    img: 'https://i.imgur.com/2nCt3Sbl.png',
    capacity: 72,
    capacityData: [
      { name: 'A', v: 80 }, { name: 'B', v: 60 }, { name: 'C', v: 90 }, { name: 'D', v: 72 },
    ],
  },
  {
    id: 'YR-34DFR734W2', status: 'On Route', isActive: true, isSelected: true,
    time: '01:38:47', left: '57 min left',
    stops: ['E08 Knoxly', 'E12 Arkley', 'E15 Sheffield', 'E18 Melton City'],
    img: 'https://i.imgur.com/2nCt3Sbl.png',
    capacity: 82,
    capacityData: [
      { name: 'A', v: 65 }, { name: 'B', v: 88 }, { name: 'C', v: 55 }, { name: 'D', v: 82 },
    ],
  },
  {
    id: 'DW-847DE74E4R', status: 'On Route', isActive: true,
    time: '00:28:43', left: '78 min left',
    stops: ['E10 Farview', 'E14 Longtree', 'E17 Elmshire', 'E21 Porthaven'],
    img: 'https://i.imgur.com/2nCt3Sbl.png',
    capacity: 55,
    capacityData: [
      { name: 'A', v: 40 }, { name: 'B', v: 55 }, { name: 'C', v: 70 }, { name: 'D', v: 45 },
    ],
  },
  {
    id: 'AQ-2570RE141E', status: 'Waiting', isActive: false,
    time: '03:58:53', left: '28 min left',
    stops: ['E25 Kinsey', 'E29 Hockney', 'E31 Fellwood', 'E35 Ashbury'],
    img: 'https://i.imgur.com/2nCt3Sbl.png',
    capacity: 38,
    capacityData: [
      { name: 'A', v: 20 }, { name: 'B', v: 38 }, { name: 'C', v: 30 }, { name: 'D', v: 35 },
    ],
  },
  {
    id: 'BG-ER74R69B4R', status: 'On Route', isActive: true,
    time: '00:28:38', left: '88 min left',
    stops: ['E30 Stockham', 'E34 Whitley', 'E37 Croxton', 'E40 Anglees'],
    img: 'https://i.imgur.com/2nCt3Sbl.png',
    capacity: 63,
    capacityData: [
      { name: 'A', v: 63 }, { name: 'B', v: 45 }, { name: 'C', v: 70 }, { name: 'D', v: 58 },
    ],
  },
  {
    id: 'CV-414ER58SER', status: 'Waiting', isActive: false,
    time: '02:38:47', left: '18 min left',
    stops: ['E05 Greyham', 'E09 Brightmoor', 'E12 Hillcrest', 'E16 Fernway'],
    img: 'https://i.imgur.com/2nCt3Sbl.png',
    capacity: 29,
    capacityData: [
      { name: 'A', v: 30 }, { name: 'B', v: 22 }, { name: 'C', v: 29 }, { name: 'D', v: 25 },
    ],
  },
];

const CARGO_PHOTOS = [
  { id: 1, label: 'Point #1 Cargo Photo', addr: '712 Miles City · 12:35 PM', img: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=200&q=60' },
  { id: 2, label: 'Point #2 Cargo Photo', addr: '524 ShePast · 12:50 PM',   img: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=200&q=60' },
  { id: 3, label: 'Point #3 Cargo Photo', addr: '607 Holloway · 12:48 PM',  img: 'https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=200&q=60' },
];

// ─── Sub-components ───────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const isOnRoute = status === 'On Route';
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
      isOnRoute ? 'bg-rose-50 text-rose-500' : 'bg-slate-100 text-slate-400'
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full ${isOnRoute ? 'bg-rose-500' : 'bg-slate-400'}`} />
      {status}
    </span>
  );
}

function TruckCard({ truck, isSelected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-2xl border-2 p-3 transition-all ${
        isSelected
          ? 'border-rose-500 bg-white shadow-lg shadow-rose-100'
          : 'border-slate-100 bg-white hover:border-rose-200'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
          <Navigation2 className="w-3 h-3 text-rose-400" />
          {truck.id}
        </span>
        <StatusBadge status={truck.status} />
      </div>

      <div className="flex gap-2">
        {/* Time + stops */}
        <div className="flex-1 min-w-0">
          <div className="font-bold text-slate-800 text-sm font-mono">{truck.time}</div>
          <div className="text-[10px] text-slate-400 mt-0.5 mb-1">{truck.left}</div>
          <div className="space-y-0.5">
            {truck.stops.map((s, i) => (
              <div key={i} className="flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${i === 0 ? 'bg-rose-500' : 'bg-slate-200'}`} />
                <span className="text-[10px] text-slate-500 truncate">{s}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Truck image */}
        <div className="flex items-center justify-center w-24 h-16 flex-shrink-0">
          <img
            src={truck.img}
            alt={truck.id}
            onError={e => { e.target.style.display = 'none'; }}
            className="object-contain w-full h-full"
          />
        </div>
      </div>
    </button>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export function TrackingDashboard() {
  const [selectedId, setSelectedId] = useState('YR-34DFR734W2');
  const [showFilter, setShowFilter] = useState('All');
  const [activePartner, setActivePartner] = useState(null);
  const [activeTab, setActiveTab] = useState('Shipping Info');

  const selected = TRUCKS.find(t => t.id === selectedId) || TRUCKS[0];

  const filtered = TRUCKS.filter(t => {
    if (showFilter === 'Active')   return t.isActive;
    if (showFilter === 'Inactive') return !t.isActive;
    return true;
  });

  const tabs = ['Shipping Info', 'Vehicle Info', 'Documents', 'Company', 'Billing'];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* ── Left panel ── */}
      <div className="w-[320px] flex-shrink-0 flex flex-col bg-slate-50 border-r border-slate-100 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h1 className="text-xl font-bold text-slate-800">Tracking</h1>
          <button className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 transition-colors">
            <Search className="w-4 h-4" />
          </button>
        </div>

        {/* Filter by Partners */}
        <div className="px-5 mb-3">
          <p className="text-xs font-semibold text-slate-500 mb-2">Filter by Partners</p>
          <div className="flex flex-wrap gap-1.5">
            {PARTNERS.map(p => (
              <button
                key={p.id}
                onClick={() => setActivePartner(activePartner === p.id ? null : p.id)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                  activePartner === p.id
                    ? 'bg-rose-500 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-rose-300'
                }`}
              >
                {p.name}
                <span className={`font-bold ${activePartner === p.id ? 'text-rose-100' : 'text-slate-400'}`}>
                  {p.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Show toggle */}
        <div className="px-5 mb-3">
          <p className="text-xs font-semibold text-slate-500 mb-2">Show</p>
          <div className="flex gap-1.5">
            {['Active', 'Inactive', 'All'].map(v => (
              <button
                key={v}
                onClick={() => setShowFilter(v)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                  showFilter === v
                    ? 'bg-rose-500 text-white'
                    : 'bg-white border border-slate-200 text-slate-500 hover:border-rose-300'
                }`}
              >
                {v}
                {v === 'Active' && <span className="ml-1 opacity-70">45</span>}
                {v === 'Inactive' && <span className="ml-1 opacity-70">28</span>}
                {v === 'All' && <span className="ml-1 opacity-70">73</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Truck cards grid */}
        <div className="px-3 pb-4 grid grid-cols-2 gap-2.5">
          {filtered.map(truck => (
            <TruckCard
              key={truck.id}
              truck={truck}
              isSelected={selectedId === truck.id}
              onClick={() => setSelectedId(truck.id)}
            />
          ))}
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 overflow-y-auto bg-white">
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <h2 className="font-bold text-slate-800 text-sm font-mono">{selected.id}</h2>
            <StatusBadge status={selected.status} />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:border-rose-300 transition-colors">
              <Phone className="w-3.5 h-3.5" /> Call Driver
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500 rounded-xl text-xs font-semibold text-white hover:bg-rose-600 transition-colors">
              <MessageCircle className="w-3.5 h-3.5" /> Chat with Driver
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 px-6 border-b border-slate-100">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-rose-500 text-rose-500'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="px-6 py-4 space-y-6">
          {/* Capacity section */}
          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Current Truck Capacity</h3>
            <div className="rounded-2xl overflow-hidden bg-slate-100 relative h-40">
              {/* Capacity bar — red fill */}
              <div
                className="absolute inset-y-0 left-0 bg-rose-500 flex items-center justify-center transition-all duration-700"
                style={{ width: `${selected.capacity}%` }}
              >
                <span className="text-3xl font-bold text-white">{selected.capacity}%</span>
              </div>
              {/* Truck silhouette right side */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <div className="w-28 h-16 flex items-center justify-center opacity-30">
                  <svg viewBox="0 0 120 60" className="w-full h-full fill-slate-500">
                    <rect x="0" y="20" width="75" height="30" rx="4"/>
                    <rect x="75" y="10" width="35" height="40" rx="4"/>
                    <rect x="110" y="30" width="10" height="20" rx="2"/>
                    <circle cx="18" cy="52" r="7"/>
                    <circle cx="55" cy="52" r="7"/>
                    <circle cx="95" cy="52" r="7"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Route section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-700">Route</h3>
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <span className="font-mono font-bold text-slate-700">{selected.time}</span>
                <span>{selected.left}</span>
                <button className="flex items-center gap-1 px-3 py-1 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:border-rose-300 transition-colors">
                  ✏️ Change Route
                </button>
              </div>
            </div>
            {/* Map placeholder */}
            <div className="rounded-2xl bg-slate-100 h-44 relative overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                {/* Grid lines to suggest map */}
                {[0,1,2,3,4,5,6,7].map(i=>(
                  <div key={i} className="absolute border-slate-400 border-b" style={{top:`${i*14}%`,left:0,right:0,borderBottomWidth:'1px'}}/>
                ))}
                {[0,1,2,3,4,5,6,7,8,9].map(i=>(
                  <div key={i} className="absolute border-slate-400 border-r" style={{left:`${i*11}%`,top:0,bottom:0,borderRightWidth:'1px'}}/>
                ))}
              </div>
              {/* Route line SVG */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 180">
                <polyline
                  points="60,140 120,110 180,120 240,80 310,90 360,50"
                  fill="none" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                />
                {[{x:60,y:140},{x:120,y:110},{x:180,y:120},{x:240,y:80},{x:310,y:90},{x:360,y:50}].map((pt, i) => (
                  <circle key={i} cx={pt.x} cy={pt.y} r={i===0||i===5?"7":"4"} fill={i===0||i===5?"#f43f5e":"white"} stroke="#f43f5e" strokeWidth="2"/>
                ))}
              </svg>
              {/* Map controls */}
              <div className="absolute right-3 top-3 flex flex-col gap-1">
                {['+','−','◎'].map((c,i)=>(
                  <button key={i} className="w-7 h-7 bg-white rounded-lg shadow-sm text-slate-600 text-xs font-bold flex items-center justify-center hover:bg-slate-50 transition-colors">
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Cargo photo reports */}
          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Cargo Photo Reports</h3>
            <div className="flex gap-3">
              {CARGO_PHOTOS.map(photo => (
                <div key={photo.id} className="flex-1 rounded-xl overflow-hidden border border-slate-100">
                  <img src={photo.img} alt={photo.label} className="w-full h-24 object-cover" />
                  <div className="p-2">
                    <p className="text-[11px] font-semibold text-slate-700 truncate">{photo.label}</p>
                    <p className="text-[10px] text-slate-400 truncate">{photo.addr}</p>
                  </div>
                </div>
              ))}
              {/* Add photo button */}
              <button className="flex-1 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-rose-200 rounded-xl text-rose-400 hover:border-rose-400 hover:bg-rose-50 transition-colors min-h-[120px]">
                <Plus className="w-5 h-5" />
                <span className="text-xs font-medium">Add Photo</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
