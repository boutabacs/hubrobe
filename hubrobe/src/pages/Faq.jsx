import React, { useEffect, useState } from 'react';
import FaqHero from '../components/FaqHero';
import FaqAccordion from '../components/FaqAccordion';
import { FiChevronDown } from 'react-icons/fi';
import { publicRequest } from '../requestMethods';

const Faq = () => {
  const [faqData, setFaqData] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    const fetchFaq = async () => {
      try {
        const res = await publicRequest.get("/faq");
        const data = res.data || [];
        setFaqData(data);
        setActiveCategory(data?.[0]?.id ?? null);
      } catch (err) {
        console.error("FAQ fetch error:", err);
        setFaqData([]);
        setActiveCategory(null);
      }
    };
    fetchFaq();
  }, [faqData]);

  // Auto-update active category on scroll
  useEffect(() => {
    if (!faqData.length) return;
    const handleScroll = () => {
      const offset = 150; // Threshold
      const scrollPosition = window.scrollY + offset;

      for (const category of faqData) {
        const element = document.getElementById(category.id);
        if (element) {
          const { top, bottom } = element.getBoundingClientRect();
          const absoluteTop = top + window.scrollY;
          const absoluteBottom = bottom + window.scrollY;

          if (scrollPosition >= absoluteTop && scrollPosition <= absoluteBottom) {
            setActiveCategory(category.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollToSection = (id) => {
    setActiveCategory(id);
    const element = document.getElementById(id);
    if (element) {
      const offset = 120; // Account for sticky navbar
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="flex flex-col w-full bg-white pb-20 md:pb-32">
      <FaqHero />

      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full mt-16 md:mt-24">
        {/* Container for Sidebar and Content */}
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start relative">
          
          {/* Independent Sidebar Div - Sticky on desktop once reached */}
          <aside className="w-full lg:w-[250px] lg:sticky lg:top-[120px] z-30 flex-shrink-0">
            <div className="bg-white border-t border-gray-100">
              <ul className="flex flex-col">
                {faqData.map((category) => (
                  <li key={category.id} className="border-b border-gray-100">
                    <button
                      onClick={() => handleScrollToSection(category.id)}
                      className={`w-full py-4 flex items-center justify-between group transition-all duration-300 ${
                        activeCategory === category.id ? 'text-black' : 'text-black/40 hover:text-black/60'
                      }`}
                    >
                      <span className="text-[14px] md:text-[15px] font-bold uppercase tracking-widest font-sofia-pro text-left">
                        {category.title}
                      </span>
                      <FiChevronDown className={`transition-transform duration-300 ${
                        activeCategory === category.id ? 'rotate-0 opacity-100' : '-rotate-90 opacity-20'
                      }`} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* FAQ Content Area */}
          <div className="flex-1 w-full flex flex-col gap-16 md:gap-24">
            {faqData.map((category) => (
              <div key={category.id} id={category.id} className="scroll-mt-[150px] w-full">
                <h2 className="text-[13px] md:text-[14px] font-bold uppercase tracking-widest text-black mb-8 border-b border-gray-100 pb-4 font-sofia-pro">
                  {category.title}
                </h2>
                <div className="flex flex-col">
                  {category.items.map((item, index) => (
                    <FaqAccordion key={index} question={item.q} answer={item.a} />
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Faq;
