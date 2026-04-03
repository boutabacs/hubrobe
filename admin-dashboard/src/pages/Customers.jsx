import React, { useEffect, useState } from 'react';
import { FiSearch, FiMail, FiPhone, FiMoreHorizontal } from 'react-icons/fi';
import { userRequest } from '../requestMethods';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCustomers = async () => {
      try {
        const res = await userRequest.get("/users");
        setCustomers(res.data);
      } catch (err) {
        console.log("Error fetching customers:", err);
      } finally {
        setLoading(false);
      }
    };
    getCustomers();
  }, []);

  return (
    <div className="flex-1 min-h-screen bg-[#F9FAFB]">
      <main className="p-4 md:p-8">
        {/* Search */}
        <div className="mb-8">
          <div className="relative w-full md:w-96">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30" />
            <input 
              type="text" 
              placeholder="Search by name, email or phone..." 
              className="w-full bg-white border border-gray-100 pl-12 pr-4 py-3 rounded-sm text-[14px] font-sofia-pro focus:border-black outline-none transition-all"
            />
          </div>
        </div>

        {/* Customers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8">
          {loading ? (
            <div className="col-span-full flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
            </div>
          ) : customers.length === 0 ? (
            <div className="col-span-full text-center py-20 text-black/40 font-sofia-pro">No customers found.</div>
          ) : (
            customers.map((customer) => (
              <div key={customer._id} className="bg-white border border-gray-100 p-8 rounded-sm hover:shadow-xl hover:shadow-black/5 transition-all group">
                <div className="flex justify-between items-start mb-6">
                  {customer.img ? (
                    <img src={customer.img} alt={customer.username} className="w-16 h-16 rounded-full object-cover border border-gray-100" />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-[20px] font-bold text-black font-sofia-pro">
                      {customer.username.charAt(0)}
                    </div>
                  )}
                  <button className="text-black/20 hover:text-black transition-colors"><FiMoreHorizontal size={20} /></button>
                </div>
                
                <h3 className="text-[18px] font-bold text-black font-gt-walsheim mb-1">{customer.username}</h3>
                <span className={`text-[10px] font-bold uppercase tracking-widest font-sofia-pro ${
                  customer.isAdmin ? 'text-blue-500' : 'text-green-500'
                }`}>{customer.isAdmin ? 'Admin' : 'Customer'}</span>

                <div className="mt-8 flex flex-col gap-4">
                  <div className="flex items-center gap-3 text-black/60 text-[13px] font-sofia-pro">
                    <FiMail className="flex-shrink-0" />
                    <span className="truncate">{customer.email}</span>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-50 flex justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-black/40 font-bold font-sofia-pro">Joined</p>
                    <p className="text-[14px] font-bold text-black font-gt-walsheim">{new Date(customer.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default Customers;
