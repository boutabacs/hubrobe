import React from 'react';
import { FaPinterestP, FaTwitter, FaInstagram, FaCcVisa, FaCcMastercard, FaCcPaypal, FaCcAmex } from 'react-icons/fa';
import { FiChevronRight } from 'react-icons/fi';

const Footer = () => {
  const changeLanguage = (lngCode) => {
    const tryChange = (count) => {
      const googleCombo = document.querySelector('.goog-te-combo');
      if (googleCombo) {
        googleCombo.value = lngCode;
        googleCombo.dispatchEvent(new Event('change'));
        document.documentElement.dir = lngCode === 'ar' ? 'rtl' : 'ltr';
      } else if (count < 10) {
        setTimeout(() => tryChange(count + 1), 300);
      }
    };
    tryChange(0);
  };

  return (
    <footer className="bg-[#F9E2DB] pt-20 pb-10 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          
          {/* Brand & Newsletter Column */}
          <div className="col-span-2 lg:col-span-1 flex flex-col gap-8 mb-4 lg:mb-0">
            <img src="/assets/logo.svg" alt="hubrobe." className="w-32" />
            <p className="font-sofia-pro text-[14px] text-black/70 leading-relaxed max-w-[250px]">
              2020 Hub. All images are for demo purposes only.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-black hover:opacity-60 transition-opacity"><FaPinterestP size={18} /></a>
              <a href="#" className="text-black hover:opacity-60 transition-opacity"><FaTwitter size={18} /></a>
              <a href="#" className="text-black hover:opacity-60 transition-opacity"><FaInstagram size={18} /></a>
            </div>
            <div className="relative mt-4">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="w-full bg-transparent border-b border-black/20 pb-2 outline-none font-sofia-pro text-[14px] placeholder:text-black/40"
              />
              <button className="absolute right-0 bottom-2 text-black flex items-center gap-2 font-sofia-pro text-[14px] font-medium">
                <span className="md:hidden">Subscribe</span>
                <FiChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Hub Shop Column */}
          <div className="flex flex-col gap-6">
            <h4 className="font-sofia-pro text-[13px] font-bold uppercase tracking-widest text-black">Hub Shop</h4>
            <ul className="flex flex-col gap-4">
              {['Track Your Order', 'Product Guides', 'Wishlists', 'Privacy Policy', 'Store Locator'].map((item) => (
                <li key={item}>
                  <a href="#" className="font-sofia-pro text-[14px] text-black/70 hover:text-black transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Products Column 1 */}
          <div className="flex flex-col gap-6">
            <h4 className="font-sofia-pro text-[13px] font-bold uppercase tracking-widest text-black">Products</h4>
            <ul className="flex flex-col gap-4">
              {['In-Store Shop', 'Brands', 'Gift Cards', 'Careers', 'About Us'].map((item) => (
                <li key={item}>
                  <a href="#" className="font-sofia-pro text-[14px] text-black/70 hover:text-black transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Products Column 2 & Payment */}
          <div className="col-span-2 lg:col-span-1 flex flex-col gap-6">
            <h4 className="font-sofia-pro text-[13px] font-bold uppercase tracking-widest text-black">Products</h4>
            <div className="flex flex-col gap-6">
              <p className="font-sofia-pro text-[14px] text-black/70 leading-relaxed">
                2020 Hub. All images are for demo purposes only.
              </p>
              <a href="mailto:orders@hubshop.com" className="font-sofia-pro text-[14px] text-black font-medium underline decoration-black/20 hover:decoration-black transition-all">
                orders@hubshop.com
              </a>
              <div className="flex gap-4 md:gap-6 items-center flex-wrap">
                <FaCcVisa size={32} className="text-black" />
                <FaCcMastercard size={32} className="text-black" />
                <FaCcPaypal size={32} className="text-black" />
                <FaCcAmex size={32} className="text-black" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-black/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex gap-8">
            {[
              { label: 'SPANISH', code: 'es' },
              { label: 'ENGLISH', code: 'en' },
              { label: 'FRENCH', code: 'fr' }
            ].map((lang) => (
              <button 
                key={lang.code} 
                onClick={() => changeLanguage(lang.code)}
                className="font-sofia-pro text-[11px] font-bold tracking-widest text-black hover:opacity-60 transition-opacity uppercase cursor-pointer"
              >
                {lang.label}
              </button>
            ))}
          </div>
          <p className="font-sofia-pro text-[12px] text-black/50">
            © 2020 Hub Shop. All images are for demo purposes.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
