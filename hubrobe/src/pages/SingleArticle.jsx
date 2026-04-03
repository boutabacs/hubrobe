import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { publicRequest } from '../requestMethods';
import { FiCalendar, FiUser, FiArrowLeft, FiShare2 } from 'react-icons/fi';

const SingleArticle = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getArticle = async () => {
      try {
        const res = await publicRequest.get(`/articles/${id}`);
        setArticle(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getArticle();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-black/10 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6">
        <h2 className="text-2xl font-bold font-gt-walsheim">Article not found</h2>
        <Link to="/news" className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:gap-3 transition-all">
          <FiArrowLeft /> Back to News
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <img 
          src={article.img} 
          alt={article.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex items-center justify-center p-6">
          <div className="max-w-4xl text-center text-white">
            <Link to="/news" className="inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-widest mb-6 hover:opacity-80 transition-opacity">
              <FiArrowLeft /> Back to News
            </Link>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold font-gt-walsheim leading-tight mb-6">
              {article.title}
            </h1>
            <div className="flex items-center justify-center gap-6 text-[13px] font-sofia-pro uppercase tracking-widest opacity-80">
              <span className="flex items-center gap-2"><FiCalendar /> {article.date}</span>
              <span className="flex items-center gap-2"><FiUser /> {article.author || 'Admin'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        {/* Short Description / Intro */}
        <div className="mb-12">
          <p className="text-xl md:text-2xl text-black/60 italic font-sofia-pro leading-relaxed border-l-4 border-black pl-6">
            {article.desc}
          </p>
        </div>

        {/* Main Content (Rich Text) */}
        <div 
          className="prose prose-lg max-w-none font-sofia-pro prose-headings:font-gt-walsheim prose-img:rounded-sm prose-a:text-black prose-a:font-bold prose-blockquote:border-black"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Footer Actions */}
        <div className="mt-16 pt-8 border-t border-gray-100 flex justify-between items-center">
          <div className="flex gap-4">
            <button className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-widest hover:opacity-70 transition-opacity">
              <FiShare2 /> Share
            </button>
          </div>
          <Link to="/news" className="text-[12px] font-bold uppercase tracking-widest hover:opacity-70 transition-opacity">
            Next Post →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SingleArticle;
