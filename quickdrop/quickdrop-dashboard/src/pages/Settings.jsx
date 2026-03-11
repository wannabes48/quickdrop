import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { User, Bell, Shield, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';

export function Settings() {
  const { user, role, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Dummy save for demo
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 pt-8 px-4 sm:px-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400">Manage your profile and platform preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Nav tabs for settings (dummy interface) */}
        <div className="md:col-span-1 space-y-2">
          {[
            { id: 'profile', icon: User, label: 'Profile Settings' },
            { id: 'notifications', icon: Bell, label: 'Notifications' },
            { id: 'security', icon: Shield, label: 'Security' },
            ...(role === 'courier' || role === 'partner' ? [{ id: 'payout', icon: Wallet, label: 'Payout Methods' }] : []),
          ].map((tab, i) => (
            <button
              key={tab.id}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left font-semibold transition-all ${
                i === 0 
                  ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content area */}
        <div className="md:col-span-2">
          <Card className="p-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Personal Information</h3>
            
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">Name</label>
                  <input 
                    type="text" 
                    defaultValue={user?.name || ''}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">Role</label>
                  <input 
                    type="text" 
                    defaultValue={role?.toUpperCase() || ''}
                    disabled
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">Email Address</label>
                <input 
                  type="email" 
                  defaultValue={user?.email || ''}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                />
              </div>

              {role === 'courier' && (
                <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">Vehicle Registration Info</label>
                  <input 
                    type="text" 
                    placeholder="e.g. KCA 123G - Isuzu NQR"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                  />
                </div>
              )}

              <div className="pt-6 flex justify-end gap-3">
                <Button variant="outline">Cancel</Button>
                <Button onClick={handleSave} loading={loading}>Save Changes</Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}