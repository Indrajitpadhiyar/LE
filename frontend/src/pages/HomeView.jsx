import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Shield, Truck, Clock, Sparkles, ArrowRight
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';


export default function HomeView() {
  const { navigateTo, setSearchQuery, setSelectedCategory } = useShop();
  const [searchInput, setSearchInput] = useState('');
  
  // Deal of the day countdown state
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 23, minutes: 59, seconds: 59 }; // Reset
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchQuery(searchInput);
      setSelectedCategory('All');
      navigateTo('shop');
    }
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSearchQuery('');
    navigateTo('shop');
  };

  // Get first 3 products as featured
  const featuredProducts = products.slice(0, 3);

  // Constants for categories cards
  const categoryCards = [
    { name: 'Smart Home', desc: 'Touchplates & voice hubs', icon: '📱', color: 'from-cyan-500/10 to-blue-500/5 hover:border-cyan-500/40 text-cyan-400' },
    { name: 'Lighting', desc: 'Smart bulbs & accent bars', icon: '💡', color: 'from-amber-500/10 to-orange-500/5 hover:border-amber-500/40 text-amber-400' },
    { name: 'Power Solutions', desc: 'Surge strips & luxury sockets', icon: '🔌', color: 'from-purple-500/10 to-indigo-500/5 hover:border-purple-500/40 text-purple-400' },
    { name: 'Eco Energy', desc: 'High-efficiency solar panels', icon: '☀️', color: 'from-emerald-500/10 to-teal-500/5 hover:border-emerald-500/40 text-emerald-400' },
  ];

  return (
    <div className="space-y-20 pb-24">
      {/* 1. HERO SECTION WITH VIBRANT GLOWS */}
      <section className="relative px-6 pt-12 md:pt-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            
            {/* Hero Left Content */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.25em] text-cyan-600 shadow-sm border border-cyan-500/20">
                <Sparkles className="h-4 w-4 text-cyan-500 animate-spin" />
                Next-Gen Electrical Marketplace
              </span>

              <h1 className="text-4xl font-black leading-[1.1] tracking-tight text-slate-950 sm:text-6xl">
                Elevated hardware <br className="hidden sm:inline" />
                designed for <span className="text-gradient-cyan">modern luxury</span> homes.
              </h1>

              <p className="max-w-xl text-base leading-7 text-slate-500 sm:text-lg">
                Stop compromising on basic components. Discover luxury touch panels, highly-calibrated led bars, monocrystalline solar collectors, and insulated tooling with certified architectural performance.
              </p>

              {/* Hero Search Box */}
              <form 
                onSubmit={handleSearchSubmit}
                className="max-w-lg rounded-2xl border border-slate-200/80 bg-white p-2 shadow-xl shadow-slate-100"
              >
                <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-3">
                  <Search className="h-5 w-5 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search smart touchpads, LEDs, solar panels..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                  />
                  <button 
                    type="submit"
                    className="rounded-lg bg-cyan-600 px-5 py-2 text-xs font-bold text-white shadow-md shadow-cyan-600/10 hover:bg-cyan-500 hover:shadow-cyan-600/20"
                  >
                    Search
                  </button>
                </div>
              </form>

              {/* Trust Indicators */}
              <div className="flex flex-wrap gap-6 pt-4 text-xs font-bold text-slate-500">
                <div className="flex items-center gap-2">
                  <Shield className="h-4.5 w-4.5 text-cyan-500" />
                  100% Insulated Integrity
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="h-4.5 w-4.5 text-cyan-500" />
                  Free Express Delivery &gt; $100
                </div>
              </div>
            </motion.div>

            {/* Hero Right Card (Deal of the Day) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="relative rounded-[2.5rem] border border-slate-200 bg-white p-7 shadow-2xl shadow-slate-100"
            >
              {/* Radial glow background inside card */}
              <div className="absolute right-0 top-0 -z-10 h-32 w-32 rounded-full bg-cyan-500/10 blur-[50px]" />

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3.5 py-1 text-[10px] font-black uppercase tracking-wider text-amber-600 border border-amber-500/20">
                    <Clock className="h-3.5 w-3.5 animate-pulse" />
                    Deal of the Day
                  </span>
                  <span className="text-xs font-black text-rose-500 bg-rose-500/10 px-2.5 py-0.5 rounded-lg animate-bounce">
                    40% OFF
                  </span>
                </div>

                <div className="rounded-2xl bg-slate-50/50 p-5 border">
                  <h3 className="text-2xl font-black text-slate-900">Nexus Smart Dial Hub</h3>
                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    Complete modern home comfort controller with custom LED touchscreen dial + dual climate temperature nodes.
                  </p>
                  
                  {/* Real Ticking Countdown Clock */}
                  <div className="mt-5 flex items-center gap-2">
                    <div className="flex flex-col items-center rounded-xl bg-slate-100 p-2.5 min-w-[55px]">
                      <span className="text-lg font-black text-cyan-500">
                        {String(timeLeft.hours).padStart(2, '0')}
                      </span>
                      <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400">Hrs</span>
                    </div>
                    <span className="text-slate-400 font-bold">:</span>
                    <div className="flex flex-col items-center rounded-xl bg-slate-100 p-2.5 min-w-[55px]">
                      <span className="text-lg font-black text-cyan-500">
                        {String(timeLeft.minutes).padStart(2, '0')}
                      </span>
                      <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400">Min</span>
                    </div>
                    <span className="text-slate-400 font-bold">:</span>
                    <div className="flex flex-col items-center rounded-xl bg-slate-100 p-2.5 min-w-[55px]">
                      <span className="text-lg font-black text-cyan-500">
                        {String(timeLeft.seconds).padStart(2, '0')}
                      </span>
                      <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400">Sec</span>
                    </div>
                  </div>
                </div>

                {/* Sub-cards */}
                <div className="grid gap-3.5 grid-cols-2 text-[11px] text-slate-500">
                  <div className="rounded-xl border border-slate-100 bg-white p-3.5 shadow-sm">
                    <p className="font-bold text-slate-800">Depot Pickup</p>
                    <p className="mt-0.5">Collect in 2 hours</p>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-white p-3.5 shadow-sm">
                    <p className="font-bold text-slate-800">Lifetime Warranty</p>
                    <p className="mt-0.5">Solid structural peace</p>
                  </div>
                </div>

                {/* Claim Deal CTA */}
                <button
                  onClick={() => handleCategoryClick('Smart Home')}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-600 py-3.5 text-xs font-extrabold tracking-wider uppercase text-white shadow-lg shadow-cyan-600/10 transition hover:bg-cyan-500"
                >
                  Configure My Hub
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 2. DYNAMIC CATEGORIES GRID */}
      <section className="px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center md:text-left">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-600 mb-2">Architectural Categories</p>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Browse custom curated systems.</h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categoryCards.map((cat, idx) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                whileHover={{ scale: 1.03, y: -4 }}
                onClick={() => handleCategoryClick(cat.name)}
                className={`group cursor-pointer rounded-3xl border border-slate-200 bg-gradient-to-br p-6 shadow-sm transition-all duration-300 ${cat.color}`}
              >
                <div className="mb-6 text-4xl">{cat.icon}</div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-1.5 group-hover:text-cyan-500">
                  {cat.name}
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:translate-x-1" />
                </h3>
                <p className="mt-1.5 text-xs text-slate-500">{cat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURED COLLECTIONS GRID */}
      <section className="px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          
          <div className="mb-10 rounded-[2.5rem] border border-slate-200/80 bg-white/95 px-8 py-10 shadow-2xl shadow-slate-100/60 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-2xl">
              <span className="mb-3 inline-flex rounded-full bg-cyan-500/10 px-3.5 py-1 text-[10px] font-black uppercase tracking-[0.25em] text-cyan-600">
                Trending items
              </span>
              <h2 className="text-3xl font-black text-slate-950 sm:text-4xl tracking-tight">
                Top rated components this week.
              </h2>
              <p className="mt-2 text-xs leading-5 text-slate-500">
                Carefully tested for safety, thermal efficiency, and haptic precision. Instantly integrate with your custom build layout.
              </p>
            </div>
            
            <button
              onClick={() => { setSelectedCategory('All'); navigateTo('shop'); }}
              className="shrink-0 flex items-center justify-center gap-2 rounded-2xl bg-cyan-600 px-6 py-3.5 text-xs font-bold text-white shadow-lg shadow-cyan-600/10 hover:bg-cyan-500"
            >
              Explore Entire Catalog
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Featured Cards list */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.map((product, index) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                index={index} 
              />
            ))}
          </div>

        </div>
      </section>

      {/* 4. VALUE PROPOSITION STAT CARDS */}
      <section className="border-y border-slate-200 bg-slate-100/40 py-16 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-3">
            
            <div className="rounded-3xl border border-slate-200/60 bg-white p-7 shadow-sm">
              <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-500">
                <Shield className="h-5 w-5" />
              </span>
              <h3 className="text-lg font-black text-slate-950">Certified Thermal Ratings</h3>
              <p className="mt-2 text-xs leading-5 text-slate-500">
                Every switchplate, surge strip, and smart dimming mechanism passes extreme structural testing to verify zero thermal leakage.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200/60 bg-white p-7 shadow-sm">
              <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-500">
                <Truck className="h-5 w-5" />
              </span>
              <h3 className="text-lg font-black text-slate-950">Pre-Packaged Insulation</h3>
              <p className="mt-2 text-xs leading-5 text-slate-500">
                Orders are hand-insulated in anti-static protective cases and dispatched within 12 hours from our state-of-the-art national depot network.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200/60 bg-white p-7 shadow-sm">
              <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-500">
                <Clock className="h-5 w-5" />
              </span>
              <h3 className="text-lg font-black text-slate-950">Expert Compatibility Audits</h3>
              <p className="mt-2 text-xs leading-5 text-slate-500">
                Not sure if a Zigbee switch works with your neutral wiring layout? Ask our electrical engineers directly via phone or email.
              </p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
