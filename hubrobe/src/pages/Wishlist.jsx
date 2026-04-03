import React, { useState, useEffect } from 'react';
import WishlistHero from '../components/WishlistHero';
import { publicRequest, userRequest } from '../requestMethods';
import ProductCard from '../components/ProductCard';

const Wishlist = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const getWishlist = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const res = await userRequest.get(`/wishlist/find/${user._id}`);
        if (res.data?.products?.length > 0) {
          const productDetails = await Promise.all(
            res.data.products.map(async (p) => {
              const prodRes = await publicRequest.get(`/products/find/${p.productId}`);
              return prodRes.data;
            })
          );
          setProducts(productDetails);
        }
      } catch (err) {
        console.error("Wishlist fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    getWishlist();
  }, []);

  return (
    <div className="flex flex-col w-full bg-white pb-20">
      {/* Hero Section */}
      <WishlistHero />

      {/* Wishlist Content Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24 w-full">
        <h2 className="text-[32px] md:text-[40px] font-bold text-black mb-10 font-gt-walsheim">
          My wishlist
        </h2>

        {/* Table Header Bar */}
        <div className="w-full bg-[#f7f7f7] py-4 px-6 mb-8">
          <span className="text-[12px] font-bold uppercase tracking-widest text-black font-sofia-pro">
            Products ({products.length})
          </span>
        </div>

        {/* Wishlist Content */}
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="px-6">
            <p className="text-[14px] md:text-[15px] text-black/40 font-sofia-pro">
              No products added to the wishlist
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
