/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import { products } from '../data/products';
import { useAuth } from './AuthContext';

// External helper to generate unique IDs and satisfy React Compiler purity rules
function generateUniqueToastId() {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
}

const ShopContext = createContext();

export function ShopProvider({ children }) {
  const { isAuthenticated } = useAuth();

  // Theme is permanently light — no dark mode
  const theme = 'light';

  // View routing state
  const [activeView, setActiveView] = useState('home');
  const [activeProductId, setActiveProductId] = useState(null);
  
  // Pending cart item for post-login redirect/add
  const [pendingCartItem, setPendingCartItem] = useState(null);

  // E-commerce state
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('lucky-cart');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('lucky-favorites');
    return saved ? JSON.parse(saved) : [];
  });

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState(200);

  // Promo code states
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0); // in percent

  // Custom Toast State
  const [toasts, setToasts] = useState([]);

  // Finalized Order receipt storage
  const [lastOrder, setLastOrder] = useState(null);

  // Always enforce light theme on mount — clear any stored dark preference
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('dark');
    root.style.colorScheme = 'light';
    localStorage.setItem('lucky-theme', 'light');
  }, []);

  // Sync cart and favorites to localstorage
  useEffect(() => {
    localStorage.setItem('lucky-cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('lucky-favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Theme toggle is a no-op — site is always light/white
  const toggleTheme = () => {};

  // Toast utilities
  const addToast = (message, type = 'success') => {
    const id = generateUniqueToastId();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Cart operations
  const addToCart = (product, quantity = 1, selectedSpecs = {}) => {
    if (!isAuthenticated) {
      setPendingCartItem({ product, quantity, selectedSpecs, activeView, activeProductId });
      addToast('Please login to add products to your cart.', 'info');
      navigateTo('login');
      return;
    }

    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(item => 
        item.product.id === product.id && 
        JSON.stringify(item.selectedSpecs) === JSON.stringify(selectedSpecs)
      );

      if (existingIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingIndex].quantity += quantity;
        addToast(`Added another ${product.name} to cart successfully! 🎉`, 'success');
        return newCart;
      } else {
        addToast(`${product.name} added to cart successfully! 🎉`, 'success');
        return [...prevCart, { product, quantity, selectedSpecs }];
      }
    });
  };

  const removeFromCart = (productIndex) => {
    setCart(prevCart => {
      const item = prevCart[productIndex];
      if (item) {
        addToast(`${item.product.name} removed from cart`, 'info');
      }
      return prevCart.filter((_, idx) => idx !== productIndex);
    });
  };

  const updateCartQty = (productIndex, newQty) => {
    if (newQty <= 0) {
      removeFromCart(productIndex);
      return;
    }
    setCart(prevCart => {
      const newCart = [...prevCart];
      newCart[productIndex].quantity = newQty;
      return newCart;
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  // Favorites
  const toggleFavorite = (productId) => {
    const product = products.find(p => p.id === productId);
    setFavorites(prev => {
      if (prev.includes(productId)) {
        addToast(`Removed ${product?.name || 'product'} from wishlist`, 'info');
        return prev.filter(id => id !== productId);
      } else {
        addToast(`Added ${product?.name || 'product'} to wishlist!`, 'love');
        return [...prev, productId];
      }
    });
  };

  // Promo application
  const applyPromo = (code) => {
    const upperCode = code.toUpperCase().trim();
    if (upperCode === 'WELCOME10') {
      setPromoCode('WELCOME10');
      setPromoDiscount(10);
      addToast('Promo code WELCOME10 applied! (10% Off)', 'success');
      return true;
    } else if (upperCode === 'LUCKY25') {
      setPromoCode('LUCKY25');
      setPromoDiscount(25);
      addToast('Promo code LUCKY25 applied! (25% Off)', 'success');
      return true;
    } else {
      addToast('Invalid promo code. Try WELCOME10 or LUCKY25', 'error');
      return false;
    }
  };

  const removePromo = () => {
    setPromoCode('');
    setPromoDiscount(0);
    addToast('Promo code removed', 'info');
  };

  // View navigation helper
  const navigateTo = (view, productId = null) => {
    setActiveView(view);
    if (productId) {
      setActiveProductId(productId);
    }
    // Clear pending cart item if user navigates away from auth flow
    if (view !== 'login' && view !== 'signup') {
      setPendingCartItem(null);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Post-login action: add pending item to cart and redirect back
  const handlePostLoginRedirect = () => {
    if (pendingCartItem) {
      const { product, quantity, selectedSpecs, activeView: prevView, activeProductId: prevProductId } = pendingCartItem;
      
      setCart(prevCart => {
        const existingIndex = prevCart.findIndex(item => 
          item.product.id === product.id && 
          JSON.stringify(item.selectedSpecs) === JSON.stringify(selectedSpecs)
        );

        if (existingIndex > -1) {
          const newCart = [...prevCart];
          newCart[existingIndex].quantity += quantity;
          addToast(`Added another ${product.name} to cart successfully! 🎉`, 'success');
          return newCart;
        } else {
          addToast(`${product.name} added to cart successfully! 🎉`, 'success');
          return [...prevCart, { product, quantity, selectedSpecs }];
        }
      });

      setPendingCartItem(null);
      navigateTo(prevView || 'shop', prevProductId);
    } else {
      navigateTo('home');
    }
  };

  // Helper values for calculations
  const cartSubtotal = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  const cartDiscountAmount = (cartSubtotal * promoDiscount) / 100;
  const cartTax = (cartSubtotal - cartDiscountAmount) * 0.08; // 8% standard tax
  const cartShipping = cartSubtotal > 100 || cartSubtotal === 0 ? 0 : 9.99; // Free shipping above $100
  const cartTotal = cartSubtotal - cartDiscountAmount + cartTax + cartShipping;

  return (
    <ShopContext.Provider
      value={{
        theme,
        toggleTheme,
        activeView,
        activeProductId,
        navigateTo,
        cart,
        favorites,
        addToCart,
        removeFromCart,
        updateCartQty,
        clearCart,
        toggleFavorite,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        priceRange,
        setPriceRange,
        promoCode,
        promoDiscount,
        applyPromo,
        removePromo,
        toasts,
        addToast,
        removeToast,
        cartSubtotal,
        cartDiscountAmount,
        cartTax,
        cartShipping,
        cartTotal,
        lastOrder,
        setLastOrder,
        handlePostLoginRedirect
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
}
