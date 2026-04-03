import React, { useEffect, useState } from 'react';
import { FiPlus, FiSearch, FiFilter, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { publicRequest, userRequest } from '../requestMethods';
import AddBlogModal from '../components/AddBlogModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const getBlogs = async () => {
      try {
        const res = await publicRequest.get("/articles");
        setBlogs(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    getBlogs();
  }, []);

  const handleBlogAdded = (newBlog, isEdit) => {
    if (isEdit) {
      setBlogs((prev) => 
        prev.map((item) => (item._id === newBlog._id ? newBlog : item))
      );
    } else {
      setBlogs((prev) => [newBlog, ...prev]);
    }
    setSelectedBlog(null);
  };

  const handleEditClick = (blog) => {
    setSelectedBlog(blog);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (blog) => {
    setSelectedBlog(blog);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedBlog) return;
    setActionLoading(true);
    try {
      await userRequest.delete(`/articles/${selectedBlog._id}`);
      setBlogs((prev) => prev.filter((item) => item._id !== selectedBlog._id));
      setIsDeleteModalOpen(false);
      setSelectedBlog(null);
    } catch (err) {
      console.error("Failed to delete blog:", err);
      alert("Failed to delete blog. Only admins can do this.");
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
                placeholder="Search blogs..." 
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
            <FiPlus /> Add Blog
          </button>
        </div>

        {/* Blogs Table */}
        <div className="bg-white border border-gray-100 rounded-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-black/40 font-sofia-pro">Blog</th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-black/40 font-sofia-pro">Date</th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-black/40 font-sofia-pro">Description</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {blogs.map((blog) => (
                  <tr key={blog._id} className="hover:bg-gray-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-14 bg-gray-100 rounded-sm overflow-hidden flex-shrink-0">
                          <img 
                            src={blog.img} 
                            alt={blog.title} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                          />
                        </div>
                        <span className="text-[14px] font-bold text-black font-gt-walsheim">{blog.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[13px] text-black/60 font-sofia-pro">{blog.date}</td>
                    <td className="px-6 py-4 text-[13px] text-black/60 font-sofia-pro max-w-xs truncate">{blog.desc}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleEditClick(blog)}
                          className="p-2 text-black/20 hover:text-black transition-colors"
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(blog)}
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
            <span className="text-[13px] text-black/40 font-sofia-pro">Showing {blogs.length} blogs</span>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-gray-100 text-[12px] font-bold uppercase font-sofia-pro hover:bg-gray-50 disabled:opacity-50">Prev</button>
              <button className="px-4 py-2 bg-black text-white text-[12px] font-bold uppercase font-sofia-pro">Next</button>
            </div>
          </div>
        </div>
      </main>

      <AddBlogModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setSelectedBlog(null);
        }} 
        onBlogAdded={handleBlogAdded}
        editData={selectedBlog}
      />

      <DeleteConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedBlog(null);
        }}
        onConfirm={handleDeleteConfirm}
        title={selectedBlog?.title}
        loading={actionLoading}
      />
    </div>
  );
};

export default Blogs;
