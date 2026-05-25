import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, Heart, X, 
  Trash2, Plus, Minus, CreditCard, ChevronRight,
  Sparkles, ShieldCheck, Mail, ArrowUpRight
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function Layout({ children }) {
  const { 
    activeView, navigateTo,
    cart, removeFromCart, updateCartQty,
    favorites, promoCode, promoDiscount, applyPromo, removePromo,
    cartSubtotal, cartDiscountAmount, cartTax, cartShipping, cartTotal
  } = useShop();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [promoInput, setPromoInput] = useState('');

  const handlePromoSubmit = (e) => {
    e.preventDefault();
    if (promoInput.trim()) {
      applyPromo(promoInput);
      setPromoInput('');
    }
  };

  const cartTotalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="relative min-h-screen bg-white text-slate-950">
      {/* Visual background glows */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[500px] bg-gradient-to-b from-cyan-500/10 via-transparent to-transparent" />
      <div className="pointer-events-none absolute top-[400px] left-1/4 -z-10 h-72 w-72 rounded-full bg-indigo-500/5 blur-[120px]" />

      {/* STICKY GLASSMORPHIC NAVBAR */}
      <header className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          
          {/* Logo Brand */}
          <div 
            onClick={() => navigateTo('home')}
            className="flex cursor-pointer items-center gap-3"
          >
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-tr from-cyan-500 to-sky-600 text-white shadow-lg shadow-cyan-500/20">
              <span className="text-xl font-bold">
                <img src="/logo.png" alt="" />
              </span>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-cyan-600">Lucky</p>
              <p className="text-lg font-black text-slate-900 leading-tight">Electrical</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden items-center gap-8 text-sm font-semibold text-slate-600 md:flex">
            <button 
              onClick={() => navigateTo('home')} 
              className={`relative py-1 transition-colors hover:text-slate-950 ${activeView === 'home' ? 'text-cyan-500' : ''}`}
            >
              Home
              {activeView === 'home' && <motion.span layoutId="navIndicator" className="absolute bottom-0 left-0 h-[2px] w-full bg-cyan-500" />}
            </button>
            <button 
              onClick={() => navigateTo('shop')} 
              className={`relative py-1 transition-colors hover:text-slate-950 ${activeView === 'shop' ? 'text-cyan-500' : ''}`}
            >
              Shop Catalog
              {activeView === 'shop' && <motion.span layoutId="navIndicator" className="absolute bottom-0 left-0 h-[2px] w-full bg-cyan-500" />}
            </button>
            <button 
              onClick={() => navigateTo('shop')} 
              className="relative py-1 transition-colors hover:text-slate-950"
            >
              Smart Solutions
            </button>
          </nav>

          {/* Right Action Icons Bar */}
          <div className="flex items-center gap-3">

            {/* Wishlist Icon */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => navigateTo('shop')}
              className="relative rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 hover:text-rose-500 shadow-sm"
            >
              <Heart className="h-4 w-4" />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white">
                  {favorites.length}
                </span>
              )}
            </motion.button>

            {/* Cart Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-cyan-600/10 hover:bg-cyan-500"
            >
              <ShoppingBag className="h-4 w-4" />
              <span className="hidden sm:inline">Cart</span>
              <span className="rounded-lg bg-white/20 px-1.5 py-0.5 text-xs">
                {cartTotalItems}
              </span>
            </motion.button>

            {/* Mobile Menu Burger Toggle */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="rounded-xl border border-slate-200/80 p-2.5 md:hidden"
            >
              <span className="block h-0.5 w-5 bg-current transition-transform duration-300" style={{ transform: isMobileMenuOpen ? 'rotate(45deg) translateY(4px)' : 'none' }} />
              <span className="my-1 block h-0.5 w-5 bg-current transition-opacity duration-300" style={{ opacity: isMobileMenuOpen ? 0 : 1 }} />
              <span className="block h-0.5 w-5 bg-current transition-transform duration-300" style={{ transform: isMobileMenuOpen ? 'rotate(-45deg) translateY(-4px)' : 'none' }} />
            </button>
          </div>
        </div>

        {/* MOBILE MENU PANEL */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-slate-200 bg-white/95 px-6 py-4 md:hidden"
            >
              <nav className="flex flex-col gap-4 py-2 text-sm font-semibold">
                <button 
                  onClick={() => { navigateTo('home'); setIsMobileMenuOpen(false); }}
                  className={`text-left hover:text-cyan-500 ${activeView === 'home' ? 'text-cyan-500' : ''}`}
                >
                  Home
                </button>
                <button 
                  onClick={() => { navigateTo('shop'); setIsMobileMenuOpen(false); }}
                  className={`text-left hover:text-cyan-500 ${activeView === 'shop' ? 'text-cyan-500' : ''}`}
                >
                  Shop Catalog
                </button>
                <button 
                  onClick={() => { navigateTo('shop'); setIsMobileMenuOpen(false); }}
                  className="text-left hover:text-cyan-500"
                >
                  Smart Systems
                </button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* CORE VIEW INJECTOR */}
      <main className="relative flex-grow min-h-[75vh]">
        {children}
      </main>

      {/* SLIDE-OUT CART SIDEBAR */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            {/* Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            />

            {/* Sidebar Shell */}
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 z-50 flex flex-col justify-between w-full max-w-md bg-white shadow-2xl border-l"
            >
              {/* Sidebar Header */}
              <div className="flex items-center justify-between border-b border-slate-100 p-5">
                <div className="flex items-center gap-2.5">
                  <ShoppingBag className="h-5 w-5 text-cyan-500" />
                  <h2 className="text-lg font-bold text-slate-900">Your Cart</h2>
                  <span className="rounded-full bg-cyan-500/10 px-2 py-0.5 text-xs font-bold text-cyan-600">
                    {cartTotalItems} items
                  </span>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="rounded-lg p-1.5 hover:bg-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Sidebar Body (Item List) */}
              <div className="flex-grow overflow-y-auto p-5 space-y-4">
                {cart.length === 0 ? (
                  <div className="flex h-64 flex-col items-center justify-center text-center">
                    <div className="mb-4 rounded-full bg-slate-100 p-5 text-slate-400">
                      <ShoppingBag className="h-10 w-10 animate-bounce" />
                    </div>
                    <p className="font-bold text-slate-700">Your cart is empty</p>
                    <p className="mt-1.5 text-xs text-slate-500 max-w-[220px]">
                      Explore our premium hardware catalog and add item to start shopping.
                    </p>
                    <button
                      onClick={() => { setIsCartOpen(false); navigateTo('shop'); }}
                      className="mt-5 rounded-xl bg-cyan-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-cyan-500"
                    >
                      Browse Catalog
                    </button>
                  </div>
                ) : (
                  cart.map((item, index) => (
                    <motion.div
                      key={`${item.product.id}-${index}`}
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-4 rounded-2xl border border-slate-100 p-3.5 bg-slate-50/50"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="h-16 w-16 rounded-xl object-cover"
                      />
                      <div className="flex flex-grow flex-col justify-between">
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 line-clamp-1">
                            {item.product.name}
                          </h4>
                          <p className="text-[10px] font-semibold text-slate-500">
                            {item.product.category}
                          </p>
                        </div>

                        <div className="mt-2 flex items-center justify-between">
                          {/* Quantity adjustments */}
                          <div className="flex items-center gap-1.5 rounded-lg border border-slate-200/80 bg-white/90 p-1">
                            <button
                              onClick={() => updateCartQty(index, item.quantity - 1)}
                              className="rounded p-0.5 hover:bg-slate-100"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-5 text-center text-xs font-bold">{item.quantity}</span>
                            <button
                              onClick={() => updateCartQty(index, item.quantity + 1)}
                              className="rounded p-0.5 hover:bg-slate-100"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-900">
                              ${(item.product.price * item.quantity).toFixed(2)}
                            </span>
                            <button
                              onClick={() => removeFromCart(index)}
                              className="rounded-lg p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Sidebar Footer (Calculations & Promo) */}
              {cart.length > 0 && (
                <div className="border-t border-slate-100 bg-slate-50/50 p-5">
                  
                  {/* Coupon Area */}
                  {promoCode ? (
                    <div className="mb-4 flex items-center justify-between rounded-xl bg-cyan-500/10 border border-cyan-500/20 px-3 py-2 text-xs">
                      <div className="flex items-center gap-1.5 text-cyan-600 font-semibold">
                        <Sparkles className="h-3.5 w-3.5" />
                        Code Applied: {promoCode} ({promoDiscount}% OFF)
                      </div>
                      <button 
                        onClick={removePromo}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handlePromoSubmit} className="mb-4 flex gap-2">
                      <input
                        type="text"
                        placeholder="Promo code (e.g. WELCOME10)"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                        className="flex-grow rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-none"
                      />
                      <button
                        type="submit"
                        className="rounded-xl bg-cyan-600 px-4 text-xs font-bold text-white hover:bg-cyan-500"
                      >
                        Apply
                      </button>
                    </form>
                  )}

                  {/* Pricing Telemetry */}
                  <div className="space-y-1.5 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-semibold text-slate-900">${cartSubtotal.toFixed(2)}</span>
                    </div>
                    {promoDiscount > 0 && (
                      <div className="flex justify-between text-cyan-600">
                        <span>Discount ({promoDiscount}%)</span>
                        <span>-${cartDiscountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Estimated Tax (8%)</span>
                      <span className="font-semibold text-slate-900">${cartTax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span className="font-semibold text-slate-900">
                        {cartShipping === 0 ? 'FREE' : `$${cartShipping.toFixed(2)}`}
                      </span>
                    </div>
                    
                    {cartShipping > 0 && (
                      <p className="text-[10px] text-cyan-600 text-right">
                        Add ${(100 - cartSubtotal).toFixed(2)} more for Free Shipping
                      </p>
                    )}
                  </div>

                  <div className="my-3.5 border-t border-slate-200" />

                  <div className="mb-4 flex items-center justify-between">
                    <span className="font-bold text-slate-900">Order Total</span>
                    <span className="text-xl font-black text-slate-900">
                      ${cartTotal.toFixed(2)}
                    </span>
                  </div>

                  {/* Checkout CTA */}
                  <button
                    onClick={() => { setIsCartOpen(false); navigateTo('checkout'); }}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-600 py-3.5 text-sm font-bold text-white shadow-xl shadow-cyan-600/10 hover:shadow-cyan-600/25 transition hover:bg-cyan-500"
                  >
                    <CreditCard className="h-4.5 w-4.5" />
                    Proceed to Checkout
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* PREMIUM NEWSLETTER AND FOOTER */}
      <section className="relative border-t border-slate-200/60 bg-white/50 px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-cyan-600">
                <ShieldCheck className="h-4 w-4" />
                Guaranteed Compatibility Checked
              </div>
              <h2 className="text-3xl font-black text-slate-950 tracking-tight sm:text-4xl">
                Power your architectural projects with hardware confidence.
              </h2>
              <p className="max-w-xl text-sm leading-6 text-slate-500">
                Connect directly with our engineering department for rapid digital bill-of-materials quotes, device-compatibility audits, and local project distribution.
              </p>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Expert Hotline</p>
                  <p className="mt-1 text-sm font-bold text-slate-800">+1 (800) 555-1200</p>
                </div>
                <div className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Secure Dispatch Email</p>
                  <p className="mt-1 text-sm font-bold text-slate-800">support@luckyelectrical.shop</p>
                </div>
              </div>
            </div>

            {/* Newsletter Container */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-xl shadow-slate-100">
              <div className="flex items-center gap-2 text-cyan-600 mb-3">
                <Mail className="h-5 w-5" />
                <span className="text-xs font-bold uppercase tracking-widest">Newsletter Sign-up</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Get technical hardware alerts</h3>
              <p className="text-xs text-slate-500 mb-6 leading-5">
                Subscribe to receive immediate stock drops, smart firmware alerts, energy regulatory codes, and exclusive member-only promos.
              </p>
              
              <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed!'); }} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  required
                  placeholder="Enter professional email"
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs outline-none"
                />
                <button
                  type="submit"
                  className="shrink-0 flex items-center justify-center gap-1.5 rounded-xl bg-cyan-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-cyan-500"
                >
                  Join List
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-slate-100/50 py-10 px-6 text-center text-xs text-slate-500">
        <p className="mx-auto max-w-md leading-5">
          © 2026 Lucky Electrical Marketplace. Designed for high-reliability modern architectural installations. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
