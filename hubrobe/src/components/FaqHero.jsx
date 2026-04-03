import React from 'react';

const FaqHero = () => {
  return (
    <section className="bg-white pt-20 md:pt-32">
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center px-6 mb-16 md:mb-20">
        <h1 className="text-[64px] md:text-[100px] font-bold text-black leading-none mb-10 font-sofia-pro">
          help center.
        </h1>
        <p className="max-w-3xl text-[14px] md:text-[16px] text-black/60 leading-relaxed font-sofia-pro">
          Over 25 years of experience, we have crafted thousands of strategic discovery process that enables us to peel back the layers which enable us to understand, connect, represent and dominate.
        </p>
      </div>
      
      {/* Full screen width image banner with reduced height */}
      <div className="w-full h-[200px] md:h-[280px] overflow-hidden">
        <img 
          src="/assets/fashion.jpg" 
          alt="FAQ Help Center" 
          className="w-full h-full object-cover"
        />
      </div>
    </section>
  );
};

export default FaqHero;
