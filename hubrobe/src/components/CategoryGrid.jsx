import React from 'react';

const CategoryGrid = () => {
  return (
    <section className="w-full bg-white py-16 px-6 md:px-12">
      {/* Header Text */}
      <div className="text-center mb-12 max-w-2xl mx-auto">
        <h2 className="text-black text-[32px] font-black tracking-tight font-sofia-pro mb-4">
          #stayhome
        </h2>
        <p className="text-gray-500 text-[15px] leading-relaxed font-normal font-sofia-pro">
          Because we know just how hard it is to get the size, color and even the garment right in the fashion.
        </p>
      </div>

      {/* Grid Layout */}
      <div className="max-w-[1920px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Large Left Item (Casual Wear) */}
        <div className="md:col-span-2 relative group overflow-hidden h-[400px] md:h-[600px]">
          <img 
            src="/assets/stay2.jpg" 
            alt="Casual Wear" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 flex items-end justify-center pb-8">
            <button className="bg-white text-black px-8 py-3 text-[12px] font-bold tracking-[0.1em] uppercase shadow-sm hover:bg-black hover:text-white transition-all duration-300">
              CASUAL WEAR
            </button>
          </div>
        </div>

        {/* Middle Stack (Accessories & Shirts) */}
        <div className="flex flex-col gap-6">
          {/* Top: Accessories */}
          <div className="relative group overflow-hidden h-[290px]">
            <img 
              src="/assets/stay4.jpg" 
              alt="Accessories" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="bg-white text-black px-6 py-2.5 text-[11px] font-bold tracking-[0.1em] uppercase shadow-sm hover:bg-black hover:text-white transition-all duration-300">
                ACCESSORIES
              </button>
            </div>
          </div>
          {/* Bottom: Shop Shirts */}
          <div className="relative group overflow-hidden h-[290px]">
            <img 
              src="/assets/stay3.jpg" 
              alt="Shop Shirts" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-end justify-center pb-6">
              <button className="bg-white text-black px-6 py-2.5 text-[11px] font-bold tracking-[0.1em] uppercase shadow-sm hover:bg-black hover:text-white transition-all duration-300">
                SHOP SHIRTS
              </button>
            </div>
          </div>
        </div>

        {/* Large Right Item (Top Dresses) */}
        <div className="relative group overflow-hidden h-[400px] md:h-[600px]">
          <img 
            src="/assets/stay.jpg" 
            alt="Top Dresses" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 flex items-end justify-center pb-8">
            <button className="bg-white text-black px-8 py-3 text-[12px] font-bold tracking-[0.1em] uppercase shadow-sm hover:bg-black hover:text-white transition-all duration-300">
              TOP DRESSES
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default CategoryGrid;
