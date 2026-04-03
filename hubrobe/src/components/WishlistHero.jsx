import React from 'react';

const WishlistHero = () => {
  return (
    <section className="relative h-[400px] flex items-center justify-center overflow-hidden bg-gray-100">
      <div className="absolute inset-0 z-0">
        <img 
          src="/assets/banner-shop.jpg" 
          alt="Wishlist Banner" 
          className="w-full h-full object-cover opacity-30"
        />
      </div>
      <div className="relative z-10 text-center px-6">
        <h1 className="text-[64px] md:text-[100px] font-bold text-black leading-none mb-4 font-sofia-pro">
          Wishlist
        </h1>
        <p className="text-[16px] md:text-[18px] text-black/60 font-sofia-pro">
          Because we know just how hard it is to get the size.
        </p>
      </div>
    </section>
  );
};

export default WishlistHero;
