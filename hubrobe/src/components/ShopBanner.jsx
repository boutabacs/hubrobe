import React from 'react';

const ShopBanner = () => {
  return (
    <section className="relative w-full h-[300px] md:h-[450px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src="/assets/banner-shop.jpg" 
          alt="Shop Banner" 
          className="w-full h-full object-cover"
        />
        {/* Subtle Overlay to improve text readability */}
        <div className="absolute inset-0 bg-black/10"></div>
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 px-6">
        <h1 className="text-[48px] md:text-[80px] font-sofia-pro font-bold text-white tracking-tight leading-none mb-4">
          Party Collection
        </h1>
      </div>
    </section>
  );
};

export default ShopBanner;
