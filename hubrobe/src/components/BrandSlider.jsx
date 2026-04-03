import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';

const BrandSlider = () => {
  const brands = [
    '/assets/brand/imgi_20_logo-1@2x.jpg',
    '/assets/brand/imgi_23_logo-2@2x.jpg',
    '/assets/brand/imgi_22_logo-3@2x.jpg',
    '/assets/brand/imgi_21_logo-4@2x.jpg',
    '/assets/brand/imgi_24_logo-5@2x.jpg',
    '/assets/brand/imgi_25_logo-6@2x.jpg',
  ];

  // Double brands to ensure enough slides for smooth loop at all breakpoints
  const allBrands = [...brands, ...brands];

  return (
    <div className="py-10 border-y border-gray-100 bg-white overflow-hidden">
      <Swiper
        modules={[Autoplay, FreeMode]}
        spaceBetween={0}
        slidesPerView={2}
        loop={true}
        freeMode={true}
        speed={5000}
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
          reverseDirection: true,
        }}
        breakpoints={{
          640: { slidesPerView: 3 },
          768: { slidesPerView: 4 },
          1024: { slidesPerView: 5 },
          1280: { slidesPerView: 6 },
        }}
        className="brand-swiper !ease-linear"
      >
        {allBrands.map((logo, index) => (
          <SwiperSlide key={index} className="!flex items-center justify-center">
            <div className="flex items-center justify-center w-full h-16 border-r border-gray-100 px-6">
              <img 
                src={logo} 
                alt={`Brand ${index + 1}`} 
                className="max-h-12 w-auto grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500 object-contain cursor-pointer"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Adding a global style to force linear transition for the marquee effect */}
      <style>{`
        .brand-swiper .swiper-wrapper {
          transition-timing-function: linear !important;
        }
      `}</style>
    </div>
  );
};

export default BrandSlider;
