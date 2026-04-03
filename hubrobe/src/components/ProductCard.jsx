import React, { useState, useEffect } from 'react';
import { FiHeart, FiShoppingBag, FiSearch } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import { userRequest } from '../requestMethods';
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

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
      alert("Please login to add products to cart!");
      return;
    }
    setLoading(true);
    try {
      // Récupérer le panier actuel
      let cartRes;
      try {
        cartRes = await userRequest.get(`/carts/find/${user._id}`);
      } catch (err) {
        // Panier non existant, on en créera un
      }

      if (cartRes?.data) {
        // Mettre à jour le panier existant
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
        // Créer un nouveau panier
        await userRequest.post("/carts", {
          userId: user._id,
          products: [{ productId: product._id, quantity: 1 }],
        });
      }
      window.dispatchEvent(new CustomEvent("cartUpdated"));
      alert("Product added to cart!");
    } catch (err) {
      console.error("Cart error:", err);
      alert("Failed to add to cart.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToWishlist = async () => {
    if (!user) {
      alert("Please login to add products to wishlist!");
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
        alert("Product added to wishlist!");
      } else {
        newProducts = newProducts.filter((p) => p.productId !== product._id);
        await userRequest.post("/wishlist", { products: newProducts });
        setIsInWishlist(false);
        alert("Product removed from wishlist!");
      }
    } catch (err) {
      console.error("Wishlist error:", err);
    }
  };

  // Déterminer les prix à afficher (Compatible Backend & Mock)
  const price = typeof product.price === 'number' ? product.price : product.price?.current;
  const oldPrice = product.price?.old;
  const minPrice = product.price?.min;
  const maxPrice = product.price?.max;
  
  // Image (Compatible Backend & Mock)
  const mainImage = Array.isArray(product.img) ? product.img[0] : (product.img || (product.images && product.images[0]));
  const hoverImage = Array.isArray(product.img) && product.img[1] ? product.img[1] : ((product.images && product.images[1]) || mainImage);
  const productId = product?._id || product?.id;
  const isOutOfStock = product.countInStock <= 0 || product.inStock === false;

  return (
    <div 
      className="group flex flex-col w-full cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#f7f7f7] mb-6">
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
          {product.isSale && !isOutOfStock && (
            <span className="bg-[#FF3D3D] text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
              Sale!
            </span>
          )}
          {product.discount && !isOutOfStock && (
            <span className="bg-black text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
              {product.discount}% OFF
            </span>
          )}
          {isOutOfStock && (
            <span className="bg-black text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-sm">
              Out of Stock
            </span>
          )}
        </div>

        {/* Wishlist Button on Image */}
        <button 
          onClick={handleAddToWishlist}
          className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center shadow-sm transition-all z-10 ${
            isInWishlist ? 'bg-black text-red-500' : 'bg-black text-white hover:bg-white hover:text-black'
          }`}
        >
          {isInWishlist ? <FaHeart size={14} /> : <FiHeart size={14} />}
        </button>

        {/* Product Image (click -> single product page) */}
        <Link
          to={`/product/${productId}`}
          className="block w-full h-full"
        >
          <img
            src={isHovered ? hoverImage : mainImage}
            alt={product.title}
            className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'} ${isOutOfStock ? 'opacity-50 grayscale-[0.5]' : ''}`}
          />
        </Link>

        {/* Hover Actions */}
        <div
          className={`absolute bottom-6 left-0 w-full px-6 flex flex-col gap-2 transition-all duration-300 ${
            isHovered && !isOutOfStock ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
          }`}
        >
          <button 
            onClick={handleAddToCart}
            disabled={loading || isOutOfStock}
            className="w-full bg-white text-black py-3.5 flex items-center justify-center gap-2 text-[12px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all shadow-xl"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <FiShoppingBag size={16} />
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-start">
          <Link to={`/product/${productId}`}>
            <h3 className="text-[13px] text-black font-sofia-pro font-normal leading-tight hover:underline cursor-pointer">
              {product.title}
            </h3>
          </Link>
        </div>

        {/* Pricing */}
        <div className="flex items-center gap-2 font-sofia-pro text-[13px]">
          {minPrice && maxPrice ? (
            <span className="text-black font-medium">
              ${minPrice.toFixed(2)} – ${maxPrice.toFixed(2)}
            </span>
          ) : (
            <>
              {oldPrice && (
                <span className="text-gray-400 line-through">
                  ${oldPrice.toFixed(2)}
                </span>
              )}
              <span className="text-black font-medium">
                ${price?.toFixed(2)}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
