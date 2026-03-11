import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Truck, Package, Wrench, UserCog, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button';

const requestTypes = [
  { id: 'trucks', label: 'Hire a Truck', icon: Truck, description: 'Book a truck for your logistics needs' },
  { id: 'cargos', label: 'Ship Cargo', icon: Package, description: 'Send partial or full cargo shipments' },
  { id: 'repair', label: 'Vehicle Repair', icon: Wrench, description: 'Request emergency or scheduled maintenance' },
  { id: 'drivers', label: 'Hire a Driver', icon: UserCog, description: 'Get a verified driver for your fleet' },
  { id: 'reports', label: 'Report Issue', icon: AlertCircle, description: 'Flag a delayed or damaged delivery' }
];

export function RequestHub() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract the type from url, e.g. /requests/trucks -> trucks
  const pathParts = location.pathname.split('/');
  const defaultType = pathParts.length > 2 ? pathParts[2] : 'trucks';
  
  const [activeType, setActiveType] = useState(defaultType);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setActiveType(defaultType);
  }, [defaultType]);

  const handleTypeChange = (type) => {
    navigate(`/requests/${type}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Dummy submit
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 1200);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 pt-8 px-4 sm:px-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Request Hub</h1>
        <p className="text-slate-500 dark:text-slate-400">Create and manage your specific service requests.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Sidebar Nav for Requests */}
        <div className="lg:col-span-1 space-y-2">
          {requestTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => handleTypeChange(type.id)}
              className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 text-left transition-all ${
                activeType === type.id 
                  ? 'border-rose-500 bg-rose-50 dark:bg-rose-500/10' 
                  : 'border-transparent bg-white dark:bg-slate-900 shadow-sm hover:border-slate-200 dark:hover:border-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${activeType === type.id ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
                  <type.icon className="w-5 h-5" />
                </div>
                <span className={`font-bold ${activeType === type.id ? 'text-rose-700 dark:text-rose-400' : 'text-slate-700 dark:text-slate-300'}`}>
                  {type.label}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Form Container */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm">
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeType}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {success ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                      <CheckCircle2 className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Request Submitted!</h3>
                    <p className="text-slate-500 dark:text-slate-400 max-w-sm">
                      Your request has been securely logged and broadcasted to relevant partners. You will be notified of updates soon.
                    </p>
                    <Button className="mt-8" onClick={() => setSuccess(false)}>Create Another Request</Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                        {requestTypes.find(t => t.id === activeType)?.label}
                      </h2>
                      <p className="text-slate-500 dark:text-slate-400 mt-1">
                        {requestTypes.find(t => t.id === activeType)?.description}
                      </p>
                    </div>

                    {/* Common Fields */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Location / Origin</label>
                        <input type="text" required placeholder="Nairobi CBD, Kenya" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Schedule Date</label>
                        <input type="date" required className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-none" />
                      </div>
                    </div>

                    {/* Dynamic Fields based on Category */}
                    <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                      
                      {activeType === 'trucks' && (
                        <>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Truck Type</label>
                              <select className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-none appearance-none">
                                <option>Flatbed</option>
                                <option>Refrigerated</option>
                                <option>Box Truck</option>
                                <option>Tipper</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Capacity / Tonnage</label>
                              <input type="number" min="1" placeholder="e.g. 10 tons" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-none" />
                            </div>
                          </div>
                        </>
                      )}

                      {activeType === 'cargos' && (
                        <>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Cargo Type</label>
                              <select className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-none appearance-none">
                                <option>Electronics</option>
                                <option>Perishables</option>
                                <option>Building Materials</option>
                                <option>Hazardous (Hazmat)</option>
                                <option>General Retail</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Weight (kg)</label>
                              <input type="number" required placeholder="e.g. 500" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-none" />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Destination</label>
                            <input type="text" required placeholder="Mombasa Port, Kenya" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-none" />
                          </div>
                        </>
                      )}

                      {activeType === 'repair' && (
                        <>
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Vehicle License Plate</label>
                            <input type="text" required placeholder="e.g. KCA 123G" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-none" />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Problem Description</label>
                            <textarea rows="4" required placeholder="Describe the mechanical issue..." className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-none"></textarea>
                          </div>
                        </>
                      )}

                      {activeType === 'drivers' && (
                        <>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">License Class Required</label>
                              <select className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-none appearance-none">
                                <option>Class B (Light)</option>
                                <option>Class C (Heavy Commercial)</option>
                                <option>Class E (Articulated Heavy)</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Duration (Days)</label>
                              <input type="number" min="1" required placeholder="1" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-none" />
                            </div>
                          </div>
                        </>
                      )}

                      {activeType === 'reports' && (
                        <>
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Related Tracking / Order ID</label>
                            <input type="text" required placeholder="e.g. ORD-001 or YR-34DFR..." className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-none" />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Issue Details</label>
                            <textarea rows="4" required placeholder="Describe the delayed delivery, damaged goods, or dispute..." className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-none"></textarea>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="pt-6">
                      <Button type="submit" loading={loading} className="w-full py-4 text-base flex justify-center items-center gap-2">
                        Submit Request <ArrowRight className="w-5 h-5" />
                      </Button>
                    </div>

                  </form>
                )}
              </motion.div>
            </AnimatePresence>
            
          </div>
        </div>
      </div>
    </div>
  );
}
