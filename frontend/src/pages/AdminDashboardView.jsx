import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck, LogOut, Users, ShoppingCart, DollarSign,
  Package, TrendingUp, Activity, Settings, BarChart3,
  LayoutDashboard, Menu, X, Plus, Search, Trash2, Edit3,
  Check, ChevronRight, User, ArrowLeft, CreditCard, Lock, Globe,
  Shield
} from 'lucide-react';
import { products as initialProductsData } from '../data/products';

// Mock Orders Data
const initialOrders = [
  { id: 'LE-2584', customer: 'Rahul Sharma', email: 'rahul@gmail.com', items: 'Aura Smart LED Bulb (x2)', date: '2026-05-26', total: 59.98, payment: 'Paid', status: 'Processing' },
  { id: 'LE-2583', customer: 'Sneha Patel', email: 'sneha.patel@outlook.com', items: 'Lucky Smart Power Hub (x1)', date: '2026-05-25', total: 54.00, payment: 'Paid', status: 'Shipped' },
  { id: 'LE-2582', customer: 'Amit Verma', email: 'amitv@yahoo.com', items: 'Pro Hardware Installer Kit (x1), Accent Bar (x2)', date: '2026-05-24', total: 124.50, payment: 'Paid', status: 'Delivered' },
  { id: 'LE-2581', customer: 'Pooja Rao', email: 'pooja.rao@gmail.com', items: 'Tactile Smart Switch Duo (x2)', date: '2026-05-24', total: 136.00, payment: 'Paid', status: 'Delivered' },
  { id: 'LE-2580', customer: 'John Doe', email: 'john@example.com', items: 'Nexus Smart Thermostat (x1)', date: '2026-05-23', total: 145.00, payment: 'Failed', status: 'Processing' }
];

// Mock Users Data
const initialUsers = [
  { id: 'usr-1', name: 'Indrajit Padhiyar', email: 'indrajit@luckyelectrical.com', role: 'admin', joined: '2026-01-10', status: 'Active' },
  { id: 'usr-2', name: 'Rahul Sharma', email: 'rahul@gmail.com', role: 'user', joined: '2026-03-15', status: 'Active' },
  { id: 'usr-3', name: 'Sneha Patel', email: 'sneha.patel@outlook.com', role: 'user', joined: '2026-04-02', status: 'Active' },
  { id: 'usr-4', name: 'Amit Verma', email: 'amitv@yahoo.com', role: 'user', joined: '2026-04-20', status: 'Suspended' },
  { id: 'usr-5', name: 'Pooja Rao', email: 'pooja.rao@gmail.com', role: 'user', joined: '2026-05-01', status: 'Active' }
];

// Mock Transactions Data
const initialTransactions = [
  { id: 'TXN-90210', orderId: 'LE-2584', amount: 59.98, method: 'UPI (GPay)', status: 'Success', date: '2026-05-26 16:32' },
  { id: 'TXN-90209', orderId: 'LE-2583', amount: 54.00, method: 'UPI (PhonePe)', status: 'Success', date: '2026-05-25 11:15' },
  { id: 'TXN-90208', orderId: 'LE-2582', amount: 124.50, method: 'Credit Card', status: 'Success', date: '2026-05-24 19:40' },
  { id: 'TXN-90207', orderId: 'LE-2581', amount: 136.00, method: 'Net Banking', status: 'Success', date: '2026-05-24 09:20' },
  { id: 'TXN-90206', orderId: 'LE-2580', amount: 145.00, method: 'UPI (GPay)', status: 'Failed', date: '2026-05-23 15:05' }
];

export default function AdminDashboardView() {
  const { user, isAdmin, logout } = useAuth();
  const { navigateTo, addToast } = useShop();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Core administrative states
  const [productsList, setProductsList] = useState(initialProductsData);
  const [ordersList, setOrdersList] = useState(initialOrders);
  const [usersList, setUsersList] = useState(initialUsers);
  const [transactionsList, setTransactionsList] = useState(initialTransactions);

  const [settings, setSettings] = useState({
    storeName: 'Lucky Electrical Storefront',
    supportEmail: 'support@luckyelectrical.com',
    currency: 'INR',
    lowStockThreshold: 10,
    upiId: 'luckyelectrical@okaxis',
    razorpayKey: 'rzp_live_8Fj3s9D2kl',
    sessionTimeout: 30,
    forceHttps: true
  });

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  // Modal forms states
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' | 'edit'
  const [editingProduct, setEditingProduct] = useState(null);

  // Form fields
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('Lighting');
  const [formPrice, setFormPrice] = useState('');
  const [formStock, setFormStock] = useState('');
  const [formDesc, setFormDesc] = useState('');

  // Guard: redirect non-admins
  useEffect(() => {
    if (!isAdmin) {
      navigateTo('admin-login');
    }
  }, [isAdmin, navigateTo]);

  if (!isAdmin) return null;

  const handleLogout = () => {
    logout();
    addToast('Logged out from admin panel', 'info');
    navigateTo('login');
  };

  const openAddProduct = () => {
    setModalMode('add');
    setFormName('');
    setFormCategory('Lighting');
    setFormPrice('');
    setFormStock('');
    setFormDesc('');
    setIsProductModalOpen(true);
  };

  const openEditProduct = (prod) => {
    setModalMode('edit');
    setEditingProduct(prod);
    setFormName(prod.name);
    setFormCategory(prod.category);
    setFormPrice(prod.price.toString());
    setFormStock(prod.stock.toString());
    setFormDesc(prod.description);
    setIsProductModalOpen(true);
  };

  const handleProductSubmit = (e) => {
    e.preventDefault();
    if (!formName.trim() || !formPrice || !formStock) {
      addToast('Please fill all required fields', 'error');
      return;
    }

    if (modalMode === 'add') {
      const newProduct = {
        id: `prod-${Date.now()}`,
        name: formName,
        category: formCategory,
        price: parseFloat(formPrice),
        stock: parseInt(formStock),
        description: formDesc || 'Premium electrical equipment.',
        rating: 5.0,
        reviewsCount: 0,
        image: 'https://images.unsplash.com/photo-1550985616-10810253b84d?auto=format&fit=crop&w=600&q=80',
      };
      setProductsList(prev => [newProduct, ...prev]);
      addToast('Product added successfully 🎉', 'success');
    } else {
      setProductsList(prev => prev.map(p => p.id === editingProduct.id ? {
        ...p,
        name: formName,
        category: formCategory,
        price: parseFloat(formPrice),
        stock: parseInt(formStock),
        description: formDesc
      } : p));
      addToast('Product updated successfully ✅', 'success');
    }
    setIsProductModalOpen(false);
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProductsList(prev => prev.filter(p => p.id !== id));
      addToast('Product removed from storefront', 'info');
    }
  };

  // ═══════════════════════════════════════════════
  //  ORDERS / USERS / SETTINGS ACTIONS
  // ═══════════════════════════════════════════════
  const handleOrderStatusChange = (orderId, newStatus) => {
    setOrdersList(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    addToast(`Order ${orderId} status set to ${newStatus}`, 'success');
  };

  const handleUserRoleToggle = (userId) => {
    setUsersList(prev => prev.map(u => {
      if (u.id === userId) {
        const nextRole = u.role === 'admin' ? 'user' : 'admin';
        addToast(`${u.name} role updated to ${nextRole}`, 'success');
        return { ...u, role: nextRole };
      }
      return u;
    }));
  };

  const handleUserStatusToggle = (userId) => {
    setUsersList(prev => prev.map(u => {
      if (u.id === userId) {
        const nextStatus = u.status === 'Active' ? 'Suspended' : 'Active';
        addToast(`User account status updated to ${nextStatus}`, nextStatus === 'Active' ? 'success' : 'info');
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  const handleSettingsSubmit = (e) => {
    e.preventDefault();
    addToast('System settings saved successfully ⚙️', 'success');
  };

  // ═══════════════════════════════════════════════
  //  SUBPAGES RENDERING
  // ═══════════════════════════════════════════════

  // Subpage 1: Dashboard
  const DashboardSubPage = () => {
    const stats = [
      { icon: Users, label: 'Active Customers', value: usersList.length.toString(), trend: '+20%', color: 'cyan' },
      { icon: ShoppingCart, label: 'Pending Orders', value: ordersList.filter(o => o.status !== 'Delivered').length.toString(), trend: '-4%', color: 'violet' },
      { icon: DollarSign, label: 'Sales Revenue', value: '₹' + ordersList.reduce((acc, o) => acc + (o.payment === 'Paid' ? o.total : 0), 0).toFixed(2), trend: '+15.2%', color: 'emerald' },
      { icon: Package, label: 'Catalog Products', value: productsList.length.toString(), trend: `+${productsList.length - initialProductsData.length}`, color: 'amber' },
    ];

    const salesData = [
      { day: 'Mon', amount: 32000 },
      { day: 'Tue', amount: 48000 },
      { day: 'Wed', amount: 35000 },
      { day: 'Thu', amount: 62000 },
      { day: 'Fri', amount: 55000 },
      { day: 'Sat', amount: 84000 },
      { day: 'Sun', amount: 72000 },
    ];

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Operational Overview</h1>
          <p className="text-slate-500 text-sm">Lucky Electrical telemetry and telemetry statistics.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => {
            const colorMap = {
              cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-600', border: 'border-cyan-200/50' },
              violet: { bg: 'bg-violet-500/10', text: 'text-violet-600', border: 'border-violet-200/50' },
              emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-600', border: 'border-emerald-200/50' },
              amber: { bg: 'bg-amber-500/10', text: 'text-amber-600', border: 'border-amber-200/50' },
            };
            const c = colorMap[stat.color] || colorMap.cyan;
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow group`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                    <Icon className={`w-5 h-5 ${c.text}`} />
                  </div>
                  <span className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    <TrendingUp className="w-2.5 h-2.5" />
                    {stat.trend}
                  </span>
                </div>
                <p className="text-xl font-bold text-slate-800">{stat.value}</p>
                <p className="text-xs text-slate-400 font-medium mt-0.5">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Charts & Activity Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-6 uppercase tracking-wider">Weekly Revenue Analytics</h3>
            <div className="flex items-end justify-between h-48 gap-3 pt-6 border-b border-slate-100">
              {salesData.map((d, i) => {
                const heightPercent = `${(d.amount / 90000) * 100}%`;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center group h-full justify-end">
                    <div className="text-[9px] font-extrabold text-cyan-600 mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      ₹{(d.amount / 1000)}k
                    </div>
                    <div
                      className="w-full bg-gradient-to-t from-cyan-500 to-indigo-500 rounded-t-md transition-all duration-500 group-hover:from-cyan-400 group-hover:to-indigo-400 shadow-sm shadow-cyan-500/10 cursor-pointer"
                      style={{ height: heightPercent }}
                    />
                    <span className="text-[10px] font-bold text-slate-400 mt-2.5">{d.day}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Activity Logs */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-6 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-slate-400 animate-pulse" />
              Live Events
            </h3>
            <div className="space-y-4">
              {[
                { action: 'New order registered', desc: 'Order #LE-2584 by Rahul Sharma', time: '2 mins ago', color: 'bg-emerald-400' },
                { action: 'Admin logged in', desc: 'Security authorization validation', time: '12 mins ago', color: 'bg-indigo-400' },
                { action: 'Database sync', desc: 'Loaded catalog schema update', time: '35 mins ago', color: 'bg-cyan-400' },
                { action: 'Product stock low alert', desc: 'Pro Installer Kit quantity <= 8', time: '1 hr ago', color: 'bg-amber-400' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full ${item.color} mt-1.5 flex-shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-700">{item.action}</p>
                    <p className="text-[10px] text-slate-400 truncate">{item.desc}</p>
                  </div>
                  <span className="text-[9px] text-slate-400 font-medium whitespace-nowrap">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Subpage 2: Products
  const ProductsSubPage = () => {
    const filteredProducts = productsList.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === 'All' || p.category === filterCategory;
      return matchesSearch && matchesCategory;
    });

    const categories = ['All', 'Lighting', 'Power Solutions', 'Smart Home', 'Tools & Gear', 'Eco Energy'];

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Inventory Catalog</h1>
            <p className="text-slate-500 text-sm">Add, remove and manage the products display on the shop page.</p>
          </div>
          <button
            onClick={openAddProduct}
            className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-600 hover:to-indigo-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-cyan-500/15 cursor-pointer border-none"
          >
            <Plus className="w-4 h-4" />
            Add Store Item
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by product name/ID..."
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 outline-none"
            />
          </div>

          <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border-none ${filterCategory === cat ? 'bg-cyan-500 text-white shadow-sm' : 'bg-slate-55 bg-slate-100 hover:bg-slate-200 text-slate-600'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Table */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Product details</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Category</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Price</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Stock Level</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50/30 transition-colors">
                      <td className="p-4 flex items-center gap-3">
                        <img src={p.image} className="w-10 h-10 rounded-xl object-cover border border-slate-100 flex-shrink-0" alt="" />
                        <div>
                          <p className="text-sm font-bold text-slate-800">{p.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold">{p.id}</p>
                        </div>
                      </td>
                      <td className="p-4 text-xs font-bold text-slate-500">{p.category}</td>
                      <td className="p-4 text-sm font-extrabold text-slate-900">₹{p.price.toFixed(2)}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${p.stock <= settings.lowStockThreshold ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${p.stock <= settings.lowStockThreshold ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
                          {p.stock} units
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-1">
                        <button
                          onClick={() => openEditProduct(p)}
                          className="p-1.5 text-slate-400 hover:text-cyan-600 border-none bg-transparent cursor-pointer"
                          title="Edit Product"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-1.5 text-slate-400 hover:text-red-500 border-none bg-transparent cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-400 text-sm font-medium">
                      No products match your search filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // Subpage 3: Orders
  const OrdersSubPage = () => {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Order Management</h1>
          <p className="text-slate-500 text-sm">Process incoming customer requests, check payment fulfillment, and update tracking status.</p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Order ID</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Customer</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Items summary</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Total</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Fulfillment</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Process Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ordersList.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="p-4 text-sm font-bold text-slate-800">{order.id}</td>
                    <td className="p-4">
                      <p className="text-sm font-bold text-slate-700">{order.customer}</p>
                      <p className="text-[10px] text-slate-400 font-semibold">{order.email}</p>
                    </td>
                    <td className="p-4 text-xs font-semibold text-slate-500 max-w-xs truncate">{order.items}</td>
                    <td className="p-4 text-sm font-extrabold text-slate-900">₹{order.total.toFixed(2)}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold uppercase ${order.payment === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                        {order.payment}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <select
                        value={order.status}
                        onChange={(e) => handleOrderStatusChange(order.id, e.target.value)}
                        className={`text-xs font-bold border rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-cyan-500/10 cursor-pointer ${order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                            order.status === 'Shipped' ? 'bg-cyan-50 text-cyan-600 border-cyan-200' : 'bg-amber-50 text-amber-600 border-amber-200'
                          }`}
                      >
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // Subpage 4: Manage Users
  const UsersSubPage = () => {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">User accounts directory</h1>
          <p className="text-slate-500 text-sm">Control site-wide security access, grant admin permissions, or suspend policy-breaking users.</p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Account holder</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Email ID</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Authorization Role</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Joined Date</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Account status</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Settings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {usersList.map((usr) => (
                  <tr key={usr.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${usr.role === 'admin' ? 'bg-violet-100 text-violet-700' : 'bg-slate-100 text-slate-700'}`}>
                        {usr.name.charAt(0)}
                      </div>
                      <span className="text-sm font-bold text-slate-700">{usr.name}</span>
                    </td>
                    <td className="p-4 text-xs font-semibold text-slate-500">{usr.email}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${usr.role === 'admin' ? 'bg-violet-100 text-violet-700' : 'bg-slate-100 text-slate-600'}`}>
                        <Shield className="w-2.5 h-2.5" />
                        {usr.role}
                      </span>
                    </td>
                    <td className="p-4 text-xs font-bold text-slate-400">{usr.joined}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold uppercase ${usr.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                        {usr.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-1">
                      <button
                        onClick={() => handleUserRoleToggle(usr.id)}
                        className="text-xs font-bold text-cyan-600 hover:text-cyan-700 cursor-pointer border-none bg-transparent"
                      >
                        Toggle Role
                      </button>
                      <span className="text-slate-200">|</span>
                      <button
                        onClick={() => handleUserStatusToggle(usr.id)}
                        className={`text-xs font-bold cursor-pointer border-none bg-transparent ${usr.status === 'Active' ? 'text-red-500 hover:text-red-600' : 'text-emerald-600 hover:text-emerald-700'}`}
                      >
                        {usr.status === 'Active' ? 'Suspend' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // Subpage 5: Payments
  const PaymentsSubPage = () => {
    const paymentBreakdown = [
      { method: 'UPI Transactions (GPay, PhonePe)', share: 64, amount: '₹2,89,472.00', color: 'bg-cyan-500' },
      { method: 'Credit & Debit Cards', share: 26, amount: '₹1,17,598.00', color: 'bg-indigo-500' },
      { method: 'Net Banking Transfers', share: 10, amount: '₹45,230.00', color: 'bg-violet-500' },
    ];

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Financial Ledger</h1>
          <p className="text-slate-500 text-sm">Review transaction statuses, payment channels breakdown, and gateway audits.</p>
        </div>

        {/* Payment Channels Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-800 mb-6 uppercase tracking-wider">Gateway Shares</h3>
              <div className="space-y-4">
                {paymentBreakdown.map((item, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-slate-600">
                      <span>{item.method}</span>
                      <span className="text-slate-900">{item.share}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.share}%` }} />
                    </div>
                    <p className="text-[10px] text-slate-400 font-extrabold text-right">{item.amount}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="pt-6 border-t border-slate-50 mt-6 flex justify-between items-center text-xs font-bold text-slate-500">
              <span>UPI active threshold</span>
              <span className="text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-md">Healthy</span>
            </div>
          </div>

          {/* Transactions List */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-6 uppercase tracking-wider">Recent Inbound Payments</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    <th className="p-3 font-bold text-slate-400 uppercase">TXN Reference</th>
                    <th className="p-3 font-bold text-slate-400 uppercase">Order ID</th>
                    <th className="p-3 font-bold text-slate-400 uppercase">Amount</th>
                    <th className="p-3 font-bold text-slate-400 uppercase">Method</th>
                    <th className="p-3 font-bold text-slate-400 uppercase">Date/Time</th>
                    <th className="p-3 font-bold text-slate-400 uppercase text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {transactionsList.map((txn) => (
                    <tr key={txn.id} className="hover:bg-slate-50/20">
                      <td className="p-3 font-bold text-slate-800">{txn.id}</td>
                      <td className="p-3 font-semibold text-slate-500">{txn.orderId}</td>
                      <td className="p-3 font-extrabold text-slate-900">₹{txn.amount.toFixed(2)}</td>
                      <td className="p-3 font-bold text-slate-500">{txn.method}</td>
                      <td className="p-3 font-bold text-slate-400">{txn.date}</td>
                      <td className="p-3 text-right">
                        <span className={`px-2 py-0.5 rounded-lg text-[9px] font-extrabold uppercase ${txn.status === 'Success' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                          {txn.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Subpage 6: Settings
  const SettingsSubPage = () => {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">System settings</h1>
          <p className="text-slate-500 text-sm">Configure store-wide operational metrics, API integrations, and session properties.</p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 max-w-2xl">
          <form onSubmit={handleSettingsSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Store Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">Store Title</label>
                <input
                  type="text"
                  value={settings.storeName}
                  onChange={(e) => setSettings(prev => ({ ...prev, storeName: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-200 rounded-2xl text-xs focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 outline-none font-medium"
                />
              </div>

              {/* Support Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">Support Mailbox</label>
                <input
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) => setSettings(prev => ({ ...prev, supportEmail: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-200 rounded-2xl text-xs focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 outline-none font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* UPI Settle ID */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">UPI Settlement VPA</label>
                <input
                  type="text"
                  value={settings.upiId}
                  onChange={(e) => setSettings(prev => ({ ...prev, upiId: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-200 rounded-2xl text-xs focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 outline-none font-medium"
                />
              </div>

              {/* Low Stock Alert */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">Low Stock Threshold</label>
                <input
                  type="number"
                  value={settings.lowStockThreshold}
                  onChange={(e) => setSettings(prev => ({ ...prev, lowStockThreshold: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-3 border border-slate-200 rounded-2xl text-xs focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 outline-none font-medium"
                />
              </div>
            </div>

            {/* API Integrations */}
            <div className="border-t border-slate-100 pt-5 space-y-4">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-widest">Gateway Integrations</h4>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Razorpay Sandbox Key</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="password"
                    value={settings.razorpayKey}
                    onChange={(e) => setSettings(prev => ({ ...prev, razorpayKey: e.target.value }))}
                    className="w-full pl-9 pr-4 py-3 border border-slate-200 rounded-2xl text-xs focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 outline-none font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Checkbox configs */}
            <div className="border-t border-slate-100 pt-5 space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.forceHttps}
                  onChange={(e) => setSettings(prev => ({ ...prev, forceHttps: e.target.checked }))}
                  className="w-4 h-4 text-cyan-600 focus:ring-cyan-500 border-slate-300 rounded"
                />
                <div className="text-xs font-bold text-slate-600">
                  Force HSTS SSL Connection
                  <p className="text-[10px] text-slate-400 font-medium normal-case mt-0.5">Enforces secure connection validation on all API endpoints.</p>
                </div>
              </label>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-600 hover:to-indigo-600 text-white rounded-2xl text-xs font-bold shadow-md shadow-cyan-500/15 cursor-pointer border-none"
              >
                Save Settings
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const renderSubPage = () => {
    switch (activeTab) {
      case 'products': return <ProductsSubPage />;
      case 'orders': return <OrdersSubPage />;
      case 'users': return <UsersSubPage />;
      case 'payments': return <PaymentsSubPage />;
      case 'settings': return <SettingsSubPage />;
      case 'dashboard':
      default:
        return <DashboardSubPage />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Mobile Sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col justify-between border-r border-slate-800 transition-transform duration-300 lg:translate-x-0 lg:static lg:flex-shrink-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Brand header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-600 flex items-center justify-center shadow-md">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xs font-black text-white tracking-widest">LUCKY ELECT.</h2>
              <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">Admin Terminal</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-slate-500 hover:text-white lg:hidden border-none bg-transparent cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Items */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {[
            { tab: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { tab: 'products', label: 'Products', icon: Package },
            { tab: 'orders', label: 'Orders', icon: ShoppingCart },
            { tab: 'users', label: 'Manage Users', icon: Users },
            { tab: 'payments', label: 'Payments', icon: CreditCard },
            { tab: 'settings', label: 'Settings', icon: Settings },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.tab;
            return (
              <button
                key={item.tab}
                type="button"
                onClick={() => { setActiveTab(item.tab); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold relative transition-colors cursor-pointer border-none bg-transparent ${isActive ? 'text-white font-extrabold' : 'text-slate-400 hover:text-slate-200'}`}
              >
                {isActive && (
                  <motion.div
                    layoutId="adminTabHighlight"
                    className="absolute inset-0 bg-cyan-500/10 border-l-4 border-cyan-400 rounded-r-xl"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon className={`w-4 h-4 relative z-10 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span className="relative z-10">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Profile Details */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-violet-600/30 flex items-center justify-center border border-violet-500/30">
              <User className="w-4 h-4 text-violet-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">{user?.name || 'Admin'}</p>
              <p className="text-[10px] text-slate-500 truncate">{user?.email || 'admin@luckyelectrical.com'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-red-500/30 text-red-400 hover:text-white hover:bg-red-500/10 font-bold text-[10px] transition-colors cursor-pointer bg-transparent"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Content wrapper */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile menu bar */}
        <header className="bg-white border-b border-slate-200 py-3.5 px-6 flex items-center justify-between lg:hidden sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-slate-600 p-1 border-none bg-transparent cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="font-extrabold text-slate-800 text-sm">Lucky Electrical</span>
          </div>
          <div className="text-[10px] font-bold text-cyan-600 bg-cyan-50 px-2.5 py-1 rounded-lg">
            Active Session
          </div>
        </header>

        {/* Content body */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-h-screen">
          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
              >
                {renderSubPage()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Add / Edit Product Modal */}
      <AnimatePresence>
        {isProductModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full border border-slate-100 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-500 to-indigo-500" />
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-800">
                  {modalMode === 'add' ? 'Add New Product' : 'Edit Catalog Product'}
                </h3>
                <button
                  onClick={() => setIsProductModalOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 border-none bg-transparent cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleProductSubmit} className="space-y-4">
                {/* Product Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Product Title</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Aura LED Smart Bulb"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-cyan-500 font-medium"
                  />
                </div>

                {/* Grid Price/Stock/Category */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Price */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Price (INR)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formPrice}
                      onChange={(e) => setFormPrice(e.target.value)}
                      placeholder="999.00"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-cyan-500 font-medium"
                    />
                  </div>

                  {/* Stock */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Stock Quantity</label>
                    <input
                      type="number"
                      required
                      value={formStock}
                      onChange={(e) => setFormStock(e.target.value)}
                      placeholder="25"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-cyan-500 font-medium"
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Store Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-cyan-500 font-bold bg-white"
                  >
                    <option value="Lighting">Lighting</option>
                    <option value="Power Solutions">Power Solutions</option>
                    <option value="Smart Home">Smart Home</option>
                    <option value="Tools & Gear">Tools & Gear</option>
                    <option value="Eco Energy">Eco Energy</option>
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Short Description</label>
                  <textarea
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    placeholder="Short description of features..."
                    rows={3}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-cyan-500 font-medium resize-none"
                  />
                </div>

                {/* Submit */}
                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsProductModalOpen(false)}
                    className="flex-1 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-bold cursor-pointer bg-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-600 hover:to-indigo-600 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer border-none"
                  >
                    {modalMode === 'add' ? 'Save Product' : 'Update Product'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
