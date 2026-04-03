import React, { useEffect, useMemo, useRef, useState } from 'react';
import CheckoutHero from '../components/CheckoutHero';
import { FiTag, FiChevronRight } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { publicRequest, userRequest } from '../requestMethods';

const Checkout = () => {
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const navigate = useNavigate();
  const formRef = useRef(null);

  const [cart, setCart] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [showCouponInput, setShowCouponInput] = useState(false);

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }, []);

  const subtotal = useMemo(() => {
    return items.reduce((acc, item) => acc + (Number(item.price) || 0) * (item.quantity || 0), 0);
  }, [items]);

  const discountAmount = useMemo(() => {
    if (!appliedCoupon) return 0;
    return appliedCoupon.discountType === "percentage" 
      ? (subtotal * appliedCoupon.discount) / 100 
      : appliedCoupon.discount;
  }, [appliedCoupon, subtotal]);

  const finalTotal = subtotal - discountAmount;

  useEffect(() => {
    const savedCoupon = sessionStorage.getItem("appliedCoupon");
    if (savedCoupon) {
      setAppliedCoupon(JSON.parse(savedCoupon));
    }

    const fetchCheckoutCart = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const res = await userRequest.get(`/carts/find/${user._id}`);
        setCart(res.data || null);

        const cartProducts = res.data?.products || [];
        if (!cartProducts.length) {
          setItems([]);
          return;
        }

        const results = await Promise.allSettled(
          cartProducts.map((p) =>
            publicRequest.get(`/products/find/${p.productId}`).then((prodRes) => ({
              ...prodRes.data,
              quantity: p.quantity,
            }))
          )
        );

        const productDetails = results
          .filter((r) => r.status === "fulfilled" && r.value)
          .map((r) => r.value)
          .filter((p) => p && p._id);

        setItems(productDetails);
      } catch (err) {
        console.error("Checkout cart fetch error:", err);
        setError(err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCheckoutCart();
  }, [user]);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    const cleanCode = couponCode.trim().toUpperCase();
    if (!cleanCode) return;
    setCouponError("");
    try {
      const queryParams = new URLSearchParams();
      if (user?._id) queryParams.append("userId", user._id);
      if (user?.email) queryParams.append("email", user.email);
      
      const res = await publicRequest.get(`/coupons/validate/${cleanCode}?${queryParams.toString()}`);
      setAppliedCoupon(res.data);
      sessionStorage.setItem("appliedCoupon", JSON.stringify(res.data));
      setCouponCode("");
      setShowCouponInput(false);
      alert("Coupon applied successfully!");
    } catch (err) {
      const errorMsg = err.response?.data || "Invalid or expired coupon code.";
      setCouponError(errorMsg);
      setAppliedCoupon(null);
      sessionStorage.removeItem("appliedCoupon");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    sessionStorage.removeItem("appliedCoupon");
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!user) return;
    if (!cart?._id || !items.length) return;
    if (!formRef.current) return;

    try {
      const fd = new FormData(formRef.current);
      const address = {
        firstName: fd.get("firstName") || "",
        lastName: fd.get("lastName") || "",
        companyName: fd.get("companyName") || "",
        country: fd.get("country") || "",
        streetAddress: fd.get("streetAddress") || "",
        apartment: fd.get("apartment") || "",
        city: fd.get("city") || "",
        state: fd.get("state") || "",
        zipCode: fd.get("zipCode") || "",
        phone: fd.get("phone") || "",
        email: fd.get("email") || "",
      };

      const payload = {
        userId: user._id,
        products: cart.products,
        amount: finalTotal,
        couponCode: appliedCoupon?.code,
        discountAmount: discountAmount,
        address,
        status: "pending",
      };

      const orderRes = await userRequest.post("/orders", payload);
      const savedOrder = orderRes.data;

      // Best-effort: clear the cart after ordering
      try {
        await userRequest.delete(`/carts/${cart._id}`);
        sessionStorage.removeItem("appliedCoupon");
      } catch {}

      localStorage.setItem("lastOrder", JSON.stringify(savedOrder));
      localStorage.setItem("lastPaymentMethod", paymentMethod);

      navigate("/order-received");
    } catch (err) {
      console.error("Place order error:", err);
      setError(err);
    }
  };

  return (
    <div className="flex flex-col w-full bg-white pb-20 md:pb-32">
      {/* Hero Section */}
      <CheckoutHero />

      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full mt-10">
        {/* Coupon Notice */}
        <div className="bg-[#f7f7f7] p-5 mb-10 border-t-2 border-black">
          {!appliedCoupon ? (
            <>
              <div className="flex items-center gap-3">
                <FiTag className="text-black/40" />
                <p className="text-[14px] font-sofia-pro text-black/60">
                  Have a coupon? <button onClick={() => setShowCouponInput(!showCouponInput)} className="text-black font-bold hover:underline">Click here to enter your code</button>
                </p>
              </div>
              {showCouponInput && (
                <form onSubmit={handleApplyCoupon} className="mt-4 flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <input 
                      type="text" 
                      placeholder="Coupon code" 
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="w-full border border-gray-200 p-4 outline-none focus:border-black transition-colors font-sofia-pro text-[14px]"
                    />
                    {couponError && <p className="text-red-500 text-[12px] mt-2 font-sofia-pro">{couponError}</p>}
                  </div>
                  <button type="submit" className="px-10 py-4 bg-black text-white text-[12px] font-bold uppercase tracking-widest hover:bg-black/80 transition-all font-sofia-pro">
                    Apply Coupon
                  </button>
                </form>
              )}
            </>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FiTag className="text-green-600" />
                <p className="text-[14px] font-sofia-pro text-black/60">
                  Coupon <span className="text-black font-bold uppercase tracking-widest">"{appliedCoupon.code}"</span> applied!
                </p>
              </div>
              <button onClick={handleRemoveCoupon} className="text-[12px] font-bold uppercase tracking-widest text-black/40 hover:text-black transition-colors font-sofia-pro underline">
                Remove
              </button>
            </div>
          )}
        </div>

        {/* Checkout Steps */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-20 mb-20 border-b border-gray-100 pb-12">
          <div className="flex items-center gap-4">
            <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-[13px] font-bold">1</span>
            <span className="text-[14px] md:text-[15px] font-bold text-black uppercase tracking-widest font-sofia-pro">Shopping Cart</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-[13px] font-bold">2</span>
            <span className="text-[14px] md:text-[15px] font-bold text-black uppercase tracking-widest font-sofia-pro">Payment</span>
          </div>
          <div className="flex items-center gap-4 opacity-30">
            <span className="w-8 h-8 rounded-full border border-black flex items-center justify-center text-[13px] font-bold">3</span>
            <span className="text-[14px] md:text-[15px] font-bold text-black uppercase tracking-widest font-sofia-pro">Order Received</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">
          {/* Left Column: Billing Details */}
          <div className="flex-1 w-full">
            <h2 className="text-[28px] md:text-[32px] font-bold text-black mb-10 font-gt-walsheim">
              Billing details
            </h2>
            <form id="checkoutForm" ref={formRef} onSubmit={handlePlaceOrder} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-bold uppercase tracking-widest text-black font-sofia-pro">First name <span className="text-red-500">*</span></label>
                <input name="firstName" type="text" className="w-full border border-gray-100 p-4 outline-none focus:border-black transition-colors font-sofia-pro text-[14px]" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-bold uppercase tracking-widest text-black font-sofia-pro">Last name <span className="text-red-500">*</span></label>
                <input name="lastName" type="text" className="w-full border border-gray-100 p-4 outline-none focus:border-black transition-colors font-sofia-pro text-[14px]" />
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-[13px] font-bold uppercase tracking-widest text-black font-sofia-pro">Company name (optional)</label>
                <input name="companyName" type="text" className="w-full border border-gray-100 p-4 outline-none focus:border-black transition-colors font-sofia-pro text-[14px]" />
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-[13px] font-bold uppercase tracking-widest text-black font-sofia-pro">Country / Region <span className="text-red-500">*</span></label>
                <select name="country" className="w-full border border-gray-100 p-4 outline-none focus:border-black transition-colors font-sofia-pro text-[14px] bg-white appearance-none">
                  <option>United States (US)</option>
                  <option>France</option>
                  <option>United Kingdom</option>
                </select>
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-[13px] font-bold uppercase tracking-widest text-black font-sofia-pro">Street address <span className="text-red-500">*</span></label>
                <input name="streetAddress" type="text" placeholder="House number and street name" className="w-full border border-gray-100 p-4 mb-2 outline-none focus:border-black transition-colors font-sofia-pro text-[14px]" />
                <input name="apartment" type="text" placeholder="Apartment, suite, unit, etc. (optional)" className="w-full border border-gray-100 p-4 outline-none focus:border-black transition-colors font-sofia-pro text-[14px]" />
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-[13px] font-bold uppercase tracking-widest text-black font-sofia-pro">Town / City <span className="text-red-500">*</span></label>
                <input name="city" type="text" className="w-full border border-gray-100 p-4 outline-none focus:border-black transition-colors font-sofia-pro text-[14px]" />
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-[13px] font-bold uppercase tracking-widest text-black font-sofia-pro">State <span className="text-red-500">*</span></label>
                <select name="state" className="w-full border border-gray-100 p-4 outline-none focus:border-black transition-colors font-sofia-pro text-[14px] bg-white appearance-none">
                  <option>New York</option>
                  <option>California</option>
                  <option>Texas</option>
                </select>
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-[13px] font-bold uppercase tracking-widest text-black font-sofia-pro">ZIP Code <span className="text-red-500">*</span></label>
                <input name="zipCode" type="text" className="w-full border border-gray-100 p-4 outline-none focus:border-black transition-colors font-sofia-pro text-[14px]" />
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-[13px] font-bold uppercase tracking-widest text-black font-sofia-pro">Phone <span className="text-red-500">*</span></label>
                <input name="phone" type="tel" className="w-full border border-gray-100 p-4 outline-none focus:border-black transition-colors font-sofia-pro text-[14px]" />
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-[13px] font-bold uppercase tracking-widest text-black font-sofia-pro">Email address <span className="text-red-500">*</span></label>
                <input name="email" type="email" className="w-full border border-gray-100 p-4 outline-none focus:border-black transition-colors font-sofia-pro text-[14px]" />
              </div>
            </form>
          </div>

          {/* Right Column: Order & Payment */}
          <div className="lg:w-[450px] w-full bg-[#fcfcfc] p-8 md:p-12 border border-gray-50">
            <h2 className="text-[24px] md:text-[28px] font-bold text-black mb-10 font-gt-walsheim">
              Your order
            </h2>
            
            {/* Products List */}
            <div className="flex flex-col gap-6 mb-10 pb-10 border-b border-gray-100">
              {loading ? (
                <div className="flex flex-col gap-4">
                  {Array.from({ length: 3 }).map((_, idx) => (
                    <div key={`ck-${idx}`} className="h-[18px] bg-gray-100 animate-pulse rounded-sm" />
                  ))}
                </div>
              ) : items.length === 0 ? (
                <div className="text-[14px] text-black/40 font-sofia-pro">
                  Cart is empty.
                </div>
              ) : (
                items.map((item) => (
                  <div key={item._id || item.id} className="flex justify-between items-center text-[14px] md:text-[15px] font-sofia-pro">
                    <span className="text-black/60">{item.title} <span className="font-bold text-black">× {item.quantity}</span></span>
                    <span className="font-bold text-black">${(Number(item.price) * item.quantity).toFixed(2)}</span>
                  </div>
                ))
              )}
            </div>

            {/* Totals */}
            <div className="flex flex-col gap-6 mb-10 pb-10 border-b border-gray-100">
              <div className="flex justify-between items-center text-[14px] md:text-[15px] font-sofia-pro">
                <span className="font-bold uppercase tracking-widest text-black">Subtotal</span>
                <span className="font-bold text-black">${subtotal.toFixed(2)}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between items-center text-[14px] md:text-[15px] font-sofia-pro text-green-600">
                  <span className="font-bold uppercase tracking-widest">Discount ({appliedCoupon.code})</span>
                  <span className="font-bold">-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-[14px] md:text-[15px] font-sofia-pro">
                <span className="font-bold uppercase tracking-widest text-black">Shipping</span>
                <span className="text-black/60">Free shipping</span>
              </div>
              <div className="flex justify-between items-center text-[18px] md:text-[24px] font-gt-walsheim">
                <span className="font-bold text-black">Total</span>
                <span className="font-bold text-black">${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Section */}
            <div className="flex flex-col gap-6 mb-10">
              <h3 className="text-[18px] md:text-[20px] font-bold text-black font-gt-walsheim">Payment</h3>
              
              <div className="flex flex-col gap-4">
                <label className="flex flex-col gap-4 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <input 
                      type="radio" 
                      name="payment" 
                      checked={paymentMethod === 'cod'} 
                      readOnly
                      className="accent-black w-4 h-4"
                    />
                    <span className="text-[14px] md:text-[15px] font-bold text-black font-sofia-pro">Cash on delivery</span>
                  </div>
                  <div className="bg-gray-50 p-4 text-[13px] text-black/60 font-sofia-pro leading-relaxed">
                    Pay with cash upon delivery.
                  </div>
                </label>
              </div>
            </div>

            {/* Privacy Policy */}
            <p className="text-[13px] text-black/60 font-sofia-pro leading-relaxed mb-10">
              Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our <button className="text-black font-bold hover:underline">privacy policy</button>.
            </p>

            {/* Place Order Button */}
            <button
              type="submit"
              form="checkoutForm"
              disabled={loading || !items.length}
              className="w-full py-6 bg-black text-white text-[13px] font-bold uppercase tracking-widest font-sofia-pro hover:bg-black/80 transition-all flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
