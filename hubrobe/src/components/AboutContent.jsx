import React from 'react';

const AboutContent = () => {
  return (
    <section className="bg-white py-16 md:py-24 px-6">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        {/* Quality, Consciousness, Versatile design */}
        <h2 className="text-[32px] md:text-[56px] font-sofia-pro font-bold text-black leading-tight text-center mb-10 max-w-4xl">
          quality, consciousness, and versatile design.
        </h2>
        <p className="max-w-3xl text-center text-[14px] md:text-[16px] font-sofia-pro text-black/60 leading-relaxed mb-16">
          Over 25 years of experience, we have crafted thousands of strategic discovery process that enables us to peel back the layers which enable us to understand, connect, represent and dominate.
        </p>

        {/* Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 w-full items-end">
          <div className="aspect-[4/5] rounded-sm overflow-hidden bg-gray-50">
            <img src="/assets/about/about1.jpg" alt="About 1" className="w-full h-full object-cover" />
          </div>
          <div className="aspect-[1/1] rounded-sm overflow-hidden bg-gray-50 md:mb-12">
            <img src="/assets/about/about2.jpg" alt="About 2" className="w-full h-full object-cover" />
          </div>
          <div className="aspect-[4/5] rounded-sm overflow-hidden bg-gray-50">
            <img src="/assets/about/about3.jpg" alt="About 3" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Long Description Section */}
        <div className="mt-20 max-w-2xl mx-auto flex flex-col gap-8 text-black/60 font-sofia-pro text-[14px] md:text-[16px] leading-relaxed">
          <p>
            Over 25 years of experience, we have crafted thousands of strategic discovery process that enables us to peel back the layers which enable us to understand, connect, represent and dominate your market. Because we know just how hard it is to get the size, color and even the garment right in the fashion.
          </p>
          <p>
            The planet and your conscience will thank you.
            To help stem the flow of plastic into the ocean, we have committed to eliminating single-use plastic from th product range and food outlets by 2020.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutContent;
