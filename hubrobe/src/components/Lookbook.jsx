import React from 'react';
import { FiInstagram, FiArrowRight } from 'react-icons/fi';

const Lookbook = () => {
  return (
    <section className="py-16 md:py-24 px-6 md:px-12 bg-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Text Content */}
        <div className="lg:col-span-4 flex flex-col items-start text-left">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-6 h-6 border border-orange-500 rounded-md flex items-center justify-center text-orange-500">
              <FiInstagram size={14} />
            </div>
            <span className="text-[12px] font-sofia-pro font-medium text-black">
              Kate Austen #hublookbook
            </span>
          </div>

          <h2 className="text-[36px] md:text-[48px] font-sofia-pro font-semibold text-black leading-tight mb-6">
            S-20 Lookbook Editorial.
          </h2>

          <p className="text-[14px] md:text-[15px] font-sofia-pro text-black/60 leading-relaxed mb-8 max-w-sm">
            Hub offers a range of skincare products that are feminine, delicate and long-lasting with vitamins and nutritions to improve your skin condition.
          </p>

          <a 
            href="#" 
            className="flex items-center gap-3 text-[12px] font-sofia-pro font-bold text-black uppercase tracking-widest group border-b border-black/10 pb-1 hover:border-black transition-all"
          >
            Shop Collection
            <FiArrowRight className="transition-transform group-hover:translate-x-1" />
          </a>
        </div>

        {/* Image 1 - Woman in Hat */}
        <div className="lg:col-span-4">
          <div className="relative rounded-lg overflow-hidden aspect-[4/5] md:aspect-auto">
            <img 
              src="/assets/Lookbook1.jpg" 
              alt="Lookbook Editorial 1" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Image 2 - Jewelry/Overlay */}
        <div className="lg:col-span-4">
          <div className="relative border border-black p-0 overflow-hidden aspect-[4/5] md:aspect-auto">
            <img 
              src="/assets/Lookbook2.jpg" 
              alt="Lookbook Editorial 2" 
              className="w-full h-full object-cover"
            />
            
            {/* Overlay Circle Text "EST 1987" */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-32 h-32 md:w-40 md:h-40 border border-white/30 rounded-full flex flex-col items-center justify-center text-white/90">
                <span className="text-[10px] uppercase tracking-widest mb-1 font-sofia-pro">Est</span>
                <div className="w-10 h-[1px] bg-white/50 my-2"></div>
                <span className="text-[12px] font-medium font-sofia-pro">1987</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Lookbook;
