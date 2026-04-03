import React, { useState } from 'react';
import AccountHero from '../components/AccountHero';
import { Link, useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { publicRequest } from '../requestMethods';

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [success, setSuccess] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    setSuccess(false);
    try {
      await publicRequest.post("/auth/register", {
        username,
        email,
        password,
      });
      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(true);
      console.log("Register error:", err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col w-full bg-white pb-20 md:pb-32">
      {/* Hero Section */}
      <AccountHero />

      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full mt-16 md:mt-24">
        <h2 className="text-[32px] md:text-[40px] font-bold text-black mb-10 font-gt-walsheim">
          Register
        </h2>

        {/* Register Form Container */}
        <div className="max-w-7xl mx-auto border border-gray-100 p-8 md:p-12">
          <form className="flex flex-col gap-8" onSubmit={handleRegister}>
            {/* Username Field */}
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-bold uppercase tracking-widest text-black font-sofia-pro">
                Username <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                required
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border border-gray-100 p-4 outline-none focus:border-black transition-colors font-sofia-pro text-[14px]"
              />
            </div>

            {/* Email Field */}
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-bold uppercase tracking-widest text-black font-sofia-pro">
                Email address <span className="text-red-500">*</span>
              </label>
              <input 
                type="email" 
                required
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-100 p-4 outline-none focus:border-black transition-colors font-sofia-pro text-[14px]"
              />
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-2 relative">
              <label className="text-[13px] font-bold uppercase tracking-widest text-black font-sofia-pro">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-100 p-4 outline-none focus:border-black transition-colors font-sofia-pro text-[14px]"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-black/40 hover:text-black"
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-[13px] font-sofia-pro bg-red-50 p-4 border border-red-100 rounded-sm">
                Something went wrong. Username or email might already be taken.
              </p>
            )}

            {success && (
              <p className="text-green-600 text-[13px] font-sofia-pro bg-green-50 p-4 border border-green-100 rounded-sm">
                Account created successfully! Redirecting to login page...
              </p>
            )}

            <p className="text-[14px] text-black/60 font-sofia-pro leading-relaxed">
              Your personal data will be used to support your experience throughout this website, to manage access to your account, and for other purposes described in our <button type="button" className="text-black font-bold hover:underline">privacy policy</button>.
            </p>

            {/* Register Button */}
            <div className="flex flex-wrap items-center gap-6">
              <button 
                type="submit" 
                disabled={loading}
                className="px-10 py-4 bg-black text-white text-[13px] font-bold uppercase tracking-widest font-sofia-pro hover:bg-black/80 transition-all disabled:bg-black/50"
              >
                {loading ? "Creating account..." : "Register"}
              </button>
            </div>

            {/* Link back to login */}
            <div className="flex flex-col gap-4 mt-2">
              <p className="text-[14px] text-black/60 font-sofia-pro">
                Already have an account? <Link to="/login" className="text-black font-bold hover:underline">Log in</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
