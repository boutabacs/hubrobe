import React, { useEffect, useState } from 'react';
import NewsHero from '../components/NewsHero';
import NewsCard from '../components/NewsCard';
import { publicRequest } from '../requestMethods';

const News = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await publicRequest.get("/articles?status=published");
        setArticles(res.data || []);
      } catch (err) {
        console.error("Articles fetch error:", err);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  return (
    <div className="flex flex-col w-full bg-white">
      {/* Banner Section */}
      <NewsHero />

      {/* News Grid Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
          {loading
            ? Array.from({ length: 6 }).map((_, idx) => (
                <div key={`s-${idx}`} className="flex flex-col gap-6 animate-pulse">
                  <div className="aspect-[4/3] bg-gray-50 rounded-sm" />
                  <div className="h-8 bg-gray-50 w-full" />
                  <div className="h-4 bg-gray-50 w-3/4" />
                </div>
              ))
            : articles.map((article) => <NewsCard key={article._id || article.id} article={article} />)}
        </div>

        {/* Load More Button */}
        <div className="flex justify-center mt-20">
          <button className="px-10 py-4 bg-black text-white text-[13px] font-bold uppercase tracking-widest font-sofia-pro hover:bg-black/80 transition-colors rounded-sm">
            Load more
          </button>
        </div>
      </div>
    </div>
  );
};

export default News;
