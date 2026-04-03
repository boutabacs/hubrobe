import React from 'react';
import { FiSearch, FiBell, FiUser } from 'react-icons/fi';

const Header = ({ title }) => {
  return (
    <header className="h-20 bg-white border-b border-gray-100 px-8 flex items-center justify-between sticky top-0 z-40">
      <h2 className="text-[20px] font-bold text-black font-sofia-pro uppercase tracking-widest">{title}</h2>

      <div className="flex items-center gap-8">
        {/* Search */}
        <div className="hidden md:flex items-center relative">
          <FiSearch className="absolute left-4 text-black/30" />
          <input 
            type="text" 
            placeholder="Search anything..." 
            className="bg-gray-50 border-none pl-12 pr-4 py-2 rounded-full text-[13px] font-sofia-pro focus:ring-1 focus:ring-black outline-none w-64 transition-all"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 text-black/40 hover:text-black transition-colors">
          <FiBell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-4 border-l border-gray-100">
          <div className="text-right hidden sm:block">
            <p className="text-[13px] font-bold text-black font-sofia-pro">Admin Hub</p>
            <p className="text-[11px] text-black/40 font-medium font-sofia-pro">Super Admin</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-black/40 border border-gray-200">
            <FiUser size={20} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
