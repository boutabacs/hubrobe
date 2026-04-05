import React, { useState } from 'react';
import AccountHero from '../components/AccountHero';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { publicRequest } from '../requestMethods';

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const emailFromState = (location.state?.email || "").trim();

  const [email, setEmail] = useState(emailFromState);
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [resendInfo, setResendInfo] = useState(null);

  const handleResendCode = async () => {
    const trimmed = email.trim();
    if (!trimmed) {
      setResendInfo(null);
      return setError("Enter your email above, then tap « Send code again ».");
    }
    setError(null);
    setResendInfo(null);
    setResendLoading(true);
    try {
      await publicRequest.post("/auth/forgot-password", { email: trimmed }, { timeout: 45000 });
      setResendInfo("A new code has been sent. Check your inbox (and spam).");
      setCode("");
    } catch (err) {
      const d = err.response?.data;
      let msg = "Could not send a code. Try again or use « Forgot password » from login.";
      if (typeof d === "string") msg = d;
      else if (d?.message) msg = d.message;
      setError(msg);
    } finally {
      setResendLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return setError("Passwords do not match!");
    }
    const trimmedEmail = email.trim();
    const codeDigits = code.replace(/\s/g, "");
    if (!trimmedEmail) {
      return setError("Please enter your email address.");
    }
    if (codeDigits.length !== 6) {
      return setError("Please enter the 6-digit code from your email.");
    }

    setLoading(true);
    setError(null);
    try {
      await publicRequest.post("/auth/reset-password", {
        email: trimmedEmail,
        code: codeDigits,
        newPassword,
      });
      setMessage("Password reset successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      const d = err.response?.data;
      let errorMessage = "Failed to reset password. Check the code and try again.";
      if (typeof d === "string") errorMessage = d;
      else if (d?.message) errorMessage = d.message;
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full bg-white pb-20 md:pb-32">
      <AccountHero />
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full mt-16 md:mt-24">
        <h2 className="text-[32px] md:text-[40px] font-bold text-black mb-10 font-gt-walsheim">
          Reset Password
        </h2>
        <div className="max-w-2xl border border-gray-100 p-8 md:p-12">
          <p className="text-[14px] text-black/60 font-sofia-pro mb-6 leading-relaxed">
            The email with your code is sent when you submit the <strong>Lost password</strong> form (previous step), not when this page opens. Delivery can take a minute.
          </p>
          <p className="text-[14px] text-black/60 font-sofia-pro mb-8 leading-relaxed">
            Opened this page from the email link without a code? Enter your email and use <strong>Send code again</strong> below.
          </p>
          <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-bold uppercase tracking-widest text-black font-sofia-pro">
                Email address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-100 p-4 outline-none focus:border-black transition-colors font-sofia-pro text-[14px]"
              />
              <button
                type="button"
                onClick={handleResendCode}
                disabled={resendLoading}
                className="self-start text-left text-[13px] font-bold uppercase tracking-widest font-sofia-pro text-black underline underline-offset-4 hover:text-black/70 disabled:opacity-50"
              >
                {resendLoading ? "Sending…" : "Send code again"}
              </button>
              {resendInfo && (
                <p className="text-green-600 text-[13px] font-sofia-pro">{resendInfo}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-bold uppercase tracking-widest text-black font-sofia-pro">
                Verification code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                maxLength={6}
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete="one-time-code"
                placeholder="6-digit code"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="w-full border border-gray-100 p-4 outline-none focus:border-black transition-colors font-sofia-pro text-[14px] tracking-[5px] text-center font-bold"
              />
            </div>

            <div className="flex flex-col gap-2 relative">
              <label className="text-[13px] font-bold uppercase tracking-widest text-black font-sofia-pro">
                New password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
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

            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-bold uppercase tracking-widest text-black font-sofia-pro">
                Confirm new password <span className="text-red-500">*</span>
              </label>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border border-gray-100 p-4 outline-none focus:border-black transition-colors font-sofia-pro text-[14px]"
              />
            </div>

            {error && (
              <p className="text-red-500 text-[13px] font-sofia-pro bg-red-50 p-4 border border-red-100 rounded-sm">
                {error}
              </p>
            )}

            {message && (
              <p className="text-green-600 text-[13px] font-sofia-pro bg-green-50 p-4 border border-green-100 rounded-sm">
                {message}
              </p>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="px-10 py-4 bg-black text-white text-[13px] font-bold uppercase tracking-widest font-sofia-pro hover:bg-black/80 transition-all disabled:bg-black/50"
              >
                {loading ? "Resetting..." : "Save new password"}
              </button>
            </div>

            <div className="mt-4 flex flex-col gap-2">
              <Link to="/forgot-password" className="text-[14px] text-black font-bold hover:underline font-sofia-pro">
                Request a new code
              </Link>
              <Link to="/login" className="text-[14px] text-black font-bold hover:underline font-sofia-pro">
                Back to login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
