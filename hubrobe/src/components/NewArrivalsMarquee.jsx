import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';

const NewArrivalsMarquee = () => {
  const marqueeText = "NEW ARRIVALS";
  const repetitions = 10; // Pour assurer un défilement continu sans trous

  return (
    <section className="relative w-full h-[300px] md:h-[450px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src="/assets/fashion.jpg" 
          alt="New Arrivals Fashion" 
          className="w-full h-full object-cover"
        />
        {/* Overlay pour assombrir légèrement si besoin, ou simplement pour le style */}
        <div className="absolute inset-0 bg-black/10"></div>
      </div>

      {/* Marquee Text Container */}
      <div className="absolute inset-0 flex items-center z-10">
        <Swiper
          modules={[Autoplay, FreeMode]}
          spaceBetween={50}
          slidesPerView="auto"
          loop={true}
          freeMode={true}
          speed={10000}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
          }}
          className="marquee-swiper w-full !ease-linear"
        >
          {[...Array(repetitions)].map((_, i) => (
            <SwiperSlide key={i} className="!w-auto">
              <span 
                className="text-[60px] md:text-[120px] font-sofia-pro font-bold text-transparent tracking-tighter uppercase whitespace-nowrap"
                style={{ 
                  WebkitTextStroke: '1px rgba(255, 255, 255, 0.8)',
                  textStroke: '1px rgba(255, 255, 255, 0.8)'
                }}
              >
                {marqueeText}
              </span>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style>{`
        .marquee-swiper .swiper-wrapper {
          transition-timing-function: linear !important;
        }
      `}</style>
    </section>
  );
};

export default NewArrivalsMarquee;
