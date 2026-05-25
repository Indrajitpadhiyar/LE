import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, ChevronRight, ShieldCheck, MapPin, 
  Sparkles, CheckCircle2, ShoppingBag, Printer
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function CheckoutView() {
  const { 
    cart, clearCart, promoDiscount,
    cartSubtotal, cartDiscountAmount, cartTax, cartShipping, cartTotal,
    navigateTo, lastOrder, setLastOrder
  } = useShop();

  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Success

  // Shipping Form State
  const [shippingForm, setShippingForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zip: '',
    priority: 'standard' // 'standard' or 'express'
  });

  // Payment Form State
  const [paymentForm, setPaymentForm] = useState({
    cardholder: '',
    number: '',
    expiry: '',
    cvv: ''
  });

  const [isProcessing, setIsProcessing] = useState(false);

  // Form input change handlers
  const handleShippingChange = (e) => {
    setShippingForm({ ...shippingForm, [e.target.name]: e.target.value });
  };

  const handlePaymentChange = (e) => {
    let val = e.target.value;
    if (e.target.name === 'number') {
      // Format spaces for credit card number
      val = val.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim();
    }
    setPaymentForm({ ...paymentForm, [e.target.name]: val });
  };

  // Submit shipping
  const handleShippingSubmit = (e) => {
    e.preventDefault();
    setStep(2);
  };

  // Submit mock payment
  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate server side transaction
    setTimeout(() => {
      setIsProcessing(false);
      const trackingCode = 'LUCKY-' + Math.floor(100000 + Math.random() * 900000);
      
      setLastOrder({
        trackingCode,
        date: new Date().toLocaleDateString(),
        shipping: shippingForm,
        items: [...cart],
        subtotal: cartSubtotal,
        discount: cartDiscountAmount,
        tax: cartTax,
        shippingCost: cartShipping,
        total: cartTotal
      });
      
      clearCart();
      setStep(3);
    }, 2500);
  };

  const triggerPrint = () => {
    window.print();
  };

  if (cart.length === 0 && step !== 3) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-20 text-center">
        <div className="mb-6 mx-auto rounded-full bg-slate-100 p-5 text-slate-400 w-fit">
          <ShoppingBag className="h-10 w-10 text-cyan-500" />
        </div>
        <h3 className="text-xl font-black text-slate-800">Your Cart is Empty</h3>
        <p className="mt-2 text-xs text-slate-500">You must have items in your cart to proceed to checkout.</p>
        <button
          onClick={() => navigateTo('shop')}
          className="mt-6 rounded-xl bg-cyan-600 px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-cyan-500"
        >
          Browse Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
      
      {/* progress stepper */}
      <div className="mb-12 max-w-lg mx-auto flex items-center justify-between text-xs font-bold text-slate-400">
        <div className={`flex flex-col items-center gap-1.5 ${step >= 1 ? 'text-cyan-500' : ''}`}>
          <span className={`h-8 w-8 rounded-full border grid place-items-center ${step >= 1 ? 'border-cyan-500 bg-cyan-500/10' : 'border-slate-200'}`}>1</span>
          <span>Shipping</span>
        </div>
        <div className={`flex-grow h-0.5 mx-2 bg-slate-200 ${step >= 2 ? 'bg-cyan-500' : ''}`} />
        <div className={`flex flex-col items-center gap-1.5 ${step >= 2 ? 'text-cyan-500' : ''}`}>
          <span className={`h-8 w-8 rounded-full border grid place-items-center ${step >= 2 ? 'border-cyan-500 bg-cyan-500/10' : 'border-slate-200'}`}>2</span>
          <span>Secure Payment</span>
        </div>
        <div className={`flex-grow h-0.5 mx-2 bg-slate-200 ${step >= 3 ? 'bg-cyan-500' : ''}`} />
        <div className={`flex flex-col items-center gap-1.5 ${step === 3 ? 'text-cyan-500' : ''}`}>
          <span className={`h-8 w-8 rounded-full border grid place-items-center ${step === 3 ? 'border-cyan-500 bg-cyan-500/10' : 'border-slate-200'}`}>3</span>
          <span>Success</span>
        </div>
      </div>

      {/* CORE DISPLAY STAGES */}
      <AnimatePresence mode="wait">
        
        {/* STAGE 1: SHIPPING & CONTACT */}
        {step === 1 && (
          <motion.div
            key="stage-shipping"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr]"
          >
            {/* Left Shipping Form */}
            <form onSubmit={handleShippingSubmit} className="space-y-6 rounded-[2.5rem] border border-slate-200 bg-white p-6 sm:p-8 shadow-xl">
              <div>
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-cyan-500" />
                  Project Dispatch Address
                </h2>
                <p className="text-[11px] text-slate-400 mt-1">Specify where your certified electrical hardware should be shipped.</p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={shippingForm.fullName}
                    onChange={handleShippingChange}
                    className="premium-input"
                    placeholder="E.g. Marcus Vance"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={shippingForm.email}
                    onChange={handleShippingChange}
                    className="premium-input"
                    placeholder="marcus@vancepower.com"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Phone Contact</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={shippingForm.phone}
                    onChange={handleShippingChange}
                    className="premium-input"
                    placeholder="+1 (800) 555-0199"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Delivery Address</label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={shippingForm.address}
                    onChange={handleShippingChange}
                    className="premium-input"
                    placeholder="1042 Industrial Pkwy, Ste 3B"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">City / Region</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={shippingForm.city}
                    onChange={handleShippingChange}
                    className="premium-input"
                    placeholder="Portland"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">ZIP / Postcode</label>
                  <input
                    type="text"
                    name="zip"
                    required
                    value={shippingForm.zip}
                    onChange={handleShippingChange}
                    className="premium-input"
                    placeholder="97201"
                  />
                </div>
              </div>

              {/* Delivery Speed Priority */}
              <div className="space-y-2.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Delivery Priority Option</label>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className={`cursor-pointer rounded-2xl border p-4 flex flex-col justify-between h-24 transition duration-200 ${
                    shippingForm.priority === 'standard'
                      ? 'border-cyan-500 bg-cyan-500/10 text-cyan-600'
                      : 'border-slate-200 text-slate-400'
                  }`}>
                    <input 
                      type="radio" 
                      name="priority" 
                      value="standard" 
                      checked={shippingForm.priority === 'standard'}
                      onChange={handleShippingChange}
                      className="sr-only"
                    />
                    <span className="text-xs font-black text-slate-800">Insulated Standard Cargo</span>
                    <span className="text-[10px] font-medium mt-1">Ground freight in static-shield boxes. Free over $100.</span>
                  </label>

                  <label className={`cursor-pointer rounded-2xl border p-4 flex flex-col justify-between h-24 transition duration-200 ${
                    shippingForm.priority === 'express'
                      ? 'border-cyan-500 bg-cyan-500/10 text-cyan-600'
                      : 'border-slate-200 text-slate-400'
                  }`}>
                    <input 
                      type="radio" 
                      name="priority" 
                      value="express" 
                      checked={shippingForm.priority === 'express'}
                      onChange={handleShippingChange}
                      className="sr-only"
                    />
                    <span className="text-xs font-black text-slate-800">Premium Air Express</span>
                    <span className="text-[10px] font-medium mt-1">Insured express dispatch with depot priority. (Add $15)</span>
                  </label>
                </div>
              </div>

              {/* Submit to Step 2 */}
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-600 py-4 text-xs font-black tracking-wider uppercase text-white shadow-lg shadow-cyan-600/10 hover:bg-cyan-500"
              >
                Proceed to Secure Payment
                <ChevronRight className="h-4 w-4" />
              </button>
            </form>

            {/* Right Summary column */}
            <aside className="rounded-[2rem] border border-slate-200 bg-slate-50/50 p-6 h-fit space-y-4 shadow-sm">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-800">Order Summary</h3>
              
              <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 space-y-3">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex gap-3 text-xs py-2">
                    <img src={item.product.image} alt={item.product.name} className="h-10 w-10 rounded-lg object-cover" />
                    <div className="flex-grow">
                      <p className="font-bold text-slate-800 line-clamp-1">{item.product.name}</p>
                      <p className="text-[10px] text-slate-500">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-bold text-slate-850">${(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-200 pt-4 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold">${cartSubtotal.toFixed(2)}</span>
                </div>
                {promoDiscount > 0 && (
                  <div className="flex justify-between text-cyan-600">
                    <span>Discount ({promoDiscount}%)</span>
                    <span>-${cartDiscountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Taxes (8%)</span>
                  <span className="font-bold">${cartTax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-bold">
                    {cartShipping === 0 ? 'FREE' : `$${cartShipping.toFixed(2)}`}
                  </span>
                </div>
                
                <div className="border-t border-slate-200 pt-3 flex justify-between text-base font-black text-slate-900">
                  <span>Total Due</span>
                  <span>${(cartTotal + (shippingForm.priority === 'express' ? 15 : 0)).toFixed(2)}</span>
                </div>
              </div>
            </aside>
          </motion.div>
        )}

        {/* STAGE 2: HAPTIC SECURE PAYMENT */}
        {step === 2 && (
          <motion.div
            key="stage-payment"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]"
          >
            {/* Payment Input form */}
            <form onSubmit={handlePaymentSubmit} className="space-y-6 rounded-[2.5rem] border border-slate-200 bg-white p-6 sm:p-8 shadow-xl">
              <div>
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-cyan-500" />
                  Secure Haptic Payment
                </h2>
                <p className="text-[11px] text-slate-400 mt-1">Processed using certified bank-level encrypted frameworks.</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Cardholder Name</label>
                  <input
                    type="text"
                    name="cardholder"
                    required
                    value={paymentForm.cardholder}
                    onChange={handlePaymentChange}
                    className="premium-input"
                    placeholder="Marcus Vance"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Credit Card Number</label>
                  <input
                    type="text"
                    name="number"
                    required
                    maxLength="19"
                    value={paymentForm.number}
                    onChange={handlePaymentChange}
                    className="premium-input"
                    placeholder="4111 2222 3333 4444"
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Expiration Date</label>
                    <input
                      type="text"
                      name="expiry"
                      required
                      maxLength="5"
                      value={paymentForm.expiry}
                      onChange={handlePaymentChange}
                      className="premium-input"
                      placeholder="MM/YY"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">CVV / Code</label>
                    <input
                      type="password"
                      name="cvv"
                      required
                      maxLength="3"
                      value={paymentForm.cvv}
                      onChange={handlePaymentChange}
                      className="premium-input"
                      placeholder="123"
                    />
                  </div>
                </div>
              </div>

              {/* Security Badge */}
              <div className="rounded-2xl bg-cyan-500/10 border border-cyan-500/20 p-4 flex items-center gap-3 text-cyan-600">
                <ShieldCheck className="h-6 w-6 shrink-0" />
                <p className="text-[10px] leading-4">
                  <strong>Encrypted Guard Activated</strong>: Lucky Electrical does not hold your physical details. Transactions are resolved in isolated browser session blocks.
                </p>
              </div>

              {/* Action Toggles */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="rounded-2xl border border-slate-200 px-6 py-4 text-xs font-bold text-slate-600 hover:text-slate-900"
                >
                  Go Back
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="flex-grow flex items-center justify-center gap-2 rounded-2xl bg-cyan-600 py-4 text-xs font-black tracking-wider uppercase text-white shadow-xl shadow-cyan-600/10 hover:shadow-cyan-600/25 transition hover:bg-cyan-500 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Auditing transaction credentials...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Process Payment of ${(cartTotal + (shippingForm.priority === 'express' ? 15 : 0)).toFixed(2)}
                    </span>
                  )}
                </button>
              </div>
            </form>

            {/* Visual mock credit card */}
            <div className="space-y-6">
              <div className="text-center md:text-left text-xs font-black uppercase tracking-wider text-slate-400">
                Live Credential Rendering
              </div>
              
              {/* Custom micro-styled physical-looking debit card */}
              <motion.div
                whileHover={{ rotateY: 5, rotateX: -5 }}
                transition={{ duration: 0.5 }}
                className="relative h-48 w-full max-w-sm mx-auto rounded-3xl border border-slate-200 bg-white p-6 text-slate-900 shadow-2xl shadow-slate-100 overflow-hidden"
              >
                {/* Chip illustration */}
                <div className="absolute right-6 top-6 h-10 w-12 rounded-lg bg-yellow-500/20 border border-yellow-500/40 grid place-items-center">
                  <Sparkles className="h-5 w-5 text-yellow-500/60" />
                </div>
                
                <div className="absolute bottom-6 left-6 space-y-4 w-full pr-12">
                  <div className="text-xl tracking-[0.2em] font-mono leading-none min-h-[24px] text-slate-900">
                    {paymentForm.number || '•••• •••• •••• ••••'}
                  </div>
                  
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Cardholder</p>
                      <p className="text-xs font-bold font-mono tracking-wider min-h-[16px] text-slate-900">
                        {paymentForm.cardholder.toUpperCase() || 'MARCUS VANCE'}
                      </p>
                    </div>
                    <div className="pr-6">
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Expires</p>
                      <p className="text-xs font-bold font-mono tracking-wider min-h-[16px] text-slate-900">
                        {paymentForm.expiry || 'MM/YY'}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* STAGE 3: ORDER SUCCESS INVOICE RECEIPT */}
        {step === 3 && lastOrder && (
          <motion.div
            key="stage-success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto space-y-6"
          >
            {/* Visual celebration block */}
            <div className="text-center space-y-3">
              <div className="mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/25 p-4 w-fit">
                <CheckCircle2 className="h-10 w-10 text-emerald-500 animate-bounce" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Order Dispatched Successfully!</h2>
              <p className="text-xs text-slate-500">Your static-isolated packaging has been labeled and scheduled for dispatch.</p>
            </div>

            {/* high-fidelity receipt mockup */}
            <div id="lucky-invoice" className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xl space-y-6">
              
              {/* Receipt brand header */}
              <div className="flex justify-between items-start border-b border-slate-100 pb-5">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold bg-cyan-600 text-white rounded-lg p-1.5">⚡</span>
                  <div>
                    <h4 className="text-sm font-black text-slate-900">Lucky Electrical Marketplace</h4>
                    <p className="text-[9px] text-slate-400">Certified Hardware Terminal #832</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-cyan-600">RECEIPT INVOICE</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Tracking: {lastOrder.trackingCode}</p>
                </div>
              </div>

              {/* Billing coordinates */}
              <div className="grid gap-6 sm:grid-cols-2 text-xs">
                <div>
                  <p className="font-bold text-slate-400 uppercase tracking-widest text-[9px] mb-1">Shipping Target</p>
                  <p className="font-extrabold text-slate-800">{lastOrder.shipping.fullName}</p>
                  <p className="text-slate-500 mt-0.5">{lastOrder.shipping.address}</p>
                  <p className="text-slate-500">{lastOrder.shipping.city}, {lastOrder.shipping.zip}</p>
                </div>
                <div>
                  <p className="font-bold text-slate-400 uppercase tracking-widest text-[9px] mb-1">Receipt Particulars</p>
                  <p className="text-slate-500">Date Issued: <strong>{lastOrder.date}</strong></p>
                  <p className="text-slate-500">Project Contact: <strong>{lastOrder.shipping.email}</strong></p>
                  <p className="text-slate-500">Method: <strong>Secure Card (Encrypted)</strong></p>
                </div>
              </div>

              {/* Items List */}
              <div className="overflow-hidden rounded-xl border border-slate-100">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-400 font-bold">
                      <th className="px-4 py-3">Description Particulars</th>
                      <th className="px-4 py-3 text-center">Qty</th>
                      <th className="px-4 py-3 text-right">Price</th>
                      <th className="px-4 py-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150">
                    {lastOrder.items.map((item, idx) => (
                      <tr key={idx} className="font-medium">
                        <td className="px-4 py-3.5 text-slate-900">
                          <p className="font-bold">{item.product.name}</p>
                          <p className="text-[9px] text-slate-400">{item.product.category}</p>
                        </td>
                        <td className="px-4 py-3.5 text-center">{item.quantity}</td>
                        <td className="px-4 py-3.5 text-right">${item.product.price.toFixed(2)}</td>
                        <td className="px-4 py-3.5 text-right font-bold">${(item.product.price * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Billing arithmetic */}
              <div className="border-t border-slate-150 pt-4 flex flex-col items-end text-xs space-y-1.5">
                <div className="flex justify-between w-60">
                  <span className="text-slate-400">Subtotal:</span>
                  <span className="font-bold text-slate-800">${lastOrder.subtotal.toFixed(2)}</span>
                </div>
                {lastOrder.discount > 0 && (
                  <div className="flex justify-between w-60 text-cyan-600">
                    <span>Discount Applied:</span>
                    <span>-${lastOrder.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between w-60">
                  <span className="text-slate-400">Taxes (8%):</span>
                  <span className="font-bold text-slate-800">${lastOrder.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between w-60">
                  <span className="text-slate-400">Insulated Cargo Delivery:</span>
                  <span className="font-bold text-slate-800">
                    {lastOrder.shippingCost === 0 ? 'FREE' : `$${lastOrder.shippingCost.toFixed(2)}`}
                  </span>
                </div>
                {lastOrder.shipping.priority === 'express' && (
                  <div className="flex justify-between w-60 text-cyan-600">
                    <span>Premium Air Surcharge:</span>
                    <span>+$15.00</span>
                  </div>
                )}
                
                <div className="flex justify-between w-60 text-base font-black border-t border-slate-200 pt-3 text-slate-900">
                  <span>Grand Total Paid:</span>
                  <span>${lastOrder.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Action receipts */}
            <div className="flex gap-4">
              <button
                onClick={triggerPrint}
                className="flex items-center gap-2 justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-xs font-bold text-slate-700 hover:text-slate-950"
              >
                <Printer className="h-4.5 w-4.5" />
                Print Physical Invoice
              </button>
              <button
                onClick={() => navigateTo('home')}
                className="flex-grow flex items-center justify-center gap-2 rounded-2xl bg-cyan-600 py-3.5 text-xs font-black tracking-wider uppercase text-white shadow-xl shadow-cyan-600/10 hover:shadow-cyan-600/25 transition hover:bg-cyan-500"
              >
                Return to Homepage
              </button>
            </div>

          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}
