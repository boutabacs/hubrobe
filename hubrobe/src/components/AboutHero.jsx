import React from 'react';

const AboutHero = () => {
  return (
    <section className="bg-white py-20 md:py-32 px-6">
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
        <h1 className="text-[64px] md:text-[100px] font-sofia-pro font-bold text-black leading-none mb-10">
          about.
        </h1>
        <p className="max-w-3xl text-[14px] md:text-[16px] font-sofia-pro text-black/60 leading-relaxed mb-16">
          Over 25 years of experience, we have crafted thousands of strategic discovery process that enables us to peel back the layers which enable us to understand, connect, represent and dominate.
        </p>
        
        {/* Full width image banner */}
        <div className="w-full aspect-[21/9] overflow-hidden rounded-sm">
          <img 
            src="/assets/fashion.jpg" 
            alt="About Hubrobe" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Keep in Touch Section */}
      <div className="w-full bg-white pt-20 border-t border-gray-100 mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap justify-between items-center gap-6 md:gap-8">
            <h3 className="text-base font-bold tracking-widest uppercase font-sofia-pro text-black">
              Keep in Touch
            </h3>
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="w-5 h-5 rounded-full border-2 border-black/20 group-hover:border-black transition-colors flex-shrink-0"></div>
                <span className="text-sm font-medium text-black/60 group-hover:text-black transition-colors">Follow on Instagram</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="w-5 h-5 rounded-full border-2 border-black/20 group-hover:border-black transition-colors flex-shrink-0"></div>
                <span className="text-sm font-medium text-black/60 group-hover:text-black transition-colors">Join weekly Newsletter</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="w-5 h-5 rounded-full border-2 border-black/20 group-hover:border-black transition-colors flex-shrink-0"></div>
                <span className="text-sm font-medium text-black/60 group-hover:text-black transition-colors">Ask anything Whatsapp</span>
              </label>
            </div>
            <p className="text-sm text-black/50 font-sofia-pro">
              Subscribe to get latest news.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;
