import React from 'react';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';

const AboutQuote = () => {
  return (
    <section className="bg-[#2B3020] py-24 md:py-32 px-6">
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
        
        {/* Quote Section with Arrows */}
        <div className="relative w-full flex items-center justify-center mb-24 px-12">
          <button className="absolute left-0 text-white hover:opacity-60 transition-opacity">
            <FiArrowLeft size={24} />
          </button>
          
          <blockquote className="max-w-3xl text-[20px] md:text-[24px] font-sofia-pro font-medium text-white italic leading-relaxed px-4 md:px-0">
            "Hub offers a range of skincare products that are feminine, delicate and long-lasting with vitamins and nutritions to improve your skin condition."
          </blockquote>

          <button className="absolute right-0 text-white hover:opacity-60 transition-opacity">
            <FiArrowRight size={24} />
          </button>
        </div>

        {/* Press Logos */}
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-32 w-full opacity-70 grayscale contrast-125">
          <div className="flex flex-col items-center gap-2">
             <span className="text-white text-[12px] md:text-[14px] font-bold tracking-widest uppercase font-sofia-pro">REFINERY29</span>
          </div>
          <div className="flex flex-col items-center gap-2">
             <span className="text-white text-[32px] md:text-[40px] font-bold tracking-tighter font-sofia-pro">GQ</span>
          </div>
          <div className="flex flex-col items-center gap-2">
             <span className="text-white text-[16px] md:text-[20px] font-bold tracking-widest uppercase font-sofia-pro">BYRDIE</span>
          </div>
        </div>

      </div>
    </section>
  );
};

export default AboutQuote;
