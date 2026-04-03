import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { userRequest } from '../requestMethods';

const AddCouponModal = ({ isOpen, onClose, onCouponAdded, editData }) => {
  const [inputs, setInputs] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (editData) {
      setInputs({
        code: editData.code,
        discount: editData.discount,
        discountType: editData.discountType,
        expiryDate: editData.expiryDate.split('T')[0],
        isActive: editData.isActive?.toString() || "true",
      });
    } else {
      setInputs({ discountType: "percentage", isActive: "true" });
    }
  }, [editData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setInputs((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const coupon = { 
      ...inputs, 
      discount: Number(inputs.discount),
      isActive: inputs.isActive === "true"
    };

    try {
      let res;
      if (editData) {
        res = await userRequest.put(`/coupons/${editData._id}`, coupon);
      } else {
        res = await userRequest.post("/coupons", coupon);
      }
      onCouponAdded(res.data, !!editData);
      onClose();
    } catch (err) {
      setError(`Failed to ${editData ? 'update' : 'add'} coupon. Please check your data.`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-md rounded-sm shadow-2xl">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-[18px] font-bold uppercase tracking-widest text-black font-sofia-pro">
            {editData ? "Edit Coupon" : "Add New Coupon"}
          </h2>
          <button onClick={onClose} className="text-black/40 hover:text-black transition-colors">
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-bold uppercase tracking-widest text-black/40 font-sofia-pro">Coupon Code</label>
            <input 
              name="code" 
              type="text" 
              required 
              value={inputs.code || ""}
              placeholder="e.g. SUMMER20"
              onChange={handleChange}
              className="w-full border border-gray-100 p-4 outline-none focus:border-black transition-colors font-sofia-pro text-[14px] uppercase"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-bold uppercase tracking-widest text-black/40 font-sofia-pro">Discount</label>
              <input 
                name="discount" 
                type="number" 
                required 
                value={inputs.discount || ""}
                placeholder="20"
                onChange={handleChange}
                className="w-full border border-gray-100 p-4 outline-none focus:border-black transition-colors font-sofia-pro text-[14px]"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-bold uppercase tracking-widest text-black/40 font-sofia-pro">Type</label>
              <select 
                name="discountType" 
                value={inputs.discountType || "percentage"}
                onChange={handleChange}
                className="w-full border border-gray-100 p-4 outline-none focus:border-black transition-colors font-sofia-pro text-[14px] appearance-none bg-white"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="flat">Flat Amount ($)</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-bold uppercase tracking-widest text-black/40 font-sofia-pro">Expiry Date</label>
            <input 
              name="expiryDate" 
              type="date" 
              required 
              value={inputs.expiryDate || ""}
              onChange={handleChange}
              className="w-full border border-gray-100 p-4 outline-none focus:border-black transition-colors font-sofia-pro text-[14px]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-bold uppercase tracking-widest text-black/40 font-sofia-pro">Status</label>
            <select 
              name="isActive" 
              value={inputs.isActive || "true"}
              onChange={handleChange}
              className="w-full border border-gray-100 p-4 outline-none focus:border-black transition-colors font-sofia-pro text-[14px] appearance-none bg-white"
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          {error && <p className="text-red-500 text-[13px] font-sofia-pro text-center">{error}</p>}

          <div className="flex gap-4 mt-4">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-4 border border-gray-100 text-[13px] font-bold uppercase tracking-widest font-sofia-pro hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="flex-1 py-4 bg-black text-white text-[13px] font-bold uppercase tracking-widest font-sofia-pro hover:bg-black/80 transition-all disabled:bg-black/50"
            >
              {loading ? "Saving..." : (editData ? "Update" : "Create")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCouponModal;