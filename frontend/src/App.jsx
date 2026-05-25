import './App.css';
import { ShopProvider, useShop } from './context/ShopContext';
import Layout from './components/Layout';
import Toast from './components/Toast';

// Page Views
import HomeView from './pages/HomeView';
import ShopView from './pages/ShopView';
import ProductDetailsView from './pages/ProductDetailsView';
import CheckoutView from './pages/CheckoutView';

function AppContent() {
  const { activeView } = useShop();

  const renderActiveView = () => {
    switch (activeView) {
      case 'shop':
        return <ShopView />;
      case 'product-details':
        return <ProductDetailsView />;
      case 'checkout':
        return <CheckoutView />;
      case 'home':
      default:
        return <HomeView />;
    }
  };

  return (
    <Layout>
      <div className="relative">
        {renderActiveView()}
      </div>
      <Toast />
    </Layout>
  );
}

function App() {
  return (
    <ShopProvider>
      <AppContent />
    </ShopProvider>
  );
}

export default App;
