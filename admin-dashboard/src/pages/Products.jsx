import React, { useEffect, useState } from 'react';
import { FiPlus, FiSearch, FiFilter, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { publicRequest, userRequest } from '../requestMethods';
import AddProductModal from '../components/AddProductModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await publicRequest.get("/products");
        setProducts(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    getProducts();
  }, []);

  const handleProductAdded = (newProduct, isEdit) => {
    if (isEdit) {
      setProducts((prev) => 
        prev.map((item) => (item._id === newProduct._id ? newProduct : item))
      );
    } else {
      setProducts((prev) => [newProduct, ...prev]);
    }
    setSelectedProduct(null);
  };

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedProduct) return;
    setActionLoading(true);
    try {
      await userRequest.delete(`/products/${selectedProduct._id}`);
      setProducts((prev) => prev.filter((item) => item._id !== selectedProduct._id));
      setIsDeleteModalOpen(false);
      setSelectedProduct(null);
    } catch (err) {
      console.error("Failed to delete product:", err);
      alert("Failed to delete product. Only admins can do this.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="flex-1 min-h-screen bg-[#F9FAFB]">
      <main className="p-4 md:p-8">
        {/* Actions Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30" />
              <input 
                type="text" 
                placeholder="Search products..." 
                className="w-full bg-white border border-gray-100 pl-12 pr-4 py-3 rounded-sm text-[14px] font-sofia-pro focus:border-black outline-none transition-all"
              />
            </div>
            <button className="p-3 bg-white border border-gray-100 rounded-sm hover:bg-gray-50 transition-colors">
              <FiFilter size={20} />
            </button>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-sm text-[13px] font-bold uppercase tracking-widest font-sofia-pro hover:bg-black/80 transition-all"
          >
            <FiPlus /> Add Product
          </button>
        </div>

        {/* Mobile View: Product Cards */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {loading ? (
            <div className="bg-white p-8 text-center border border-gray-100">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black mx-auto"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white p-8 text-center border border-gray-100 text-black/40 font-sofia-pro text-[14px]">No products found.</div>
          ) : (
            products.map((product) => (
              <div key={product._id} className="bg-white border border-gray-100 p-4 rounded-sm flex flex-col gap-4">
                <div className="flex gap-4">
                  <div className="w-20 h-24 bg-gray-100 rounded-sm overflow-hidden flex-shrink-0">
                    <img 
                      src={Array.isArray(product.img) ? product.img[0] : product.img} 
                      alt={product.title} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[14px] font-bold text-black font-gt-walsheim mb-1">{product.title}</h3>
                    <p className="text-[12px] text-black/40 font-sofia-pro truncate mb-2">{product.categories?.join(", ")}</p>
                    <div className="flex items-center gap-3">
                      <span className="text-[14px] font-bold text-black font-gt-walsheim">${product.price}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest font-sofia-pro ${
                        product.countInStock > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                      }`}>
                        {product.countInStock > 0 ? `${product.countInStock} in stock` : "Out of Stock"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-3 border-t border-gray-50">
                  <button 
                    onClick={() => handleEditClick(product)}
                    className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-widest text-black/60 hover:text-black font-sofia-pro"
                  >
                    <FiEdit2 size={14} /> Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteClick(product)}
                    className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-widest text-red-400 hover:text-red-600 font-sofia-pro"
                  >
                    <FiTrash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop View: Products Table */}
        <div className="hidden md:block bg-white border border-gray-100 rounded-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-black/40 font-sofia-pro">Product</th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-black/40 font-sofia-pro">Category</th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-black/40 font-sofia-pro">Price</th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-black/40 font-sofia-pro">Quantity</th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-black/40 font-sofia-pro">Status</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-14 bg-gray-100 rounded-sm overflow-hidden flex-shrink-0">
                          <img 
                            src={Array.isArray(product.img) ? product.img[0] : product.img} 
                            alt={product.title} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                          />
                        </div>
                        <span className="text-[14px] font-bold text-black font-gt-walsheim">{product.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[13px] text-black/60 font-sofia-pro">{product.categories?.join(", ")}</td>
                    <td className="px-6 py-4 text-[13px] font-bold text-black font-gt-walsheim">${product.price}</td>
                    <td className="px-6 py-4 text-[13px] text-black/60 font-sofia-pro">
                      {product.countInStock || 0}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest font-sofia-pro ${
                        product.countInStock > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                      }`}>
                        {product.countInStock > 0 ? "In Stock" : "Out of Stock"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleEditClick(product)}
                          className="p-2 text-black/20 hover:text-black transition-colors"
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(product)}
                          className="p-2 text-black/20 hover:text-red-500 transition-colors"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="p-6 border-t border-gray-50 flex justify-between items-center">
            <span className="text-[13px] text-black/40 font-sofia-pro">Showing {products.length} products</span>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-gray-100 text-[12px] font-bold uppercase font-sofia-pro hover:bg-gray-50 disabled:opacity-50">Prev</button>
              <button className="px-4 py-2 bg-black text-white text-[12px] font-bold uppercase font-sofia-pro">Next</button>
            </div>
          </div>
        </div>
      </main>

      <AddProductModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProduct(null);
        }} 
        onProductAdded={handleProductAdded}
        editData={selectedProduct}
      />

      <DeleteConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedProduct(null);
        }}
        onConfirm={handleDeleteConfirm}
        title={selectedProduct?.title}
        loading={actionLoading}
      />
    </div>
  );
};

export default Products;
