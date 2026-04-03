import React, { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiEdit2, FiTag } from 'react-icons/fi';
import { userRequest } from '../requestMethods';
import AddCouponModal from '../components/AddCouponModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const fetchCoupons = async () => {
    try {
      const res = await userRequest.get("/coupons");
      setCoupons(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCouponAdded = (coupon, isEdit) => {
    if (isEdit) {
      setCoupons(prev => prev.map(c => c._id === coupon._id ? coupon : c));
    } else {
      setCoupons(prev => [coupon, ...prev]);
    }
  };

  const handleDelete = async () => {
    try {
      await userRequest.delete(`/coupons/${deleteId}`);
      setCoupons(prev => prev.filter(c => c._id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gray-50/50">
      <main className="p-4 md:p-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h2 className="text-[24px] font-bold text-black font-sofia-pro">All Coupons</h2>
            <p className="text-[14px] text-black/40 font-sofia-pro">Manage your promotional codes and discounts.</p>
          </div>
          <button 
            onClick={() => { setEditData(null); setIsModalOpen(true); }}
            className="flex items-center gap-2 bg-black text-white px-6 py-3.5 text-[12px] font-bold uppercase tracking-widest hover:bg-black/80 transition-all font-sofia-pro"
          >
            <FiPlus size={18} /> Add New Coupon
          </button>
        </div>

        <div className="bg-white border border-gray-100 rounded-sm overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-black/40 font-sofia-pro">Code</th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-black/40 font-sofia-pro">Discount</th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-black/40 font-sofia-pro">Expiry</th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-black/40 font-sofia-pro">Status</th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-black/40 font-sofia-pro text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black mx-auto"></div>
                    </td>
                  </tr>
                ) : coupons.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-3 opacity-20">
                        <FiTag size={48} />
                        <p className="text-[14px] font-bold uppercase tracking-widest font-sofia-pro">No coupons found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  coupons.map((coupon) => (
                    <tr key={coupon._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-5">
                        <span className="text-[14px] font-bold text-black font-sofia-pro bg-gray-100 px-3 py-1 rounded-sm uppercase tracking-wider">
                          {coupon.code}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-[14px] font-medium text-black font-sofia-pro">
                          {coupon.discountType === 'percentage' ? `${coupon.discount}%` : `$${coupon.discount}`}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-[14px] text-black/60 font-sofia-pro">
                          {new Date(coupon.expiryDate).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full ${
                          coupon.isActive 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-red-100 text-red-600'
                        }`}>
                          {coupon.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => { setEditData(coupon); setIsModalOpen(true); }}
                            className="p-2 text-black/40 hover:text-black transition-colors"
                          >
                            <FiEdit2 size={18} />
                          </button>
                          <button 
                            onClick={() => setDeleteId(coupon._id)}
                            className="p-2 text-black/40 hover:text-red-500 transition-colors"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <AddCouponModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onCouponAdded={handleCouponAdded}
        editData={editData}
      />

      <DeleteConfirmModal 
        isOpen={!!deleteId} 
        onClose={() => setDeleteId(null)} 
        onConfirm={handleDelete}
        title="Delete Coupon"
        message="Are you sure you want to delete this coupon? This action cannot be undone."
      />
    </div>
  );
};

export default Coupons;