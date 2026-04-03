import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const HeroSlider = () => {
  const slides = [
    {
      id: 1,
      image: "/assets/hero1.jpg",
      title: "#stayhome essentials.",
      productName: "Blue Hoodie",
      price: "£19.90",
      align: "left",
    },
    {
      id: 2,
      image: "/assets/hero2.jpg",
      title: "Hub SS-21 Editorial.",
      productName: "Knit Sweater",
      price: "£39.90",
      align: "left",
    },
  ];

  // Swiper loop mode needs more slides than slidesPerView to work correctly without warnings
  const allSlides = slides.length === 2 ? [...slides, ...slides] : slides;

  return (
    <div className="relative w-full bg-white">
      {/* Slider Container */}
      <div className="w-full h-[450px] sm:h-[500px] md:h-[600px] relative bg-gray-50">
        <Swiper
          modules={[Navigation, Autoplay, Pagination]}
          navigation={{
            prevEl: ".swiper-button-prev-custom",
            nextEl: ".swiper-button-next-custom",
          }}
          pagination={{
            clickable: true,
            el: ".swiper-pagination-custom",
            bulletClass: "swiper-pagination-bullet",
            bulletActiveClass: "swiper-pagination-bullet-active",
          }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop={allSlides.length > 1}
          className="w-full h-full"
        >
          {allSlides.map((slide, index) => (
            <SwiperSlide key={`${slide.id}-${index}`}>
              <div className="w-full h-full relative">
                {/* Background Image */}
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />

                {/* Overlay Content */}
                <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-24 max-w-[1920px] mx-auto">
                  <div className="flex flex-col items-start gap-4 md:gap-8 max-w-[90%] md:max-w-2xl">
                    <h1 className="text-white text-[45px] sm:text-[55px] md:text-[80px] font-[1000] leading-[0.9] md:leading-[1] tracking-tighter font-sofia-pro">
                      {slide.title}
                    </h1>

                    <button className="flex items-center gap-2 text-white text-[12px] md:text-[13px] font-bold tracking-[0.1em] uppercase hover:opacity-70 transition-opacity font-sofia-pro">
                      SHOP WOMEN <FiArrowRight className="text-sm" />
                    </button>
                  </div>

                  {/* Product Label */}
                  <div className="absolute bottom-10 left-6 md:left-auto md:right-[35%] md:top-[50%] flex items-start gap-3 border-l border-white pl-4 text-white">
                    <div className="flex flex-col">
                      <span className="text-[14px] md:text-[15px] font-medium font-sofia-pro leading-tight">
                        {slide.productName}
                      </span>
                      <span className="text-[14px] md:text-[15px] font-medium font-sofia-pro leading-tight opacity-90">
                        {slide.price}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Desktop Navigation Arrows (xl only) */}
        <button className="hidden xl:flex swiper-button-prev-custom absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white items-center justify-center text-black hover:bg-black hover:text-white transition-all duration-300">
          <FiArrowLeft className="text-xl" />
        </button>
        <button className="hidden xl:flex swiper-button-next-custom absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white items-center justify-center text-black hover:bg-black hover:text-white transition-all duration-300">
          <FiArrowRight className="text-xl" />
        </button>
      </div>

      {/* Controls below the slider for Mobile/Tablet */}
      <div className="flex flex-col items-center py-8 bg-white border-b border-gray-100 xl:hidden">
        {/* Tablet Arrows (md only) */}
        <div className="hidden md:flex items-center gap-12">
          <button className="swiper-button-prev-custom text-black hover:opacity-50 transition-opacity">
            <FiArrowLeft className="text-2xl" />
          </button>
          <button className="swiper-button-next-custom text-black hover:opacity-50 transition-opacity">
            <FiArrowRight className="text-2xl" />
          </button>
        </div>

        {/* Mobile Pagination Dots (sm only) */}
        <div className="md:hidden">
          <div className="swiper-pagination-custom flex items-center justify-center gap-3"></div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .swiper-button-disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
        .swiper-pagination-custom .swiper-pagination-bullet {
           width: 8px;
           height: 8px;
           background: #E5E7EB;
           opacity: 1;
           margin: 0 !important;
           border-radius: 50%;
           transition: all 0.3s ease;
           cursor: pointer;
         }
         .swiper-pagination-custom .swiper-pagination-bullet-active {
            width: 28px;
            height: 8px;
            background: #000000;
            border-radius: 100px;
          }
      `,
        }}
      />
    </div>
  );
};

export default HeroSlider;
