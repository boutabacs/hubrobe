import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { publicRequest, userRequest } from "../requestMethods";
import { FiShoppingBag } from "react-icons/fi";

const SingleProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  })();

  const fetchProduct = async () => {
    try {
      const res = await publicRequest.get(`/products/find/${id}`);
      setProduct(res.data);
    } catch (err) {
      console.error("Single product fetch error:", err);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      alert("Please login to add products to cart!");
      return;
    }

    try {
      const cartRes = await userRequest.get(`/carts/find/${user._id}`).catch(() => null);

      if (cartRes?.data) {
        const existingProductIndex = cartRes.data.products.findIndex(
          (p) => String(p.productId) === String(product._id)
        );

        const newProducts = [...cartRes.data.products];
        if (existingProductIndex > -1) {
          newProducts[existingProductIndex].quantity += 1;
        } else {
          newProducts.push({ productId: product._id, quantity: 1 });
        }

        await userRequest.put(`/carts/${cartRes.data._id}`, { products: newProducts });
      } else {
        await userRequest.post("/carts", {
          userId: user._id,
          products: [{ productId: product._id, quantity: 1 }],
        });
      }

      window.dispatchEvent(new CustomEvent("cartUpdated"));
      alert("Product added to cart!");
    } catch (err) {
      console.error("Add to cart error:", err);
      alert("Failed to add to cart.");
    }
  };

  const mainImage = Array.isArray(product?.img)
    ? product.img[0]
    : product?.img?.[0] || (product?.images && product.images[0]);

  if (loading) {
    return (
      <div className="flex flex-col w-full bg-white pb-20 md:pb-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full mt-16 md:mt-24">
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col w-full bg-white pb-20 md:pb-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full mt-16 md:mt-24">
          <p className="text-center text-black/60 font-sofia-pro">Product not found.</p>
        </div>
      </div>
    );
  }

  const isOutOfStock = product.countInStock <= 0;

  return (
    <div className="flex flex-col w-full bg-white pb-20 md:pb-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full mt-16 md:mt-24">
        <div className="mb-8">
          <Link to="/shop" className="text-[13px] font-bold uppercase tracking-widest text-black/60 hover:text-black transition-colors font-sofia-pro">
            ← Back to shop
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-14">
          <div className="bg-gray-50 rounded-sm overflow-hidden relative">
            <img 
              src={mainImage} 
              alt={product.title} 
              className={`w-full h-auto block ${isOutOfStock ? 'opacity-50 grayscale-[0.5]' : ''}`} 
            />
            {isOutOfStock && (
              <div className="absolute top-6 left-6 z-10">
                <span className="bg-black text-white text-[12px] font-bold uppercase tracking-[0.2em] px-4 py-2 rounded-sm shadow-xl">
                  Out of Stock
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <h1 className="text-[28px] md:text-[38px] font-bold text-black mb-4 font-gt-walsheim uppercase">
              {product.title}
            </h1>

            <div className="flex flex-col gap-2 mb-6">
              <div className="text-[24px] font-bold text-black font-sofia-pro">
                ${Number(product.price).toFixed(2)}
              </div>
              <div className={`text-[12px] font-bold uppercase tracking-[0.2em] font-sofia-pro ${isOutOfStock ? 'text-red-500' : 'text-green-600'}`}>
                {isOutOfStock ? "Out of stock" : "In stock"}
              </div>
            </div>

            <p className="text-[14px] md:text-[15px] text-black/70 font-sofia-pro leading-relaxed mb-8 max-w-xl">
              {product.desc}
            </p>

            {Array.isArray(product.categories) && product.categories.length > 0 && (
              <div className="mb-8">
                <p className="text-[11px] font-bold uppercase tracking-widest text-black/40 font-sofia-pro mb-3">
                  Categories
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.categories.map((c) => (
                    <span key={c} className="px-4 py-1.5 border border-gray-100 text-[11px] font-bold font-sofia-pro text-black/60 uppercase tracking-widest">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-auto flex flex-col gap-4 max-w-sm">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`w-full flex items-center justify-center gap-3 bg-black text-white text-[13px] font-bold uppercase tracking-widest py-5 hover:bg-black/80 transition-all font-sofia-pro shadow-lg ${isOutOfStock ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
              >
                <FiShoppingBag size={18} />
                {isOutOfStock ? "Sold Out" : "Add to cart"}
              </button>

              <Link
                to="/cart"
                className="w-full flex items-center justify-center gap-2 border border-gray-200 text-black text-[13px] font-bold uppercase tracking-widest py-5 hover:border-black hover:bg-gray-50 transition-all font-sofia-pro"
              >
                Go to cart
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;

