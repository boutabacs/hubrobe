import React, { useState, useEffect } from 'react';
import CartHero from '../components/CartHero';
import CartItem from '../components/CartItem';
import { publicRequest, userRequest } from '../requestMethods';
import { FiArrowRight, FiTruck } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    // Check for existing coupon in sessionStorage
    const savedCoupon = sessionStorage.getItem("appliedCoupon");
    if (savedCoupon) {
      setAppliedCoupon(JSON.parse(savedCoupon));
    }

    const getCart = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const res = await userRequest.get(`/carts/find/${user._id}`);
        setCart(res.data);
        
        if (res.data?.products?.length > 0) {
          const results = await Promise.allSettled(
            res.data.products.map((p) =>
              publicRequest.get(`/products/find/${p.productId}`).then((prodRes) => ({
                ...prodRes.data,
                quantity: p.quantity,
              }))
            )
          );
          const productDetails = results
            .filter((r) => r.status === "fulfilled" && r.value)
            .map((r) => r.value)
            .filter((item) => item && item._id);
          setProducts(productDetails);
        }
      } catch (err) {
        console.error("Cart fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    getCart();
  }, []);

  const subtotal = products.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const discountAmount = appliedCoupon 
    ? (appliedCoupon.discountType === "percentage" 
        ? (subtotal * appliedCoupon.discount) / 100 
        : appliedCoupon.discount) 
    : 0;
  
  const finalTotal = subtotal - discountAmount;

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode) return;
    setCouponError("");
    try {
      const res = await publicRequest.get(`/coupons/validate/${couponCode}`);
      setAppliedCoupon(res.data);
      sessionStorage.setItem("appliedCoupon", JSON.stringify(res.data));
      setCouponCode("");
      alert("Coupon applied successfully!");
    } catch (err) {
      setCouponError("Invalid or expired coupon code.");
      setAppliedCoupon(null);
      sessionStorage.removeItem("appliedCoupon");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    sessionStorage.removeItem("appliedCoupon");
    setCouponCode("");
  };

  const handleUpdateCart = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      const updatedProducts = cart.products.map(p => 
        p.productId === productId ? { ...p, quantity: newQuantity } : p
      );
      await userRequest.put(`/carts/${cart._id}`, { products: updatedProducts });
      setProducts(prev => prev.map(p => 
        p._id === productId ? { ...p, quantity: newQuantity } : p
      ));
      setCart(prev => ({ ...prev, products: updatedProducts }));
      window.dispatchEvent(new CustomEvent("cartUpdated"));
    } catch (err) {
      console.error("Update cart error:", err);
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      const updatedProducts = cart.products.filter(p => p.productId !== productId);
      await userRequest.put(`/carts/${cart._id}`, { products: updatedProducts });
      setProducts(prev => prev.filter(p => p._id !== productId));
      setCart(prev => ({ ...prev, products: updatedProducts }));
      window.dispatchEvent(new CustomEvent("cartUpdated"));
    } catch (err) {
      console.error("Remove item error:", err);
    }
  };

  return (
    <div className="flex flex-col w-full bg-white pb-20 md:pb-32">
      {/* Hero Section */}
      <CartHero />

      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full mt-16 md:mt-24">
        {/* Checkout Steps */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-20 mb-20 border-b border-gray-100 pb-12">
          <div className="flex items-center gap-4">
            <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-[13px] font-bold">1</span>
            <span className="text-[14px] md:text-[15px] font-bold text-black uppercase tracking-widest font-sofia-pro">Shopping Cart</span>
          </div>
          <div className="flex items-center gap-4 opacity-30">
            <span className="w-8 h-8 rounded-full border border-black flex items-center justify-center text-[13px] font-bold">2</span>
            <span className="text-[14px] md:text-[15px] font-bold text-black uppercase tracking-widest font-sofia-pro">Payment</span>
          </div>
          <div className="flex items-center gap-4 opacity-30">
            <span className="w-8 h-8 rounded-full border border-black flex items-center justify-center text-[13px] font-bold">3</span>
            <span className="text-[14px] md:text-[15px] font-bold text-black uppercase tracking-widest font-sofia-pro">Order Received</span>
          </div>
        </div>

        {/* Cart Table Header */}
        <div className="hidden md:grid grid-cols-12 bg-[#f7f7f7] py-4 px-6 mb-4">
          <div className="col-span-6"><span className="text-[12px] font-bold uppercase tracking-widest text-black font-sofia-pro">Product ({products.length})</span></div>
          <div className="col-span-2 text-center"><span className="text-[12px] font-bold uppercase tracking-widest text-black font-sofia-pro">Price</span></div>
          <div className="col-span-2 text-center"><span className="text-[12px] font-bold uppercase tracking-widest text-black font-sofia-pro">Quantity</span></div>
          <div className="col-span-2 text-right"><span className="text-[12px] font-bold uppercase tracking-widest text-black font-sofia-pro">Total</span></div>
        </div>

        {/* Cart Items List */}
        <div className="flex flex-col mb-10">
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 text-black/40 font-sofia-pro">
              Your cart is currently empty.
            </div>
          ) : (
            products.map((item) => (
              <CartItem 
                key={item._id} 
                item={item} 
                onUpdate={(qty) => handleUpdateCart(item._id, qty)}
                onRemove={() => handleRemoveItem(item._id)}
              />
            ))
          )}
        </div>

        {/* Coupon & Actions */}
        <div className="flex flex-col lg:flex-row justify-between gap-10 mb-20">
          <div className="flex-1 flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              {!appliedCoupon ? (
                <form onSubmit={handleApplyCoupon} className="relative">
                  <input 
                    type="text" 
                    placeholder="Coupon code" 
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="w-full border border-gray-100 px-6 py-4 text-[14px] font-sofia-pro outline-none focus:border-black transition-colors"
                  />
                  <button type="submit" className="absolute right-6 top-1/2 -translate-y-1/2">
                    <FiArrowRight size={20} />
                  </button>
                </form>
              ) : (
                <div className="flex items-center justify-between border border-green-100 bg-green-50 px-6 py-4 rounded-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-bold text-green-700 font-sofia-pro uppercase tracking-widest">{appliedCoupon.code}</span>
                    <span className="text-[12px] text-green-600 font-sofia-pro">Applied!</span>
                  </div>
                  <button 
                    onClick={handleRemoveCoupon}
                    className="text-[11px] font-bold uppercase tracking-widest text-green-700 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              )}
              {couponError && <p className="text-red-500 text-[12px] mt-2 font-sofia-pro">{couponError}</p>}
            </div>
            <div className="flex gap-4">
              <Link to="/shop" className="px-8 py-4 border border-gray-100 text-[13px] font-bold uppercase tracking-widest text-black hover:border-black transition-all font-sofia-pro flex items-center justify-center">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>

        {/* Cart Total Summary */}
        <div className="flex flex-col lg:flex-row justify-end">
          <div className="lg:w-[450px]">
            <h2 className="text-[24px] md:text-[28px] font-bold text-black mb-10 font-gt-walsheim">
              Cart Total
            </h2>
            <div className="flex flex-col border border-gray-50">
              <div className="flex items-start py-8 px-8 border-b border-gray-50">
                <span className="w-1/3 text-[14px] md:text-[15px] font-bold text-black uppercase tracking-widest font-sofia-pro">Shipping</span>
                <div className="flex-1 flex flex-col gap-4">
                  <span className="text-[14px] md:text-[15px] text-black font-sofia-pro">Free shipping</span>
                  <button className="flex items-center gap-2 text-[14px] font-bold text-black font-sofia-pro hover:opacity-70 transition-opacity">
                    Calculate shipping <FiTruck />
                  </button>
                </div>
              </div>
              <div className="flex justify-between py-8 px-8 border-b border-gray-50 bg-gray-50/30">
                <span className="text-[14px] md:text-[15px] font-bold text-black uppercase tracking-widest font-sofia-pro">Subtotal</span>
                <span className="text-[14px] md:text-[15px] font-bold text-black font-sofia-pro">${subtotal.toFixed(2)}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between py-8 px-8 border-b border-gray-50 bg-green-50/30">
                  <span className="text-[14px] md:text-[15px] font-bold text-green-700 uppercase tracking-widest font-sofia-pro">Discount ({appliedCoupon.code})</span>
                  <span className="text-[14px] md:text-[15px] font-bold text-green-700 font-sofia-pro">-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between py-8 px-8 border-b border-gray-50">
                <span className="text-[14px] md:text-[15px] font-bold text-black uppercase tracking-widest font-sofia-pro">Total</span>
                <span className="text-[18px] md:text-[20px] font-bold text-black font-sofia-pro">${finalTotal.toFixed(2)}</span>
              </div>
            </div>
            <Link to="/checkout" className="w-full mt-10 py-6 bg-black text-white text-[13px] font-bold uppercase tracking-widest font-sofia-pro flex items-center justify-center gap-3 hover:bg-black/80 transition-all group">
              Proceed to Checkout <FiArrowRight className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
