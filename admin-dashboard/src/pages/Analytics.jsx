import React from 'react';
import { FiTrendingUp, FiTrendingDown, FiPieChart, FiBarChart2, FiCalendar } from 'react-icons/fi';

const Analytics = () => {
  return (
    <div className="flex-1 min-h-screen bg-[#F9FAFB]">
      <main className="p-4 md:p-8">
        {/* Date Range Selector */}
        <div className="flex justify-end mb-8">
          <button className="flex items-center gap-3 bg-white border border-gray-100 px-6 py-3 rounded-sm text-[13px] font-bold uppercase tracking-widest font-sofia-pro hover:bg-gray-50 transition-all">
            <FiCalendar /> Last 30 Days
          </button>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Revenue Chart Placeholder */}
          <div className="bg-white border border-gray-100 p-8 rounded-sm">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-[16px] font-bold text-black font-sofia-pro uppercase tracking-widest">Revenue Growth</h3>
              <div className="flex items-center gap-2 text-green-500">
                <FiTrendingUp />
                <span className="text-[12px] font-bold">+12.5%</span>
              </div>
            </div>
            {/* Simple CSS Chart */}
            <div className="h-64 flex items-end gap-2 px-2">
              {[40, 65, 35, 85, 55, 95, 75, 45, 60, 80, 70, 90].map((h, i) => (
                <div key={i} className="flex-1 bg-gray-50 hover:bg-black transition-all duration-300 rounded-t-sm relative group">
                  <div style={{ height: `${h}%` }} className="w-full bg-current opacity-10 group-hover:opacity-100"></div>
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    ${(h * 150).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-between text-[10px] uppercase tracking-widest text-black/20 font-bold font-sofia-pro">
              <span>Jan</span>
              <span>Jun</span>
              <span>Dec</span>
            </div>
          </div>

          {/* Sales by Category */}
          <div className="bg-white border border-gray-100 p-8 rounded-sm">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-[16px] font-bold text-black font-sofia-pro uppercase tracking-widest">Sales by Category</h3>
              <FiPieChart className="text-black/20" size={20} />
            </div>
            <div className="flex flex-col gap-6">
              {[
                { name: 'Hoodies', value: 45, color: 'bg-black' },
                { name: 'T-shirts', value: 30, color: 'bg-gray-400' },
                { name: 'Party Collection', value: 15, color: 'bg-gray-200' },
                { name: 'Digital Products', value: 10, color: 'bg-gray-100' },
              ].map((cat) => (
                <div key={cat.name} className="flex flex-col gap-2">
                  <div className="flex justify-between text-[13px] font-sofia-pro">
                    <span className="font-bold text-black">{cat.name}</span>
                    <span className="text-black/40">{cat.value}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-50 rounded-full overflow-hidden">
                    <div style={{ width: `${cat.value}%` }} className={`h-full ${cat.color}`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Detailed Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white border border-gray-100 p-8 rounded-sm">
            <p className="text-[11px] uppercase tracking-widest text-black/40 font-bold font-sofia-pro mb-4">Average Order Value</p>
            <h4 className="text-[32px] font-bold text-black font-gt-walsheim mb-2">$84.50</h4>
            <span className="text-[12px] font-bold text-green-500 font-sofia-pro">+2.4% vs last month</span>
          </div>
          <div className="bg-white border border-gray-100 p-8 rounded-sm">
            <p className="text-[11px] uppercase tracking-widest text-black/40 font-bold font-sofia-pro mb-4">Conversion Rate</p>
            <h4 className="text-[32px] font-bold text-black font-gt-walsheim mb-2">3.8%</h4>
            <span className="text-[12px] font-bold text-red-500 font-sofia-pro">-0.5% vs last month</span>
          </div>
          <div className="bg-white border border-gray-100 p-8 rounded-sm">
            <p className="text-[11px] uppercase tracking-widest text-black/40 font-bold font-sofia-pro mb-4">Repeat Customer Rate</p>
            <h4 className="text-[32px] font-bold text-black font-gt-walsheim mb-2">24.2%</h4>
            <span className="text-[12px] font-bold text-green-500 font-sofia-pro">+5.1% vs last month</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Analytics;
