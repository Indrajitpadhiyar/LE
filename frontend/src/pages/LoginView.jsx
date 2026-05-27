import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Loader2, Zap, ShieldCheck, User, ArrowLeft, CheckCircle2 } from 'lucide-react';
// import electricBg from '../assets/electric_login_bg.png';

export default function LoginView() {
  const { login, signup, googleLogin } = useAuth();
  const { activeView, navigateTo, addToast, handlePostLoginRedirect } = useShop();

  const isLogin = activeView === 'login';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Password strength calculation
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { level: 0, label: '', color: '' };
    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 1) return { level: 1, label: 'Weak', color: 'bg-red-400' };
    if (score <= 2) return { level: 2, label: 'Fair', color: 'bg-amber-400' };
    if (score <= 3) return { level: 3, label: 'Good', color: 'bg-cyan-400' };
    return { level: 4, label: 'Strong', color: 'bg-emerald-400' };
  };

  const strength = getPasswordStrength(password);

  const validateLogin = () => {
    const newErrors = {};
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Enter a valid email';
    if (!password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSignup = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Full name is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Enter a valid email';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Minimum 6 characters';
    if (!confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!validateLogin()) return;

    setIsLoading(true);
    try {
      await login(email, password);
      addToast('Welcome back! Login successful 🎉', 'success');
      handlePostLoginRedirect();
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please try again.';
      addToast(msg, 'error');
      setErrors({ form: msg });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (!validateSignup()) return;

    setIsLoading(true);
    try {
      await signup(name, email, password);
      addToast('Account created successfully! Welcome aboard 🎉', 'success');
      handlePostLoginRedirect();
    } catch (err) {
      const msg = err.response?.data?.message || 'Signup failed. Please try again.';
      addToast(msg, 'error');
      setErrors({ form: msg });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (view) => {
    setEmail('');
    setPassword('');
    setName('');
    setConfirmPassword('');
    setErrors({});
    navigateTo(view);
  };

  // Handle Google Login Credential Response
  const handleCredentialResponse = async (response) => {
    setIsLoading(true);
    try {
      await googleLogin(response.credential);
      addToast('Welcome back! Logged in with Google successfully 🎉', 'success');
      handlePostLoginRedirect();
    } catch (err) {
      const msg = err.response?.data?.message || 'Google Login failed. Please try again.';
      addToast(msg, 'error');
      setErrors({ form: msg });
    } finally {
      setIsLoading(false);
    }
  };

  // Dynamically load Google GIS script and initialize
  useEffect(() => {
    const initializeGoogle = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
        });

        const btnEl = document.getElementById("google-signin-btn");
        if (btnEl) {
          window.google.accounts.id.renderButton(
            btnEl,
            { 
              theme: "outline", 
              size: "large", 
              width: "380", 
              shape: "rectangular", 
              text: "continue_with" 
            }
          );
        }
        
        // Trigger one tap prompt as a premium feature!
        window.google.accounts.id.prompt();
      }
    };

    // Load GIS script if not present
    if (!document.getElementById("google-gis-script")) {
      const script = document.createElement("script");
      script.id = "google-gis-script";
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogle;
      document.head.appendChild(script);
    } else {
      // Small timeout to ensure the DOM element #google-signin-btn has rendered
      const timer = setTimeout(initializeGoogle, 100);
      return () => clearTimeout(timer);
    }
  }, [isLogin]);

  return (
    <div className="min-h-screen flex bg-slate-50 overflow-hidden font-sans">
      {/* Left Side: Animated Brand & Image Column */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-950 overflow-hidden items-center justify-center">
        {/* Animated Background Image with Ken Burns Effect */}
        <motion.img
          src="/image.png"
          alt="Electrical theme glowing light bulb background"
          className="absolute inset-0 w-full h-full object-cover "
          initial={{ scale: 1.15, rotate: 0 }}
          animate={{ scale: 1.02, rotate: 0.5 }}
          transition={{ duration: 25, ease: 'easeOut', repeat: Infinity, repeatType: 'reverse' }}
        />

        {/* Ambient radial glows */}
        {/* <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900/80 to-cyan-950/70" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: '4s' }} /> */}

        {/* Brand Text & Feature Cards */}
        <div className="relative z-10 w-full max-w-lg px-8 text-white">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, type: 'spring' }}
            className="w-16 h-16 mb-8 rounded-2xl bg-gradient-to-br from-cyan-400 to-indigo-600 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.35)]"
          >
            <Zap className="w-8 h-8 text-white animate-pulse" />
          </motion.div>

          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl font-extrabold tracking-tight mb-4 leading-tight"
          >
            Lucky <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-amber-300 bg-clip-text text-transparent">Electrical</span>
          </motion.h2>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-slate-300 text-lg mb-8 font-medium leading-relaxed"
          >
            Powering your smart devices, industrial automation, and modern home electronics with premium electrical components.
          </motion.p>

          <div className="space-y-4">
            {[
              { title: 'Smart Home Control', desc: 'Manage your lighting, sockets, and breakers from anywhere.' },
              { title: 'Industrial Grade Hardware', desc: 'Heavy-duty products designed for extreme stability.' },
              { title: 'Eco-friendly Energy', desc: 'Optimize your power usage with our smart energy monitors.' }
            ].map((feat, index) => (
              <motion.div
                key={index}
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.15 }}
                className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300"
              >
                <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 mt-0.5">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-white text-sm">{feat.title}</h4>
                  <p className="text-xs text-transparent bg-clip-text bg-gradient-to-r from-white  to-indigo-700 mt-0.5 leading-relaxed">{feat.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side: Form Column */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-16 relative overflow-y-auto max-h-screen">
        {/* Ambient radial glows on right side for premium backdrop */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-cyan-100/30 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-50/50 rounded-full blur-3xl -z-10" />

        <div className="w-full max-w-md mx-auto">
          {/* Back home button */}
          <button
            onClick={() => navigateTo('home')}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-cyan-600 transition-colors mb-8 group cursor-pointer border-none bg-transparent"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Shop
          </button>

          {/* Brand header for Mobile */}
          <div className="lg:hidden flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-500 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-xl text-slate-900">Lucky Electrical</span>
          </div>

          {/* Card style container */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-100 relative overflow-hidden">
            {/* Top gradient strip */}
            <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${isLogin ? 'from-cyan-500 to-indigo-500' : 'from-emerald-400 to-cyan-500'} transition-all duration-500`} />

            {/* Tab switcher */}
            <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-8 relative">
              <div className="relative w-full flex">
                <button
                  type="button"
                  onClick={() => handleTabChange('login')}
                  className={`relative z-10 w-1/2 py-2.5 text-sm font-semibold rounded-xl transition-colors duration-300 cursor-pointer ${isLogin ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {isLogin && (
                    <motion.div
                      layoutId="activeTabPill"
                      className="absolute inset-0 bg-white rounded-xl shadow-md"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-20">Sign In</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleTabChange('signup')}
                  className={`relative z-10 w-1/2 py-2.5 text-sm font-semibold rounded-xl transition-colors duration-300 cursor-pointer ${!isLogin ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {!isLogin && (
                    <motion.div
                      layoutId="activeTabPill"
                      className="absolute inset-0 bg-white rounded-xl shadow-md"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-20">Register</span>
                </button>
              </div>
            </div>

            {/* Forms Switcher using AnimatePresence */}
            <AnimatePresence mode="wait">
              {isLogin ? (
                <motion.div
                  key="login-form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <form onSubmit={handleLoginSubmit} className="space-y-5">
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-bold text-slate-800">Welcome Back</h3>
                      <p className="text-slate-500 text-xs mt-1">Sign in to standard user account to make purchases</p>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          id="login-email"
                          type="email"
                          value={email}
                          onChange={(e) => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: '' })); }}
                          className={`premium-input ${errors.email ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10' : ''}`}
                          style={{ paddingLeft: '2.75rem' }}
                          placeholder="name@example.com"
                          autoComplete="email"
                        />
                      </div>
                      {errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email}</p>}
                    </div>

                    {/* Password */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          id="login-password"
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => { setPassword(e.target.value); setErrors(prev => ({ ...prev, password: '' })); }}
                          className={`premium-input ${errors.password ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10' : ''}`}
                          style={{ paddingLeft: '2.75rem', paddingRight: '2.75rem' }}
                          placeholder="••••••••"
                          autoComplete="current-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors border-none bg-transparent cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {errors.password && <p className="text-red-500 text-xs mt-1 ml-1">{errors.password}</p>}
                    </div>

                    {/* Form error */}
                    {errors.form && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-2.5"
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
                      id="login-submit"
                      className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/30 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        'Sign In'
                      )}
                    </motion.button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="signup-form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <form onSubmit={handleSignupSubmit} className="space-y-4">
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-bold text-slate-800">Create Account</h3>
                      <p className="text-slate-500 text-xs mt-1">Get access to custom tracking, orders, and premium items</p>
                    </div>

                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          id="signup-name"
                          type="text"
                          value={name}
                          onChange={(e) => { setName(e.target.value); setErrors(prev => ({ ...prev, name: '' })); }}
                          className={`premium-input ${errors.name ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10' : ''}`}
                          style={{ paddingLeft: '2.75rem' }}
                          placeholder="John Doe"
                          autoComplete="name"
                        />
                      </div>
                      {errors.name && <p className="text-red-500 text-xs mt-1 ml-1">{errors.name}</p>}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          id="signup-email"
                          type="email"
                          value={email}
                          onChange={(e) => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: '' })); }}
                          className={`premium-input ${errors.email ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10' : ''}`}
                          style={{ paddingLeft: '2.75rem' }}
                          placeholder="name@example.com"
                          autoComplete="email"
                        />
                      </div>
                      {errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email}</p>}
                    </div>

                    {/* Password */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          id="signup-password"
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => { setPassword(e.target.value); setErrors(prev => ({ ...prev, password: '' })); }}
                          className={`premium-input ${errors.password ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10' : ''}`}
                          style={{ paddingLeft: '2.75rem', paddingRight: '2.75rem' }}
                          placeholder="Min. 6 characters"
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors border-none bg-transparent cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {errors.password && <p className="text-red-500 text-xs mt-1 ml-1">{errors.password}</p>}
                      {/* Password strength bar */}
                      {password && (
                        <div className="mt-2">
                          <div className="flex gap-1">
                            {[1, 2, 3, 4].map((i) => (
                              <div
                                key={i}
                                className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength.level ? strength.color : 'bg-slate-100'
                                  }`}
                              />
                            ))}
                          </div>
                          <p className={`text-xs mt-1 font-medium ${strength.level <= 1 ? 'text-red-500' :
                              strength.level <= 2 ? 'text-amber-500' :
                                strength.level <= 3 ? 'text-cyan-600' : 'text-emerald-600'
                            }`}>
                            {strength.label}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">Confirm Password</label>
                      <div className="relative">
                        <CheckCircle2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          id="signup-confirm-password"
                          type={showPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => { setConfirmPassword(e.target.value); setErrors(prev => ({ ...prev, confirmPassword: '' })); }}
                          className={`premium-input ${errors.confirmPassword ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10' : ''}`}
                          style={{ paddingLeft: '2.75rem', paddingRight: '2.75rem' }}
                          placeholder="Re-enter password"
                          autoComplete="new-password"
                        />
                        {confirmPassword && password === confirmPassword && (
                          <CheckCircle2 className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                        )}
                      </div>
                      {errors.confirmPassword && <p className="text-red-500 text-xs mt-1 ml-1">{errors.confirmPassword}</p>}
                    </div>

                    {/* Form error */}
                    {errors.form && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-2.5"
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
                      id="signup-submit"
                      className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-400 via-cyan-500 to-sky-500 text-white font-semibold text-sm shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/30 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer mt-2"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        'Create Account'
                      )}
                    </motion.button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-slate-100" />
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Or continue with</span>
              <div className="flex-1 h-px bg-slate-100" />
            </div>

            {/* Google Login Button */}
            {/* Native Google Sign-In Button Container */}
            <div className="flex justify-center w-full min-h-[44px]">
              <div id="google-signin-btn" className="w-full flex justify-center" />
            </div>

            {/* Admin access trigger */}
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => navigateTo('admin-login')}
                className="text-xs text-slate-400 hover:text-cyan-600 transition-colors font-semibold flex items-center justify-center gap-1 mx-auto border-none bg-transparent cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Admin Portal Access
              </button>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-slate-400 mt-8">
            © {new Date().getFullYear()} Lucky Electrical — All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
