import React, { useState, useEffect } from "react";

const ShopFilters = ({ filters, setFilters, handleFilters, stats }) => {
  const [localMinPrice, setLocalMinPrice] = useState(filters.minPrice || 0);
  const [localMaxPrice, setLocalMaxPrice] = useState(filters.maxPrice || 1000);

  // Synchroniser l'état local si les filtres sont réinitialisés de l'extérieur
  useEffect(() => {
    setLocalMinPrice(filters.minPrice || 0);
    setLocalMaxPrice(filters.maxPrice || 1000);
  }, [filters.minPrice, filters.maxPrice]);

  const applyPriceFilter = () => {
    setFilters((prev) => ({
      ...prev,
      minPrice: localMinPrice,
      maxPrice: localMaxPrice,
    }));
  };


  const categories = stats?.categories || [];
  const colors = stats?.colors || [];
  const allSizes = stats?.sizes || [];

  const garmentSizes = allSizes.filter((s) => isNaN(s));
  const shoeSizes = allSizes
    .filter((s) => !isNaN(s))
    .sort((a, b) => Number(a) - Number(b));

  const colorMap = {
    Black: "#000000",
    White: "#FFFFFF",
    Red: "#FF0000",
    Blue: "#0000FF",
    Green: "#00FF00",
    Yellow: "#FFFF00",
    Pink: "#FFC0CB",
    Orange: "#FFA500",
    Purple: "#800080",
    Grey: "#808080",
    Brown: "#A52A2A",
    Navy: "#000080",
    Beige: "#F5F5DC",
    Gold: "#FFD700",
    Silver: "#C0C0C0",
  };

  // Fonction pour vérifier si une chaîne est une couleur hexadécimale valide
  const isHex = (str) => /^#([0-9A-F]{3}){1,2}$/i.test(str);

  const toggleFilter = (name, value) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      if (prev[name] === value || value === null) {
        delete newFilters[name];
      } else {
        newFilters[name] = value;
      }
      return newFilters;
    });
  };

  return (
    <aside className="w-full lg:w-[280px] flex flex-col gap-12 py-10">
      <div className="flex flex-col gap-6">
        <h4 className="text-[13px] font-bold uppercase tracking-widest text-black font-sofia-pro border-b border-gray-100 pb-3">
          Filter by Price
        </h4>
        <div className="flex flex-col gap-6 px-1">
          {/* Visual Slider Container */}
          <div className="relative w-full h-[2px] bg-gray-200 mt-2">
            <div 
              className="absolute h-full bg-black"
              style={{
                left: `${(localMinPrice / 1000) * 100}%`,
                right: `${100 - (localMaxPrice / 1000) * 100}%`
              }}
            ></div>
            {/* Native Dual Range Sim (Hidden inputs over visual bar) */}
            <input 
              type="range" 
              min="0" 
              max="1000" 
              step="1"
              value={localMinPrice} 
              onChange={(e) => setLocalMinPrice(Math.min(Number(e.target.value), localMaxPrice - 10))}
              className="absolute w-full -top-1 pointer-events-none accent-black appearance-none bg-transparent h-2 [&::-webkit-slider-thumb]:pointer-events-auto"
            />
            <input 
              type="range" 
              min="0" 
              max="1000" 
              step="1"
              value={localMaxPrice} 
              onChange={(e) => setLocalMaxPrice(Math.max(Number(e.target.value), localMinPrice + 10))}
              className="absolute w-full -top-1 pointer-events-none accent-black appearance-none bg-transparent h-2 [&::-webkit-slider-thumb]:pointer-events-auto"
            />
          </div>
          
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <span className="text-[13px] font-sofia-pro text-black">
                Price: <span className="font-bold">${localMinPrice} — ${localMaxPrice}</span>
              </span>
              <button 
                onClick={applyPriceFilter}
                className="text-[12px] font-bold uppercase tracking-widest text-black hover:opacity-60 transition-opacity border-b-2 border-black"
              >
                Filter
              </button>
            </div>

            <div className="flex justify-end">
              <button 
                onClick={() => {
                  setLocalMinPrice(0);
                  setLocalMaxPrice(1000);
                  const newFilters = { ...filters };
                  delete newFilters.minPrice;
                  delete newFilters.maxPrice;
                  setFilters(newFilters);
                }}
                className="text-[10px] uppercase tracking-widest text-black/40 hover:text-black transition-colors"
              >
                Reset Price
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <h4 className="text-[13px] font-bold uppercase tracking-widest text-black font-sofia-pro border-b border-gray-100 pb-3">
          Filter by Category
        </h4>
        <ul className="flex flex-col gap-3">
          {/* All Products Item */}
          <li 
            className={`flex justify-between items-center group cursor-pointer ${!filters.category ? 'font-bold' : ''}`}
            onClick={() => toggleFilter('category', null)}
          >
            <span className={`text-[14px] transition-colors font-sofia-pro ${!filters.category ? 'text-black' : 'text-black/60 group-hover:text-black'}`}>
              All Products
            </span>
            <span className={`text-[11px] px-2 py-0.5 rounded-full transition-all ${!filters.category ? 'bg-black text-white' : 'bg-gray-100 text-black/40 group-hover:bg-black group-hover:text-white'}`}>
              {stats.totalProducts || 0}
            </span>
          </li>

          {categories.map((cat) => (
            <li
              key={cat}
              className={`flex justify-between items-center group cursor-pointer ${filters.category === cat ? "font-bold" : ""}`}
              onClick={() => toggleFilter("category", cat)}
            >
              <span
                className={`text-[14px] transition-colors font-sofia-pro ${filters.category === cat ? "text-black" : "text-black/60 group-hover:text-black"}`}
              >
                {cat}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-6">
        <h4 className="text-[13px] font-bold uppercase tracking-widest text-black font-sofia-pro border-b border-gray-100 pb-3">
          Filter by Color
        </h4>
        <div className="flex gap-3 flex-wrap">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => toggleFilter("color", color)}
              className={`w-6 h-6 rounded-full border transition-transform hover:scale-110 ${filters.color === color ? "ring-2 ring-black ring-offset-2" : "border-gray-200"}`}
              style={{
                backgroundColor: isHex(color) ? color : (colorMap[color] || color.toLowerCase()),
              }}
              title={color}
            />
          ))}
        </div>
      </div>

      {garmentSizes.length > 0 && (
        <div className="flex flex-col gap-6">
          <h4 className="text-[13px] font-bold uppercase tracking-widest text-black font-sofia-pro border-b border-gray-100 pb-3">
            Choose a Size
          </h4>
          <div className="flex gap-2 flex-wrap">
            {garmentSizes.map((size) => (
              <button
                key={size}
                onClick={() => toggleFilter("size", size)}
                className={`px-4 py-2 border text-[12px] font-medium transition-all font-sofia-pro ${filters.size === size ? "border-black text-black bg-gray-50" : "border-gray-200 text-black/60 hover:border-black hover:text-black"}`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {shoeSizes.length > 0 && (
        <div className="flex flex-col gap-6">
          <h4 className="text-[13px] font-bold uppercase tracking-widest text-black font-sofia-pro border-b border-gray-100 pb-3">
            Shoe Sizes
          </h4>
          <div className="flex gap-2 flex-wrap">
            {shoeSizes.map((size) => (
              <button
                key={size}
                onClick={() => toggleFilter("size", size)}
                className={`px-4 py-2 border text-[12px] font-medium transition-all font-sofia-pro ${filters.size === size ? "border-black text-black bg-gray-50" : "border-gray-200 text-black/60 hover:border-black hover:text-black"}`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
};

export default ShopFilters;
