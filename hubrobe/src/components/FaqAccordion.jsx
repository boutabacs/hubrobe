import React, { useState } from 'react';
import { FiPlus, FiMinus } from 'react-icons/fi';

const FaqAccordion = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-100 last:border-none">
      <button 
        className="w-full flex items-center justify-between py-6 text-left hover:opacity-70 transition-opacity group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-[16px] md:text-[18px] font-medium text-black font-sofia-pro flex-1 pr-10">
          <span className="mr-4 text-black/20 group-hover:text-black transition-colors">
            {isOpen ? <FiMinus className="inline" /> : <FiPlus className="inline" />}
          </span>
          {question}
        </span>
      </button>
      
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[500px] pb-10' : 'max-h-0'
        }`}
      >
        <p className="text-[14px] md:text-[16px] text-black/60 leading-relaxed font-sofia-pro pl-10">
          {answer}
        </p>
      </div>
    </div>
  );
};

export default FaqAccordion;
