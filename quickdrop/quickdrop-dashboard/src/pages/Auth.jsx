import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Package, Truck, Building2, User, ChevronRight, ChevronLeft, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Auth({ isLogin = false }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, register } = useAuth();
  
  const initialRole = searchParams.get('role') || 'client';
  
  // Wizard State
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Form Data
  const [formData, setFormData] = useState({
    role: initialRole,
    first_name: '',
    last_name: '',
    phone_number: '',
    address: '',
    username: '',
    email: '',
    password: '',
    confirm_password: '',
    vehicle_type: 'bike'
  });

  // Login specific State
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  useEffect(() => {
    if (searchParams.get('role')) {
      setFormData(prev => ({ ...prev, role: searchParams.get('role') }));
    }
  }, [searchParams]);

  const updateForm = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(''); // clear errors when typing
  };

  const validatePhone = (phone) => {
    const keRegex = /^(?:254|\+254|0)?([17]\d{8})$/;
    return keRegex.test(phone.replace(/\s+/g, ''));
  };

  const handleNextStep = () => {
    if (step === 2) {
      if (!formData.first_name || !formData.last_name || !formData.phone_number || !formData.address) {
        setError("All personal details are required.");
        return;
      }
      if (!validatePhone(formData.phone_number)) {
        setError("Enter a valid Kenyan phone number.");
        return;
      }
    }
    setError('');
    setStep(s => s + 1);
  };

  const handlePreviousStep = () => {
    setError('');
    setStep(s => s - 1);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await login({ username: loginUsername, password: loginPassword });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match.");
      return;
    }
    
    setIsLoading(true);
    setError('');

    // Format phone
    const cleanPhone = formData.phone_number.replace(/\s+/g, '').replace('+', '');
    let finalPhone = cleanPhone;
    if (cleanPhone.startsWith('0')) finalPhone = '254' + cleanPhone.substring(1);

    const payload = {
      username: formData.username,
      email: formData.email,
      first_name: formData.first_name,
      last_name: formData.last_name,
      password1: formData.password,
      password2: formData.confirm_password,
      phone_number: `+${finalPhone}`,
      address: formData.address,
      user_type: formData.role === 'courier' ? 'worker' : 'customer',
      vehicle_type: formData.role === 'courier' ? formData.vehicle_type : ''
    };

    try {
      await register(payload);
      navigate('/dashboard');
    } catch (err) {
      if (err.response?.data?.errors) {
        const firstErrorKey = Object.keys(err.response.data.errors)[0];
        setError(`${firstErrorKey}: ${err.response.data.errors[firstErrorKey]}`);
      } else {
        setError(err.response?.data?.error || "Registration failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const roles = [
    { id: 'client', icon: User, label: 'Personal', desc: 'Send packages' },
    { id: 'courier', icon: Truck, label: 'Driver', desc: 'Earn money' },
    { id: 'partner', icon: Building2, label: 'Business', desc: 'Manage fleet' },
  ];

  const vehicles = [
    { id: 'bike', label: 'Motorbike' },
    { id: 'car', label: 'Car' },
    { id: 'van', label: 'Van' },
    { id: 'truck', label: 'Truck' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      
      {/* Logo */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex justify-center mb-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center shadow-lg shadow-orange-600/30">
            <Package className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-slate-800 dark:text-white">LOGISTICS</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-slate-900 dark:text-white">
          {isLogin ? 'Welcome back' : 'Create your account'}
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
          {isLogin ? "Don't have an account? " : "Already registered? "}
          <Link to={isLogin ? "/signup" : "/login"} className="font-medium text-orange-600 hover:text-orange-500">
            {isLogin ? "Sign up" : "Log in"}
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-800 py-8 px-4 shadow-xl shadow-slate-200/50 dark:shadow-none sm:rounded-2xl sm:px-10 border border-slate-100 dark:border-slate-700">
          
          {error && (
            <div className="mb-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/50 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          {isLogin ? (
            /* Login Form */
            <form className="space-y-5" onSubmit={handleLoginSubmit}>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Username</label>
                <div className="mt-1">
                  <input type="text" required value={loginUsername} onChange={e => setLoginUsername(e.target.value)}
                    className="appearance-none block w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm dark:bg-slate-900 dark:text-white transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                <div className="mt-1">
                  <input type="password" required value={loginPassword} onChange={e => setLoginPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm dark:bg-slate-900 dark:text-white transition-colors"
                  />
                </div>
              </div>
              <button type="submit" disabled={isLoading}
                className="w-full flex justify-center py-2.5 px-4 rounded-xl shadow-sm text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 disabled:opacity-50 transition-colors"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>
          ) : (
            /* Multi-Step Registration Wizard */
            <div className="relative">
              {/* Progress Steps Indicator */}
              <div className="flex items-center justify-between mb-8 relative">
                <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-slate-100 dark:bg-slate-700 -z-10 -translate-y-1/2"></div>
                
                {[1, 2, 3].map((s) => (
                  <div key={s} className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                    step >= s ? 'bg-orange-600 text-white' : 'bg-white border-2 border-slate-200 text-slate-400'
                  }`}>
                    {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
                  </div>
                ))}
              </div>

              <form onSubmit={step === 3 ? handleRegisterSubmit : (e) => e.preventDefault()}>
                
                {/* Step 1: Role */}
                {step === 1 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Choose your account type</h3>
                    <div className="grid grid-cols-1 gap-3">
                      {roles.map(r => (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => updateForm('role', r.id)}
                          className={`flex items-center p-4 rounded-xl border-2 transition-all ${
                            formData.role === r.id 
                              ? 'border-orange-500 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400' 
                              : 'border-slate-200 dark:border-slate-700 hover:border-orange-200 text-slate-500'
                          }`}
                        >
                          <div className={`p-2 rounded-lg mr-4 ${formData.role === r.id ? 'bg-orange-100 dark:bg-orange-900/50' : 'bg-slate-100 dark:bg-slate-800'}`}>
                            <r.icon className="w-6 h-6" />
                          </div>
                          <div className="text-left">
                            <span className="font-bold block text-slate-900 dark:text-white">{r.label}</span>
                            <span className="text-xs">{r.desc}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Personal Details */}
                {step === 2 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Personal Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">First Name</label>
                        <input type="text" required value={formData.first_name} onChange={e => updateForm('first_name', e.target.value)} className="mt-1 block w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl text-sm focus:ring-orange-500 focus:border-orange-500 dark:bg-slate-900 dark:text-white" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Last Name</label>
                        <input type="text" required value={formData.last_name} onChange={e => updateForm('last_name', e.target.value)} className="mt-1 block w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl text-sm focus:ring-orange-500 focus:border-orange-500 dark:bg-slate-900 dark:text-white" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Phone Number</label>
                      <input type="tel" required placeholder="07xx xxx xxx" value={formData.phone_number} onChange={e => updateForm('phone_number', e.target.value)} className="mt-1 block w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl text-sm focus:ring-orange-500 focus:border-orange-500 dark:bg-slate-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Address (City, Region)</label>
                      <input type="text" required placeholder="Nairobi, Kenya" value={formData.address} onChange={e => updateForm('address', e.target.value)} className="mt-1 block w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl text-sm focus:ring-orange-500 focus:border-orange-500 dark:bg-slate-900 dark:text-white" />
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Account & Security */}
                {step === 3 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Account Details</h3>
                    
                    {formData.role === 'courier' && (
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Vehicle Type</label>
                        <select value={formData.vehicle_type} onChange={e => updateForm('vehicle_type', e.target.value)} className="block w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl text-sm focus:ring-orange-500 focus:border-orange-500 dark:bg-slate-900 dark:text-white">
                          {vehicles.map(v => <option key={v.id} value={v.id}>{v.label}</option>)}
                        </select>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Username</label>
                      <input type="text" required value={formData.username} onChange={e => updateForm('username', e.target.value)} className="mt-1 block w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl text-sm focus:ring-orange-500 focus:border-orange-500 dark:bg-slate-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
                      <input type="email" required value={formData.email} onChange={e => updateForm('email', e.target.value)} className="mt-1 block w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl text-sm focus:ring-orange-500 focus:border-orange-500 dark:bg-slate-900 dark:text-white" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                        <input type="password" required value={formData.password} onChange={e => updateForm('password', e.target.value)} className="mt-1 block w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl text-sm focus:ring-orange-500 focus:border-orange-500 dark:bg-slate-900 dark:text-white" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Confirm Password</label>
                        <input type="password" required value={formData.confirm_password} onChange={e => updateForm('confirm_password', e.target.value)} className="mt-1 block w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl text-sm focus:ring-orange-500 focus:border-orange-500 dark:bg-slate-900 dark:text-white" />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Navigation Buttons */}
                <div className="mt-8 flex gap-3">
                  {step > 1 && (
                    <button type="button" onClick={handlePreviousStep} className="flex-1 flex justify-center py-2.5 px-4 border border-slate-300 rounded-xl shadow-sm text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 transition-colors">
                      Back
                    </button>
                  )}
                  {step < 3 ? (
                    <button type="button" onClick={handleNextStep} className="flex-1 flex justify-center py-2.5 px-4 rounded-xl shadow-sm text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 transition-colors">
                      Next Step
                    </button>
                  ) : (
                    <button type="submit" disabled={isLoading} className="flex-1 flex justify-center py-2.5 px-4 rounded-xl shadow-sm text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 disabled:opacity-50 transition-colors">
                      {isLoading ? 'Creating Account...' : 'Complete Sign Up'}
                    </button>
                  )}
                </div>

              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
