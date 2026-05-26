import './App.css';
import { ShopProvider, useShop } from './context/ShopContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Toast from './components/Toast';

// Page Views
import HomeView from './pages/HomeView';
import ShopView from './pages/ShopView';
import ProductDetailsView from './pages/ProductDetailsView';
import CheckoutView from './pages/CheckoutView';

// Auth Views
import LoginView from './pages/LoginView';
import SignupView from './pages/SignupView';
import AdminLoginView from './pages/AdminLoginView';
import AdminDashboardView from './pages/AdminDashboardView';

function AppContent() {
  const { activeView } = useShop();
  const { loading } = useAuth();

  // Show a loading state while auth token is being validated
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-500 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  const renderActiveView = () => {
    switch (activeView) {
      // Auth views (no Layout wrapper — standalone pages)
      case 'login':
      case 'signup':
        return <LoginView />;
      case 'admin-login':
        return <AdminLoginView />;
      case 'admin-dashboard':
        return <AdminDashboardView />;

      // Shop views (wrapped in Layout)
      case 'shop':
        return <Layout><ShopView /></Layout>;
      case 'product-details':
        return <Layout><ProductDetailsView /></Layout>;
      case 'checkout':
        return <Layout><CheckoutView /></Layout>;
      case 'home':
      default:
        return <Layout><HomeView /></Layout>;
    }
  };

  return (
    <div className="relative app-root min-h-screen bg-slate-50">
      {renderActiveView()}
      <Toast />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ShopProvider>
        <AppContent />
      </ShopProvider>
    </AuthProvider>
  );
}

export default App;
