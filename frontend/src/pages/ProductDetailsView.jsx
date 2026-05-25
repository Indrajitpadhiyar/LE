import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, Star, Heart, ShoppingBag, 
  ShieldCheck, Wrench
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { products } from '../data/products';


export default function ProductDetailsView() {
  const { 
    activeProductId, navigateTo, addToCart, 
    toggleFavorite, favorites 
  } = useShop();

  const product = products.find(p => p.id === activeProductId) || products[0];

  // Interactive configurations state
  const [quantity, setQuantity] = useState(1);
  const [selectedProtocol, setSelectedProtocol] = useState(
    product.specs.protocol ? product.specs.protocol.split(',')[0].trim() : 'Standard'
  );
  const [selectedFinish, setSelectedFinish] = useState(
    product.specs.finish ? product.specs.finish.split(',')[0].trim() : 'Default'
  );
  
  // Tabbed system state
  const [activeTab, setActiveTab] = useState('specs'); // 'specs', 'reviews', 'shipping'

  const isFavorited = favorites.includes(product.id);

  const handleAddToCart = () => {
    const specs = {
      Protocol: selectedProtocol,
    };
    if (product.specs.finish) {
      specs.Finish = selectedFinish;
    }
    addToCart(product, quantity, specs);
  };

  const getRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="h-4.5 w-4.5 fill-amber-400 text-amber-400" />);
      } else {
        stars.push(<Star key={i} className="h-4.5 w-4.5 text-slate-300" />);
      }
    }
    return stars;
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8 space-y-12">
      
      {/* 1. BREADCRUMBS & BACK BUTTON */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigateTo('shop')}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:text-slate-950"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Catalog
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 font-semibold">
          <span className="cursor-pointer hover:text-cyan-500" onClick={() => navigateTo('home')}>Lucky Electrical</span>
          <span>/</span>
          <span className="cursor-pointer hover:text-cyan-500" onClick={() => navigateTo('shop')}>{product.category}</span>
          <span>/</span>
          <span className="text-slate-600">{product.name}</span>
        </div>
      </div>

      {/* 2. DUAL-GRID MEDIA & SPECS SELECTOR */}
      <div className="grid gap-12 lg:grid-cols-2">
        
        {/* Media Block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative aspect-[4/3] w-full overflow-hidden rounded-[2.5rem] border border-slate-200 bg-slate-100 shadow-xl"
        >
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover"
          />
          {product.badge && (
            <span className="absolute left-6 top-6 rounded-full bg-cyan-600 px-4 py-1.5 text-xs font-black uppercase tracking-[0.15em] text-white shadow-lg">
              {product.badge}
            </span>
          )}
        </motion.div>

        {/* Specifications & CTA Block */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6 flex flex-col justify-between"
        >
          <div className="space-y-4">
            <span className="inline-flex rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-600">
              {product.category}
            </span>
            
            <h1 className="text-3xl font-black text-slate-900 tracking-tight sm:text-4xl">
              {product.name}
            </h1>

            {/* Ratings Summary */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {getRatingStars(product.rating)}
              </div>
              <span className="text-sm font-bold text-slate-800">{product.rating} / 5.0</span>
              <span className="text-xs text-slate-400">({product.reviewsCount} verified purchases)</span>
            </div>

            <p className="text-2xl font-black text-slate-900">
              ${product.price.toFixed(2)}
            </p>

            <p className="text-sm leading-6 text-slate-500">
              {product.longDescription}
            </p>

            {/* Config Selectors */}
            <div className="grid gap-4 sm:grid-cols-2 pt-4">
              {product.specs.protocol && (
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Smart Protocol</label>
                  <div className="flex flex-wrap gap-2">
                    {product.specs.protocol.split(',').map((p) => {
                      const prot = p.trim();
                      const isSelected = selectedProtocol === prot;
                      return (
                        <button
                          key={prot}
                          onClick={() => setSelectedProtocol(prot)}
                          className={`rounded-xl border px-3 py-2 text-xs font-bold transition duration-200 ${
                            isSelected 
                              ? 'border-cyan-500 bg-cyan-500/10 text-cyan-600' 
                              : 'border-slate-200 text-slate-500 hover:border-slate-400'
                          }`}
                        >
                          {prot}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {product.specs.finish && (
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Material Finish</label>
                  <div className="flex flex-wrap gap-2">
                    {product.specs.finish.split(',').map((f) => {
                      const fin = f.trim();
                      const isSelected = selectedFinish === fin;
                      return (
                        <button
                          key={fin}
                          onClick={() => setSelectedFinish(fin)}
                          className={`rounded-xl border px-3 py-2 text-xs font-bold transition duration-200 ${
                            isSelected 
                              ? 'border-cyan-500 bg-cyan-500/10 text-cyan-600' 
                              : 'border-slate-200 text-slate-500 hover:border-slate-400'
                          }`}
                        >
                          {fin}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="border-t border-slate-100 pt-6 space-y-4">
            <div className="flex items-center gap-4">
              
              {/* Spinner Counter */}
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">
                <button
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="rounded-xl px-3 py-1.5 hover:bg-slate-100 font-bold"
                >
                  -
                </button>
                <span className="w-8 text-center text-sm font-extrabold">{quantity}</span>
                <button
                  onClick={() => setQuantity(prev => prev + 1)}
                  className="rounded-xl px-3 py-1.5 hover:bg-slate-100 font-bold"
                >
                  +
                </button>
              </div>

              {/* Add to Cart CTA */}
              <button
                onClick={handleAddToCart}
                className="flex flex-grow items-center justify-center gap-2 rounded-2xl bg-cyan-600 py-4 text-xs font-black tracking-wider uppercase text-white shadow-xl shadow-cyan-600/10 hover:shadow-cyan-600/25 transition hover:bg-cyan-500"
              >
                <ShoppingBag className="h-4.5 w-4.5" />
                Add configured system to Cart
              </button>

              {/* Favorites trigger */}
              <button
                onClick={() => toggleFavorite(product.id)}
                className={`grid h-12 w-12 place-items-center rounded-2xl border transition duration-200 shrink-0 ${
                  isFavorited
                    ? 'border-rose-500/30 bg-rose-500/10 text-rose-500'
                    : 'border-slate-200 bg-white text-slate-400 hover:text-rose-500 hover:border-rose-500/30'
                }`}
              >
                <Heart className={`h-5.5 w-5.5 ${isFavorited ? 'fill-rose-500' : ''}`} />
              </button>

            </div>

            {/* In Stock Assurance */}
            <div className="flex items-center gap-2 text-xs text-emerald-600 font-bold">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              Depot Stock Verified: {product.stock} Units Ready for Insulated Dispatch
            </div>
          </div>

        </motion.div>
      </div>

      {/* 3. INFORMATION TABS SYSTEM */}
      <div className="border-t border-slate-200/60 pt-10">
        
        {/* Tab Headers */}
        <div className="flex border-b border-slate-200 mb-8 overflow-x-auto text-sm font-bold text-slate-500">
          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-4 px-6 border-b-2 transition duration-200 ${
              activeTab === 'specs' 
                ? 'border-cyan-500 text-slate-900' 
                : 'border-transparent hover:text-slate-850'
            }`}
          >
            Technical Specifications
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-4 px-6 border-b-2 transition duration-200 ${
              activeTab === 'reviews' 
                ? 'border-cyan-500 text-slate-900' 
                : 'border-transparent hover:text-slate-850'
            }`}
          >
            Customer Reviews ({product.reviewsCount})
          </button>
          <button
            onClick={() => setActiveTab('shipping')}
            className={`pb-4 px-6 border-b-2 transition duration-200 ${
              activeTab === 'shipping' 
                ? 'border-cyan-500 text-slate-900' 
                : 'border-transparent hover:text-slate-850'
            }`}
          >
            Insulated Dispatch &amp; Support
          </button>
        </div>

        {/* Tab content render */}
        <div className="min-h-[200px]">
          <AnimatePresence mode="wait">
            
            {/* SPECS TAB */}
            {activeTab === 'specs' && (
              <motion.div
                key="specs"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-3xl"
              >
                <div className="overflow-hidden rounded-2xl border border-slate-200">
                  <table className="w-full text-left text-xs">
                    <tbody className="divide-y divide-slate-200">
                      {Object.entries(product.specs).map(([key, val]) => (
                        <tr key={key} className="bg-white/40">
                          <td className="px-5 py-4 font-black uppercase text-slate-400 w-1/3">{key}</td>
                          <td className="px-5 py-4 font-bold text-slate-800">{val}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* REVIEWS TAB */}
            {activeTab === 'reviews' && (
              <motion.div
                key="reviews"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6 max-w-3xl"
              >
                {product.reviews.map((rev, idx) => (
                  <div 
                    key={idx} 
                    className="rounded-3xl border border-slate-100 bg-white/50 p-6 shadow-sm space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="grid h-10 w-10 place-items-center rounded-full bg-cyan-500/10 text-xs font-black text-cyan-600">
                          {rev.author.split(' ').map(n=>n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-sm font-extrabold text-slate-900">{rev.author}</p>
                          <p className="text-[10px] text-slate-400">{rev.date} • Verified Installer</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {getRatingStars(rev.rating)}
                      </div>
                    </div>
                    <p className="text-xs leading-5 text-slate-600 font-medium">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </motion.div>
            )}

            {/* SHIPPING TAB */}
            {activeTab === 'shipping' && (
              <motion.div
                key="shipping"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid gap-6 sm:grid-cols-2 max-w-4xl"
              >
                <div className="rounded-3xl border border-slate-200/60 bg-white/50 p-6 space-y-3">
                  <ShieldCheck className="h-8 w-8 text-cyan-500" />
                  <h4 className="text-base font-black text-slate-900">Insulated Storage Packing</h4>
                  <p className="text-xs text-slate-500 leading-5">
                    We package sensitive micro-controllers, touch capacitors, and hardware tools in customized static-isolated polymer casing, defending internal mechanisms from static spikes during transport.
                  </p>
                </div>
                
                <div className="rounded-3xl border border-slate-200/60 bg-white/50 p-6 space-y-3">
                  <Wrench className="h-8 w-8 text-cyan-500" />
                  <h4 className="text-base font-black text-slate-900">Instant Depot Pickup</h4>
                  <p className="text-xs text-slate-500 leading-5">
                    Live near our national hubs? Place your order online, choose local depot pick-up, and retrieve your components within 120 minutes from our express dispatch terminals.
                  </p>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

    </div>
  );
}
