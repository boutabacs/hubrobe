import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FiHome, 
  FiShoppingBag, 
  FiUsers, 
  FiSettings, 
  FiBarChart2, 
  FiBox,
  FiFileText,
  FiLogOut,
  FiTag,
  FiMail
} from 'react-icons/fi';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', icon: <FiHome />, path: '/' },
    { name: 'Products', icon: <FiBox />, path: '/products' },
    { name: 'Blogs', icon: <FiFileText />, path: '/blogs' },
    { name: 'Orders', icon: <FiShoppingBag />, path: '/orders' },
    { name: 'Coupons', icon: <FiTag />, path: '/coupons' },
    { name: 'Customers', icon: <FiUsers />, path: '/customers' },
    { name: 'Newsletters', icon: <FiMail />, path: '/newsletters' },
    { name: 'Analytics', icon: <FiBarChart2 />, path: '/analytics' },
    { name: 'Settings', icon: <FiSettings />, path: '/settings' },
  ];

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    window.location.reload();
  };

  return (
    <aside className={`w-64 h-screen bg-white border-r border-gray-100 fixed left-0 top-0 flex flex-col z-50 transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="p-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-black font-sofia-pro">hubrobe.</h1>
          <span className="text-[10px] uppercase tracking-widest text-black/40 font-bold font-sofia-pro">Admin Panel</span>
        </div>
        {/* Close button for mobile */}
        <button 
          className="lg:hidden p-2 text-black/40 hover:text-black"
          onClick={() => setIsOpen(false)}
        >
          <FiLogOut className="rotate-180" />
        </button>
      </div>

      <nav className="flex-1 px-4 py-4 overflow-y-auto">
        <ul className="flex flex-col gap-2">
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                onClick={() => setIsOpen(false)} // Close sidebar on link click (mobile)
                className={`flex items-center gap-4 px-4 py-3 rounded-lg text-[14px] font-medium transition-all duration-200 ${
                  location.pathname === item.path
                    ? 'bg-black text-white shadow-lg shadow-black/10'
                    : 'text-black/50 hover:bg-gray-50 hover:text-black'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-sofia-pro">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-4 px-4 py-3 w-full text-[14px] font-medium text-red-500 hover:bg-red-50 rounded-lg transition-all font-sofia-pro"
        >
          <FiLogOut className="text-lg" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
