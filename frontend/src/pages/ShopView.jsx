import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  SlidersHorizontal, Search, RotateCcw, Sparkles, X
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { products, categories } from '../data/products';
import ProductCard from '../components/ProductCard';


export default function ShopView() {
  const { 
    searchQuery, setSearchQuery,
    selectedCategory, setSelectedCategory,
    priceRange, setPriceRange
  } = useShop();

  const [sortBy, setSortBy] = useState('featured'); // 'featured', 'price-low', 'price-high', 'rating'
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // Reset all filters utility
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setPriceRange(200);
    setSortBy('featured');
  };

  // Filter products based on search, category, and price range
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesPrice = product.price <= priceRange;

    return matchesSearch && matchesCategory && matchesPrice;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') {
      return a.price - b.price;
    }
    if (sortBy === 'price-high') {
      return b.price - a.price;
    }
    if (sortBy === 'rating') {
      return b.rating - a.rating;
    }
    // Alphabetical / default
    return a.name.localeCompare(b.name);
  });

  // Helper count for category totals
  const getCategoryCount = (category) => {
    if (category === 'All') return products.length;
    return products.filter(p => p.category === category).count || products.filter(p => p.category === category).length;
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
      
      {/* 1. SHOP HEADER BAR */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-5 border-b border-slate-200/60 pb-8">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 px-3.5 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-cyan-600">
            <Sparkles className="h-3 w-3 text-cyan-500 animate-spin" />
            Hardware Catalog
          </span>
          <h1 className="mt-2.5 text-3xl font-black text-slate-900 sm:text-4xl tracking-tight">
            Architectural Equipment
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Showing {sortedProducts.length} premium systems matching your filter constraints.
          </p>
        </div>

        {/* Action controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setShowFiltersMobile(!showFiltersMobile)}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold md:hidden"
          >
            <SlidersHorizontal className="h-4 w-4 text-cyan-500" />
            Filters
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold">
            <span className="text-slate-400">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent font-extrabold text-slate-800 outline-none"
            >
              <option value="featured">Alphabetical</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Customer Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. CORE LAYOUT SPLIT */}
      <div className="grid gap-10 md:grid-cols-[250px_1fr] lg:grid-cols-[280px_1fr]">
        
        {/* SIDEBAR FILTER PANEL - DESKTOP */}
        <aside className="hidden md:block space-y-8 sticky top-24 self-start">
          
          {/* Active Search Field */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Keywords</h4>
            <div className="relative flex items-center rounded-2xl border border-slate-200/80 bg-white/50 px-3.5 py-2.5">
              <Search className="h-4.5 w-4.5 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Filter search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ml-2 w-full bg-transparent text-xs text-slate-900 outline-none placeholder:text-slate-400"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-900">
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Categories Filter Block */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">System Category</h4>
            <div className="flex flex-col gap-1">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-bold transition duration-200 ${
                      isActive 
                        ? 'bg-cyan-500/10 text-cyan-600 border border-cyan-500/10' 
                        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                    }`}
                  >
                    <span>{cat}</span>
                    <span className="rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">
                      {getCategoryCount(cat)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range Filter Slider */}
          <div className="space-y-3.5">
            <div className="flex justify-between items-center text-xs">
              <h4 className="font-black uppercase tracking-wider text-slate-400">Maximum Price</h4>
              <span className="font-bold text-cyan-600">${priceRange}</span>
            </div>
            <input
              type="range"
              min="10"
              max="200"
              step="5"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
            <div className="flex justify-between text-[9px] font-bold text-slate-400">
              <span>$10</span>
              <span>$200 max</span>
            </div>
          </div>

          {/* Reset Action */}
          <button
            onClick={handleResetFilters}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 py-3 text-xs font-bold text-slate-500 hover:border-cyan-500 hover:text-cyan-500 transition"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Clear Active Filters
          </button>
        </aside>

        {/* MOBILE FILTER SIDEBAR DRAWER */}
        <AnimatePresence>
          {showFiltersMobile && (
            <div className="fixed inset-0 z-50 md:hidden flex justify-end">
              {/* Back Blur */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowFiltersMobile(false)}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              />
              {/* Drawer Container */}
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                className="relative z-50 w-full max-w-xs bg-white h-full p-6 flex flex-col justify-between overflow-y-auto border-l"
              >
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="font-black text-slate-900">Active Filters</h3>
                    <button onClick={() => setShowFiltersMobile(false)}>
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  
                  {/* Keywords search */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Keywords</h4>
                    <div className="flex items-center rounded-xl border border-slate-200 p-2.5">
                      <Search className="h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="ml-2 w-full bg-transparent text-xs text-slate-900 outline-none"
                      />
                    </div>
                  </div>

                  {/* Categories */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Categories</h4>
                    <div className="flex flex-col gap-1.5">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => { setSelectedCategory(cat); setShowFiltersMobile(false); }}
                          className={`text-left text-xs font-bold py-1.5 px-2.5 rounded-lg ${
                            selectedCategory === cat ? 'bg-cyan-500/10 text-cyan-500' : 'text-slate-500'
                          }`}
                        >
                          {cat} ({getCategoryCount(cat)})
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                      <span>Max Price</span>
                      <span>${priceRange}</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="200"
                      value={priceRange}
                      onChange={(e) => setPriceRange(Number(e.target.value))}
                      className="w-full accent-cyan-500"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t space-y-3">
                  <button
                    onClick={() => { handleResetFilters(); setShowFiltersMobile(false); }}
                    className="w-full text-center text-xs font-bold py-3 text-slate-500 bg-slate-100 rounded-xl"
                  >
                    Reset All
                  </button>
                  <button
                    onClick={() => setShowFiltersMobile(false)}
                    className="w-full text-center text-xs font-bold py-3 text-white bg-cyan-600 rounded-xl hover:bg-cyan-500"
                  >
                    Apply Filters
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* PRODUCTS GRID AREA */}
        <section className="flex-grow">
          {sortedProducts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex h-96 flex-col items-center justify-center text-center rounded-[2.5rem] border-2 border-dashed border-slate-200"
            >
              <div className="mb-4 rounded-full bg-slate-100 p-5 text-slate-400">
                <RotateCcw className="h-10 w-10 animate-spin" />
              </div>
              <h3 className="text-lg font-black text-slate-800">No matching products found</h3>
              <p className="mt-2 text-xs text-slate-500 max-w-[280px] leading-5">
                No items match category "{selectedCategory}" with price below ${priceRange} or keyword "{searchQuery}".
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-6 rounded-xl bg-cyan-600 px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-cyan-500"
              >
                Reset Search Filters
              </button>
            </motion.div>
          ) : (
            <motion.div 
              layout
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              <AnimatePresence mode="popLayout">
                {sortedProducts.map((product, index) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    index={index} 
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </section>

      </div>
    </div>
  );
}
