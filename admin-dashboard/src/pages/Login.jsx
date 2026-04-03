import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff, FiLock, FiUser } from 'react-icons/fi';
import { publicRequest } from '../requestMethods';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    try {
      const res = await publicRequest.post("/auth/login", { username, password });
      
      if (res.data.isAdmin) {
        localStorage.setItem("adminToken", res.data.accessToken);
        localStorage.setItem("adminUser", JSON.stringify(res.data));
        navigate("/");
        window.location.reload(); // Pour rafraîchir le token dans requestMethods
      } else {
        setError("You are not authorized to access the admin panel.");
      }
    } catch (err) {
      setError("Invalid credentials. Please try again.");
      console.log("Admin Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white border border-gray-100 p-10 md:p-12 shadow-2xl shadow-black/5">
        <div className="flex flex-col items-center mb-10">
          <img src="/assets/logo.svg" alt="hubröbé" className="h-6 mb-8" />
          <h2 className="text-[24px] font-bold text-black font-gt-walsheim uppercase tracking-widest">Admin Portal</h2>
          <p className="text-[14px] text-black/40 font-sofia-pro mt-2 text-center">Enter your credentials to manage your store</p>
        </div>

        <form className="flex flex-col gap-6" onSubmit={handleLogin}>
          {/* Username Field */}
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-bold uppercase tracking-widest text-black/40 font-sofia-pro">
              Username
            </label>
            <div className="relative">
              <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20" />
              <input 
                type="text" 
                required
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full border border-gray-100 pl-12 pr-4 py-4 outline-none focus:border-black transition-colors font-sofia-pro text-[14px]"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="flex flex-col gap-2 relative">
            <label className="text-[11px] font-bold uppercase tracking-widest text-black/40 font-sofia-pro">
              Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20" />
              <input 
                type={showPassword ? "text" : "password"} 
                required
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-gray-100 pl-12 pr-12 py-4 outline-none focus:border-black transition-colors font-sofia-pro text-[14px]"
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-black/40 hover:text-black transition-colors"
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 p-4">
              <p className="text-red-500 text-[13px] font-sofia-pro text-center">{error}</p>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="mt-4 w-full py-4 bg-black text-white text-[13px] font-bold uppercase tracking-widest font-sofia-pro hover:bg-black/80 transition-all disabled:bg-black/50"
          >
            {loading ? "Authenticating..." : "Login to Dashboard"}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-gray-50 text-center">
          <p className="text-[12px] text-black/30 font-sofia-pro">
            &copy; 2026 hubröbé. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
