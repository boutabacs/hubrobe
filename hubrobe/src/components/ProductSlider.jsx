import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import ProductCard from './ProductCard';
import { publicRequest } from '../requestMethods';

const ProductSlider = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await publicRequest.get("/products");
        setProducts((res.data || []).slice(0, 8));
      } catch (err) {
        console.error("Product slider fetch error:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <section className="py-12 px-6 md:px-12 bg-white">
      {/* Section Header */}
      <div className="text-center mb-12 max-w-2xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-sofia-pro font-semibold text-black mb-4">
          Women’s Clothing
        </h2>
        <p className="text-[13px] md:text-[14px] font-sofia-pro text-black/60 leading-relaxed px-4">
          Because we know just how hard it is to get the size, color and even the garment right in the fashion.
        </p>
      </div>

      {/* Slider Container */}
      <div className="relative group/slider">
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={24}
          slidesPerView={1}
          navigation={{
            nextEl: '.swiper-button-next-product',
            prevEl: '.swiper-button-prev-product',
          }}
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            768: {
              slidesPerView: 3,
            },
            1024: {
              slidesPerView: 4,
            },
          }}
          className="product-swiper"
        >
          {loading
            ? Array.from({ length: 4 }).map((_, idx) => (
                <SwiperSlide key={`skeleton-${idx}`}>
                  <div className="h-[260px] w-full bg-gray-50 animate-pulse rounded-sm" />
                </SwiperSlide>
              ))
            : products.map((product) => (
                <SwiperSlide key={product._id || product.id}>
                  <ProductCard product={product} />
                </SwiperSlide>
              ))}
        </Swiper>

        {/* Custom Navigation Arrows */}
        <button className="swiper-button-prev-product absolute left-[-20px] top-[40%] -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center bg-white border border-gray-100 rounded-full shadow-sm cursor-pointer transition-all hover:bg-black hover:text-white group-hover/slider:left-0 opacity-0 group-hover/slider:opacity-100 hidden md:flex">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
        <button className="swiper-button-next-product absolute right-[-20px] top-[40%] -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center bg-white border border-gray-100 rounded-full shadow-sm cursor-pointer transition-all hover:bg-black hover:text-white group-hover/slider:right-0 opacity-0 group-hover/slider:opacity-100 hidden md:flex">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>
    </section>
  );
};

export default ProductSlider;
