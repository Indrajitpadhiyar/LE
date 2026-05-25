import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Info, Heart, AlertCircle, X } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function Toast() {
  const { toasts, removeToast } = useShop();

  const getToastStyles = (type) => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-emerald-50 border-emerald-500/30 text-emerald-800',
          icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" />
        };
      case 'error':
        return {
          bg: 'bg-rose-50 border-rose-500/30 text-rose-800',
          icon: <AlertCircle className="h-5 w-5 text-rose-500" />
        };
      case 'love':
        return {
          bg: 'bg-pink-50 border-pink-500/30 text-pink-800',
          icon: <Heart className="h-5 w-5 fill-pink-500 text-pink-500" />
        };
      case 'info':
      default:
        return {
          bg: 'bg-sky-50 border-sky-500/30 text-sky-800',
          icon: <Info className="h-5 w-5 text-sky-500" />
        };
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const styles = getToastStyles(toast.type);
          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
              className={`flex items-center justify-between gap-3 p-4 rounded-2xl border backdrop-blur-xl shadow-xl pointer-events-auto ${styles.bg}`}
            >
              <div className="flex items-center gap-3">
                <span className="shrink-0">{styles.icon}</span>
                <p className="text-sm font-medium">{toast.message}</p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="shrink-0 rounded-lg p-1 hover:bg-black/5 transition text-current opacity-70 hover:opacity-100"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
