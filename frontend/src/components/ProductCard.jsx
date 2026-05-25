import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function ProductCard({ product, index }) {
  const { addToCart, toggleFavorite, favorites, navigateTo } = useShop();
  const isFavorited = favorites.includes(product.id);

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={{ y: -6 }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/95 p-5 shadow-[0_15px_40px_rgba(0,0,0,0.02)] transition-shadow duration-500 hover:shadow-[0_30px_70px_rgba(0,0,0,0.08)]"
    >
      <div>
        {/* Card Header Media */}
        <div className="relative mb-4 aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-100">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

          {/* Badges */}
          <div className="absolute left-3 top-3 flex flex-col gap-1.5 pointer-events-none">
            {product.badge && (
              <span className="rounded-full bg-cyan-500 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-white shadow-md shadow-cyan-500/25">
                {product.badge}
              </span>
            )}
            <span className="rounded-full bg-white/90 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold text-slate-700 shadow-sm border border-white/10">
              {product.category}
            </span>
          </div>

          {/* Wishlist Button */}
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(product.id);
            }}
            className={`absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-2xl backdrop-blur-md border shadow-md transition-all duration-300 ${
              isFavorited
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-500'
                : 'bg-white/80 border-white/20 text-slate-500 hover:text-rose-500 hover:bg-white'
            }`}
          >
            <Heart className={`h-5 w-5 ${isFavorited ? 'fill-rose-500' : ''}`} />
          </motion.button>
        </div>

        {/* Product Details */}
        <div className="px-1">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="text-xs font-bold text-slate-800">
                {product.rating}
              </span>
              <span className="text-[10px] text-slate-500">
                ({product.reviewsCount})
              </span>
            </div>
            
            {product.stock <= 8 && (
              <span className="text-[10px] font-semibold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-md">
                Only {product.stock} left
              </span>
            )}
          </div>

          <h3
            onClick={() => navigateTo('product-details', product.id)}
            className="mb-1.5 cursor-pointer text-lg font-bold text-slate-900 line-clamp-1 transition duration-200 hover:text-cyan-500"
          >
            {product.name}
          </h3>

          <p className="text-xs leading-5 text-slate-500 line-clamp-2 min-h-[40px]">
            {product.description}
          </p>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="mt-5 px-1 flex items-center justify-between border-t border-slate-100 pt-4">
        <div>
          <p className="text-2xl font-black text-slate-900">
            ${product.price.toFixed(2)}
          </p>
          <p className="text-[10px] font-semibold tracking-wider uppercase text-cyan-600">
            Free shipping
          </p>
        </div>

        <div className="flex gap-2">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => addToCart(product, 1)}
            className="flex items-center gap-2 rounded-2xl bg-cyan-600 px-4 py-3 text-xs font-bold text-white shadow-lg shadow-cyan-600/10 hover:shadow-cyan-600/25 transition hover:bg-cyan-500"
          >
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}
