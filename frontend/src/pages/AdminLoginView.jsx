import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Loader2, ShieldCheck, ArrowLeft } from 'lucide-react';

export default function AdminLoginView() {
  const { adminLogin } = useAuth();
  const { navigateTo, addToast } = useShop();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!email.trim()) newErrors.email = 'Admin email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Enter a valid email';
    if (!password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      await adminLogin(email, password);
      addToast('Admin access granted ✅', 'success');
      navigateTo('admin-dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Admin login failed. Invalid credentials.';
      addToast(msg, 'error');
      setErrors({ form: msg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Dark-themed animated background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-violet-500/8 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-amber-500/6 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '4s' }} />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        {/* Back link */}
        <button
          onClick={() => navigateTo('login')}
          className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to User Login
        </button>

        {/* Card — dark glassmorphism */}
        <div className="relative rounded-3xl p-8 sm:p-10 overflow-hidden border border-slate-700/50 bg-slate-800/60 backdrop-blur-2xl shadow-2xl shadow-black/30">
          {/* Top gradient line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-amber-400 to-orange-500" />

          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-violet-500 to-amber-500 flex items-center justify-center shadow-lg shadow-violet-500/30"
            >
              <ShieldCheck className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-2xl font-bold text-white mb-1">Admin Portal</h1>
            <p className="text-slate-400 text-sm">Restricted access — authorized personnel only</p>
          </div>

          {/* Security badge */}
          <div className="flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-xl px-4 py-2.5 mb-6">
            <ShieldCheck className="w-4 h-4 text-violet-400 flex-shrink-0" />
            <span className="text-xs text-violet-300">This login is for administrators only. Standard users should use the regular login.</span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Admin Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  id="admin-login-email"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: '' })); }}
                  className={`w-full rounded-2xl border bg-slate-700/50 px-4 py-3 pl-10 text-sm text-white outline-none transition placeholder:text-slate-500 focus:ring-4 ${
                    errors.email
                      ? 'border-red-400/60 focus:border-red-400 focus:ring-red-400/10'
                      : 'border-slate-600/50 focus:border-violet-500 focus:ring-violet-500/10'
                  }`}
                  placeholder="admin@luckyelectrical.com"
                  autoComplete="email"
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1 ml-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  id="admin-login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrors(prev => ({ ...prev, password: '' })); }}
                  className={`w-full rounded-2xl border bg-slate-700/50 px-4 py-3 pl-10 pr-10 text-sm text-white outline-none transition placeholder:text-slate-500 focus:ring-4 ${
                    errors.password
                      ? 'border-red-400/60 focus:border-red-400 focus:ring-red-400/10'
                      : 'border-slate-600/50 focus:border-violet-500 focus:ring-violet-500/10'
                  }`}
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1 ml-1">{errors.password}</p>}
            </div>

            {/* Form error */}
            {errors.form && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-2.5"
              >
                {errors.form}
              </motion.div>
            )}

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              id="admin-login-submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-violet-500 via-purple-500 to-amber-500 text-white font-semibold text-sm shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/35 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  Access Admin Panel
                </>
              )}
            </motion.button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-500 mt-6">
          © {new Date().getFullYear()} Lucky Electrical — Admin Portal
        </p>
      </motion.div>
    </div>
  );
}
