import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ScrollToTop from './components/ScrollToTop';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Blogs from './pages/Blogs';
import Orders from './pages/Orders';
import Customers from './pages/Customers';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Coupons from './pages/Coupons';
import Login from './pages/Login';

function App() {
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
        {/* Fixed Sidebar */}
        <Sidebar />

        {/* Main Content Area (Offset by Sidebar width) */}
        <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/coupons" element={<Coupons />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/login" element={<Navigate to="/" />} />
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
