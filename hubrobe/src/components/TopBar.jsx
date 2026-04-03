import React, { useState, useEffect } from 'react';
import { FaInstagram } from 'react-icons/fa';
import { HiDotsHorizontal } from 'react-icons/hi';
import { MdOutlineArrowForward } from 'react-icons/md';

const TopBar = () => {
  const [showLanguages, setShowLanguages] = useState(false);
  const [currentLang, setCurrentLang] = useState('en');

  const languages = [
    { code: 'en', name: 'ENGLISH', country: 'us' },
    { code: 'fr', name: 'FRANÇAIS', country: 'fr' },
    { code: 'ar', name: 'العربية', country: 'sa' },
    { code: 'es', name: 'ESPAÑOL', country: 'es' },
    { code: 'de', name: 'DEUTSCH', country: 'de' },
  ];

  const currentLanguage = languages.find(l => l.code === currentLang) || languages[0];

  const changeLanguage = (lngCode) => {
    // Show a small indication that it's loading if needed
    setShowLanguages(false);

    const tryChange = (count) => {
      // Look for the Google Translate select element
      const googleCombo = document.querySelector('.goog-te-combo');
      
      if (googleCombo) {
        // Set the value and trigger the change event
        googleCombo.value = lngCode;
        googleCombo.dispatchEvent(new Event('change'));
        
        // Update local state and RTL
        setCurrentLang(lngCode);
        document.documentElement.dir = lngCode === 'ar' ? 'rtl' : 'ltr';
        
        // Final check to ensure it applied (sometimes needs a second trigger)
        setTimeout(() => {
          if (googleCombo.value !== lngCode) {
            googleCombo.value = lngCode;
            googleCombo.dispatchEvent(new Event('change'));
          }
        }, 100);

      } else if (count < 10) {
        // Retry more frequently at first
        setTimeout(() => tryChange(count + 1), 300);
      } else {
        console.error("Google Translate element not found after several attempts.");
      }
    };

    tryChange(0);
  };

  return (
    <div className="hidden xl:block w-full bg-white border-b border-gray-100 py-2 px-6 md:px-12 text-black relative z-[1000]">
      <div className="max-w-[1920px] mx-auto grid grid-cols-3 items-center">
        {/* Left Section: Language Selector */}
        <div className="flex items-center gap-3 relative">
          <div 
            className="flex items-center gap-3 cursor-pointer group transition-colors"
            onClick={() => setShowLanguages(!showLanguages)}
          >
            <div className="w-5 h-3.5 overflow-hidden rounded-[2px] shadow-sm border border-gray-100">
              <img 
                src={`https://flagcdn.com/w40/${currentLanguage.country}.png`} 
                alt={currentLanguage.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-[13px] font-extrabold font-sofia-pro tracking-widest text-black">{currentLanguage.name}</span>
          </div>
          <HiDotsHorizontal 
            className="text-black cursor-pointer hover:text-black/50 transition-colors text-lg ml-2"
            onClick={() => setShowLanguages(!showLanguages)}
          />

          {showLanguages && (
            <div className="absolute top-[calc(100%+10px)] left-0 w-64 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.1)] rounded-lg py-2 z-[1001] animate-in fade-in slide-in-from-top-2 duration-200">
              {languages.map((lang) => (
                <div
                  key={lang.code}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors group"
                  onClick={() => changeLanguage(lang.code)}
                >
                  <div className="w-6 h-4 overflow-hidden rounded-[2px] shadow-sm border border-gray-100 flex-shrink-0">
                    <img 
                      src={`https://flagcdn.com/w40/${lang.country}.png`} 
                      alt={lang.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-[14px] font-extrabold font-sofia-pro tracking-wider text-black group-hover:text-black/70">{lang.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Center Section: Message */}
        <div className="flex items-center justify-center text-center whitespace-nowrap gap-8">
          <span className="font-sofia-pro text-[13px] font-medium leading-[24px]">
            Free Delivery on orders over £120. Don't miss discount.
          </span>
          <a href="#" className="flex items-center gap-1 font-sofia-pro text-[14px] font-normal leading-[24px] hover:underline">
            Shop Men <MdOutlineArrowForward className={`text-sm ${currentLang === 'ar' ? 'rotate-180' : ''}`} />
          </a>
        </div>

        {/* Right Section: Instagram & Followers */}
        <div className="flex items-center justify-end gap-3">
          <div className="flex items-center gap-2 cursor-pointer hover:text-black/50 transition-colors">
            <FaInstagram className="text-lg" />
            <span className="font-sofia-pro text-[12px] font-normal leading-[24px]">
              2.3m Followers
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
