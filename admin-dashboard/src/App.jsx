import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ScrollToTop from './components/ScrollToTop';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Blogs from './pages/Blogs';
import Orders from './pages/Orders';
import Customers from './pages/Customers';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Coupons from './pages/Coupons';
import Newsletters from './pages/Newsletters';
import Login from './pages/Login';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const adminToken = localStorage.getItem("adminToken");

  if (!adminToken) {
    return (
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <ScrollToTop />
      <div className="flex min-h-screen bg-[#F9FAFB]">
        {/* Sidebar with mobile responsiveness */}
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

        {/* Overlay for mobile sidebar */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content Area */}
        <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
          <Routes>
            <Route path="/" element={<><Header title="Dashboard" setSidebarOpen={setSidebarOpen} /><Dashboard /></>} />
            <Route path="/products" element={<><Header title="Products" setSidebarOpen={setSidebarOpen} /><Products /></>} />
            <Route path="/blogs" element={<><Header title="Blogs" setSidebarOpen={setSidebarOpen} /><Blogs /></>} />
            <Route path="/orders" element={<><Header title="Orders" setSidebarOpen={setSidebarOpen} /><Orders /></>} />
            <Route path="/customers" element={<><Header title="Customers" setSidebarOpen={setSidebarOpen} /><Customers /></>} />
            <Route path="/coupons" element={<><Header title="Coupons" setSidebarOpen={setSidebarOpen} /><Coupons /></>} />
            <Route path="/newsletters" element={<><Newsletters /></>} />
            <Route path="/analytics" element={<><Header title="Analytics" setSidebarOpen={setSidebarOpen} /><Analytics /></>} />
            <Route path="/settings" element={<><Header title="Settings" setSidebarOpen={setSidebarOpen} /><Settings /></>} />
            <Route path="/login" element={<Navigate to="/" />} />
            <Route path="*" element={<><Header title="Dashboard" setSidebarOpen={setSidebarOpen} /><Dashboard /></>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
