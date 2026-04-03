import React from 'react';

const StatCard = ({ title, value, icon, trend, trendValue }) => {
  return (
    <div className="bg-white p-8 border border-gray-100 rounded-sm hover:shadow-xl hover:shadow-black/5 transition-all duration-300 group">
      <div className="flex justify-between items-start mb-6">
        <div className="p-3 bg-gray-50 rounded-lg text-black group-hover:bg-black group-hover:text-white transition-colors duration-300">
          {icon}
        </div>
        {trend && (
          <span className={`text-[12px] font-bold font-sofia-pro px-2 py-1 rounded-full ${
            trend === 'up' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
          }`}>
            {trend === 'up' ? '+' : '-'}{trendValue}%
          </span>
        )}
      </div>
      <div>
        <p className="text-[12px] uppercase tracking-widest text-black/40 font-bold font-sofia-pro mb-2">{title}</p>
        <h3 className="text-[28px] font-bold text-black font-gt-walsheim">{value}</h3>
      </div>
    </div>
  );
};

export default StatCard;
