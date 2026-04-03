import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { publicRequest } from '../requestMethods';
import { FiArrowRight } from 'react-icons/fi';

const Magazine = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const res = await publicRequest.get("/articles?status=published");
        setArticles(res.data.slice(0, 3) || []);
      } catch (err) {
        console.error("Magazine articles fetch error:", err);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  return (
    <section className="py-16 md:py-24 px-6 md:px-12 bg-white">
      {/* Section Header */}
      <div className="text-center mb-16 max-w-2xl mx-auto">
        <h2 className="text-3xl md:text-[42px] font-gt-walsheim font-bold text-black mb-6">
          Read the magazine
        </h2>
        <p className="text-[14px] md:text-[15px] font-sofia-pro text-black/60 leading-relaxed">
          As a partner of corporates, Liquid has more than 9,000 partners of all sizes and all potential of session.
        </p>
      </div>

      {/* Articles Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        {loading
          ? Array.from({ length: 3 }).map((_, idx) => (
              <div key={`m-s-${idx}`} className="flex flex-col gap-6 animate-pulse">
                <div className="aspect-[4/3] bg-gray-50 rounded-sm" />
                <div className="h-8 bg-gray-50 w-full" />
                <div className="h-4 bg-gray-50 w-3/4" />
              </div>
            ))
          : articles.map((article) => (
          <Link to={`/news/${article._id}`} key={article._id} className="flex flex-col gap-6 group cursor-pointer">
            {/* Image Container */}
            <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 rounded-sm">
              <img 
                src={article.img}
                alt={article.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 bg-white px-6 py-3 text-[13px] font-bold text-black font-sofia-pro">
                {article.date}
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col gap-4">
              <h3 className="text-[24px] font-bold text-black leading-[1.2] font-gt-walsheim group-hover:text-black/70 transition-colors">
                {article.title}
              </h3>
              <p className="text-[16px] text-black/60 leading-relaxed font-sofia-pro line-clamp-2">
                {article.desc}
              </p>
              <div className="flex items-center gap-3 text-[14px] font-bold text-black uppercase tracking-widest font-sofia-pro mt-2">
                read more <FiArrowRight size={18} />
              </div>
            </div>
          </Link>
          ))}
      </div>

      <div className="mt-20 text-center">
        <Link 
          to="/news" 
          className="inline-block border-b-2 border-black pb-1 text-[13px] font-bold uppercase tracking-widest font-sofia-pro hover:opacity-70 transition-opacity"
        >
          View all articles
        </Link>
      </div>
    </section>
  );
};

export default Magazine;
