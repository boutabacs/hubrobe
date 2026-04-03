import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ShopBanner from '../components/ShopBanner';
import ShopFilters from '../components/ShopFilters';
import ProductCard from '../components/ProductCard';
import ProductListItem from '../components/ProductListItem';
import { publicRequest } from '../requestMethods';
import { FiFilter, FiX, FiGrid, FiList } from 'react-icons/fi';

const Shop = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const qSearch = searchParams.get("search");

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState("newest");
  const [limit, setLimit] = useState(18);
  const [viewMode, setViewMode] = useState("grid");
  const [stats, setStats] = useState({ categories: [], colors: [], sizes: [], totalProducts: 0 });

  const handleFilters = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    
    setFilters((prev) => {
      const newFilters = { ...prev };
      if (value === "" || value === "Filters:") {
        delete newFilters[name];
      } else {
        newFilters[name] = value;
      }
      return newFilters;
    });
  };

  useEffect(() => {
    const getStats = async () => {
      try {
        const res = await publicRequest.get("/products/stats");
        setStats(res.data);
      } catch (err) {
        console.log("Error fetching stats:", err);
      }
    };
    getStats();
  }, []);

  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams();
        if (filters.category) queryParams.append("category", filters.category);
        if (filters.color) queryParams.append("color", filters.color);
        if (filters.size) queryParams.append("size", filters.size);
        if (filters.minPrice) queryParams.append("minPrice", filters.minPrice);
        if (filters.maxPrice) queryParams.append("maxPrice", filters.maxPrice);
        if (sort) queryParams.append("sort", sort);
        if (qSearch) queryParams.append("search", qSearch);
        queryParams.append("limit", limit);

        const res = await publicRequest.get(`/products?${queryParams.toString()}`);
        setProducts(res.data);
      } catch (err) {
        console.log("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    getProducts();
  }, [filters, sort, limit, qSearch]);

  return (
    <div className="flex flex-col w-full bg-white relative">
      {/* Banner Section */}
      <ShopBanner />

      {/* Mobile Filters Drawer Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-[100] transition-opacity duration-300 lg:hidden ${
          isMobileFiltersOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileFiltersOpen(false)}
      ></div>

      {/* Mobile Filters Drawer */}
      <div 
        className={`fixed top-0 left-0 h-full w-[300px] bg-white z-[101] shadow-2xl transition-transform duration-300 transform lg:hidden overflow-y-auto ${
          isMobileFiltersOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-[18px] font-bold uppercase tracking-widest font-sofia-pro">Filters</h2>
            <button onClick={() => setIsMobileFiltersOpen(false)} className="text-2xl">
              <FiX />
            </button>
          </div>
          <ShopFilters filters={filters} setFilters={setFilters} handleFilters={handleFilters} stats={stats} />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 md:py-20 flex flex-col lg:flex-row gap-10 lg:gap-16">
        
        {/* Sidebar Filters (Desktop) */}
        <div className="hidden lg:block">
          <ShopFilters filters={filters} setFilters={setFilters} handleFilters={handleFilters} stats={stats} />
        </div>

        {/* Product Grid & Controls */}
        <div className="flex-1 flex flex-col gap-6 md:gap-10">
          
          {/* Search Summary if search active */}
          {qSearch && (
            <div className="mb-4">
              <p className="text-[14px] text-black/60 font-sofia-pro">
                Search results for: <span className="text-black font-bold">"{qSearch}"</span>
              </p>
            </div>
          )}

          {/* Grid Controls (Sort, View Mode, Mobile Filter Toggle) */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 md:gap-6 border-b border-gray-100 pb-6 md:pb-8">
            <div className="flex items-center justify-between w-full sm:w-auto gap-6">
              <button 
                onClick={() => setIsMobileFiltersOpen(true)}
                className="lg:hidden flex items-center gap-2 text-[13px] font-bold uppercase tracking-widest text-black font-sofia-pro"
              >
                <FiFilter /> Filters
              </button>

              <div className="flex items-center gap-6">
                <span className="text-[12px] md:text-[13px] text-black font-bold font-sofia-pro">
                  {products.length} RESULTS
                </span>
                
                {/* View Mode Switcher */}
                <div className="flex items-center gap-4 border-l border-gray-200 pl-6">
                  <button 
                    onClick={() => setViewMode("grid")}
                    className="group flex items-center justify-center p-1 transition-all"
                    title="Grid View"
                  >
                    <div className={`grid grid-cols-2 gap-[2px] p-[2px] border-2 transition-all ${viewMode === "grid" ? "border-black" : "border-gray-300 group-hover:border-black"}`}>
                      <div className={`w-1.5 h-1.5 ${viewMode === "grid" ? "bg-black" : "bg-gray-300 group-hover:bg-black"}`}></div>
                      <div className={`w-1.5 h-1.5 ${viewMode === "grid" ? "bg-black" : "bg-gray-300 group-hover:bg-black"}`}></div>
                      <div className={`w-1.5 h-1.5 ${viewMode === "grid" ? "bg-black" : "bg-gray-300 group-hover:bg-black"}`}></div>
                      <div className={`w-1.5 h-1.5 ${viewMode === "grid" ? "bg-black" : "bg-gray-300 group-hover:bg-black"}`}></div>
                    </div>
                  </button>
                  
                  <button 
                    onClick={() => setViewMode("list")}
                    className="group flex flex-col gap-[3px] transition-all"
                    title="List View"
                  >
                    <div className={`w-5 h-[2px] transition-all ${viewMode === "list" ? "bg-black" : "bg-gray-300 group-hover:bg-black"}`}></div>
                    <div className={`w-5 h-[2px] transition-all ${viewMode === "list" ? "bg-black" : "bg-gray-300 group-hover:bg-black"}`}></div>
                    <div className={`w-5 h-[2px] transition-all ${viewMode === "list" ? "bg-black" : "bg-gray-300 group-hover:bg-black"}`}></div>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between w-full sm:w-auto gap-4 md:gap-6">
              <div className="flex items-center gap-2">
                <span className="text-[12px] md:text-[13px] text-black/40 font-sofia-pro">Show:</span>
                <div className="flex gap-2 md:gap-3 text-[12px] md:text-[13px] text-black font-medium">
                  {[12, 18, 24].map((num) => (
                    <button 
                      key={num}
                      onClick={() => setLimit(num)}
                      className={`hover:opacity-60 transition-opacity ${limit === num ? 'underline' : ''}`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
              <div className="relative group">
                <select 
                  onChange={(e) => setSort(e.target.value)}
                  className="bg-transparent border-none outline-none text-[12px] md:text-[13px] font-bold uppercase tracking-widest text-black appearance-none cursor-pointer pr-4 font-sofia-pro"
                  value={sort}
                >
                  <option value="newest">Sort By: Newest</option>
                  <option value="asc">Price: Low to High</option>
                  <option value="desc">Price: High to Low</option>
                </select>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg width="8" height="5" viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L4 4L7 1" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              </div>
            </div>
          </div>

          {/* Product Grid / List */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-x-4 md:gap-x-10 gap-y-10 md:gap-y-16">
              {products.map((product) => (
                <ProductCard key={product._id || product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col">
              {products.map((product) => (
                <ProductListItem key={product._id || product.id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination (Simplified) */}
          <div className="flex justify-center mt-10">
            <div className="flex gap-4">
              <button className="w-10 h-10 flex items-center justify-center rounded-full bg-black text-white text-[13px] font-bold">1</button>
              <button className="w-10 h-10 flex items-center justify-center rounded-full bg-transparent border border-gray-100 text-black text-[13px] font-bold hover:bg-black hover:text-white transition-all">2</button>
              <button className="w-10 h-10 flex items-center justify-center rounded-full bg-transparent border border-gray-100 text-black text-[13px] font-bold hover:bg-black hover:text-white transition-all">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Keep in Touch Section */}
      <div className="w-full bg-white py-10 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-wrap justify-between items-center gap-6 md:gap-8">
            <h3 className="text-base font-bold tracking-widest uppercase font-sofia-pro text-black">
              Keep in Touch
            </h3>
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="w-5 h-5 rounded-full border-2 border-black/20 group-hover:border-black transition-colors flex-shrink-0"></div>
                <span className="text-sm font-medium text-black/60 group-hover:text-black transition-colors">Follow on Instagram</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="w-5 h-5 rounded-full border-2 border-black/20 group-hover:border-black transition-colors flex-shrink-0"></div>
                <span className="text-sm font-medium text-black/60 group-hover:text-black transition-colors">Join weekly Newsletter</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="w-5 h-5 rounded-full border-2 border-black/20 group-hover:border-black transition-colors flex-shrink-0"></div>
                <span className="text-sm font-medium text-black/60 group-hover:text-black transition-colors">Ask anything Whatsapp</span>
              </label>
            </div>
            <p className="text-sm text-black/50 font-sofia-pro">
              Subscribe to get latest news.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
