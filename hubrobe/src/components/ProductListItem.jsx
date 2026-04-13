import React, { useState, useEffect } from 'react';
import { FiHeart, FiShoppingBag, FiSearch } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import { userRequest } from '../requestMethods';
import { Link } from "react-router-dom";
import toast from 'react-hot-toast';

const ProductListItem = ({ product }) => {
  const [loading, setLoading] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const user = JSON.parse(sessionStorage.getItem("user"));

  useEffect(() => {
    const checkWishlist = async () => {
      if (user) {
        try {
          const res = await userRequest.get(`/wishlist/find/${user._id}`);
          const exists = res.data?.products?.some((p) => p.productId === product._id);
          setIsInWishlist(exists);
        } catch (err) {}
      }
    };
    checkWishlist();
  }, [product._id, user]);

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Veuillez vous connecter !");
      return;
    }
    setLoading(true);
    try {
      let cartRes;
      try {
        cartRes = await userRequest.get(`/carts/find/${user._id}`);
      } catch (err) {}

      if (cartRes?.data) {
        const existingProductIndex = cartRes.data.products.findIndex(
          (p) => String(p.productId) === String(product._id)
        );

        let newProducts = [...cartRes.data.products];
        if (existingProductIndex > -1) {
          newProducts[existingProductIndex].quantity += 1;
        } else {
          newProducts.push({ productId: product._id, quantity: 1 });
        }

        await userRequest.put(`/carts/${cartRes.data._id}`, {
          products: newProducts,
        });
      } else {
        await userRequest.post("/carts", {
          userId: user._id,
          products: [{ productId: product._id, quantity: 1 }],
        });
      }
      window.dispatchEvent(new CustomEvent("cartUpdated"));
      toast.success("Produit ajouté au panier !");
    } catch (err) {
      console.error("Cart error:", err);
      toast.error("Erreur lors de l'ajout au panier.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToWishlist = async () => {
    const user = JSON.parse(sessionStorage.getItem("user") || "null");
    if (!user) {
      toast.error("Veuillez vous connecter !");
      return;
    }
    try {
      let wishlistRes;
      try {
        wishlistRes = await userRequest.get(`/wishlist/find/${user._id}`);
      } catch (err) {}

      let newProducts = wishlistRes?.data?.products || [];
      const exists = newProducts.some((p) => p.productId === product._id);

      if (!exists) {
        newProducts.push({ productId: product._id });
        await userRequest.post("/wishlist", { products: newProducts });
        setIsInWishlist(true);
        toast.success("Produit ajouté aux favoris !");
      } else {
        newProducts = newProducts.filter((p) => p.productId !== product._id);
        await userRequest.post("/wishlist", { products: newProducts });
        setIsInWishlist(false);
        toast.success("Produit retiré des favoris.");
      }
    } catch (err) {
      console.error("Wishlist error:", err);
      toast.error("Erreur lors de la mise à jour des favoris.");
    }
  };

  const price = typeof product.price === 'number' ? product.price : product.price?.current;
  const mainImage = Array.isArray(product.img) ? product.img[0] : (product.img || (product.images && product.images[0]));
  const productId = product?._id || product?.id;
  const isOutOfStock = product.countInStock <= 0;

  return (
    <div className="flex flex-col md:flex-row gap-8 py-8 border-b border-gray-100 group">
      {/* Image Section */}
      <div className="w-full md:w-[300px] aspect-[4/5] bg-gray-100 overflow-hidden relative">
        <Link to={`/product/${productId}`}>
          <img 
            src={mainImage} 
            alt={product.title} 
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${isOutOfStock ? 'opacity-50 grayscale-[0.5]' : ''}`}
          />
        </Link>
        {isOutOfStock && (
          <div className="absolute top-4 left-4 z-10">
            <span className="bg-black text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-sm">
              Out of Stock
            </span>
          </div>
        )}
        <button 
          onClick={handleAddToWishlist}
          className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center shadow-sm transition-all z-10 ${
            isInWishlist ? 'bg-black text-red-500' : 'bg-black text-white hover:bg-white hover:text-black'
          }`}
        >
          {isInWishlist ? <FaHeart size={16} /> : <FiHeart size={16} />}
        </button>
      </div>

      {/* Content Section */}
      <div className="flex-1 flex flex-col justify-center gap-4">
        <div className="flex flex-col gap-2">
          <Link to={`/product/${productId}`}>
            <h3 className="text-[20px] md:text-[24px] font-bold text-black font-gt-walsheim hover:opacity-60 transition-opacity">
              {product.title}
            </h3>
          </Link>
          <div className="flex flex-col gap-1">
            <span className="text-[18px] md:text-[20px] font-bold text-black font-sofia-pro">
              ${price?.toFixed(2)}
            </span>
            <div className={`text-[12px] font-bold uppercase tracking-widest font-sofia-pro ${isOutOfStock ? 'text-red-500' : 'text-black/40'}`}>
              {isOutOfStock ? 'Out of Stock' : 'In Stock'}
            </div>
          </div>
        </div>
        
        <p className="text-[14px] md:text-[16px] text-black/60 font-sofia-pro leading-relaxed max-w-2xl">
          {product.desc || "Besides, random text risks to be unintendedly humorous or offensive, an unacceptable risk in corporate environments and its many variants have been employed."}
        </p>

        <div className="flex items-center gap-4 mt-2">
          <button 
            onClick={handleAddToCart}
            disabled={loading || isOutOfStock}
            className={`bg-black text-white px-8 py-3.5 text-[12px] font-bold uppercase tracking-widest hover:bg-black/80 transition-all font-sofia-pro flex items-center justify-center gap-3 ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : 'disabled:bg-black/40'}`}
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <FiShoppingBag size={16} />
                {isOutOfStock ? "Out of Stock" : "Add to Cart"}
              </>
            )}
          </button>
          <Link 
            to={`/product/${productId}`}
            className="w-12 h-12 border border-gray-100 flex items-center justify-center hover:border-black transition-all"
          >
            <FiSearch className="text-black" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductListItem;