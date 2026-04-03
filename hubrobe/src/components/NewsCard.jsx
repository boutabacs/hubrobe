import React from 'react';
import { FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const NewsCard = ({ article }) => {
  return (
    <Link to={`/news/${article._id || article.id}`} className="flex flex-col gap-6 group cursor-pointer">
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 rounded-sm">
        <img 
          src={article.img || article.image} 
          alt={article.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          onError={(e) => {
            e.target.src = '/assets/fashion.jpg';
          }}
        />
        <div className="absolute bottom-0 left-0 bg-white px-6 py-3 text-[13px] font-bold text-black font-sofia-pro">
          {article.date}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-4">
        <h3 className="text-[24px] md:text-[28px] font-bold text-black leading-[1.2] font-gt-walsheim group-hover:text-black/70 transition-colors">
          {article.title}
        </h3>
        <p className="text-[16px] md:text-[18px] text-black/60 leading-relaxed font-sofia-pro line-clamp-2">
          {article.desc || article.description}
        </p>
        <div className="flex items-center gap-3 text-[14px] font-bold text-black uppercase tracking-widest font-sofia-pro mt-2">
          read more <FiArrowRight size={18} />
        </div>
      </div>
    </Link>
  );
};

export default NewsCard;
