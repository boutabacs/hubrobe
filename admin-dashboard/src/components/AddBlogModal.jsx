import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { userRequest } from '../requestMethods';
import TiptapEditor from './TiptapEditor';

const AddBlogModal = ({ isOpen, onClose, onBlogAdded, editData }) => {
  const [inputs, setInputs] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      if (editData) {
        setInputs({
          title: editData.title || '',
          desc: editData.desc || '',
          content: editData.content || '',
          img: editData.img || '',
          status: editData.status || 'draft',
          author: editData.author || 'Admin',
        });
      } else {
        setInputs({ title: '', desc: '', content: '', img: '', status: 'draft', author: 'Admin' });
      }
    }
  }, [editData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleContentChange = (newContent) => {
    setInputs((prev) => ({ ...prev, content: newContent }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const blogData = { ...inputs };

    try {
      let res;
      if (editData) {
        res = await userRequest.put(`/articles/${editData._id}`, blogData);
      } else {
        res = await userRequest.post("/articles", blogData);
      }
      onBlogAdded(res.data, !!editData);
      onClose();
    } catch (err) {
      setError(`Failed to ${editData ? 'update' : 'add'} blog. Please check your data.`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-5xl max-h-[95vh] overflow-hidden rounded-sm shadow-2xl flex flex-col">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white shrink-0">
          <div className="flex flex-col">
            <h2 className="text-[18px] font-bold uppercase tracking-widest text-black font-sofia-pro leading-none">
              {editData ? "Edit Blog Post" : "Add New Blog Post"}
            </h2>
            <p className="text-[10px] text-gray-400 font-sofia-pro uppercase tracking-widest mt-1">
              Create rich content for your news section
            </p>
          </div>
          <button onClick={onClose} className="text-black/40 hover:text-black transition-colors">
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleClick} className="flex-1 overflow-y-auto p-8 flex flex-col gap-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="md:col-span-2 flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-black/40 font-sofia-pro">Blog Title</label>
                <input 
                  name="title" 
                  type="text" 
                  required 
                  value={inputs.title}
                  placeholder="e.g. New Fashion Trends 2024"
                  onChange={handleChange}
                  className="w-full border border-gray-100 p-4 outline-none focus:border-black transition-colors font-sofia-pro text-[14px]"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-black/40 font-sofia-pro">Short Description (Summary)</label>
                <textarea 
                  name="desc" 
                  rows="3" 
                  required 
                  value={inputs.desc}
                  placeholder="A brief summary of the article..."
                  onChange={handleChange}
                  className="w-full border border-gray-100 p-4 outline-none focus:border-black transition-colors font-sofia-pro text-[14px] resize-none"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-black/40 font-sofia-pro">Full Content</label>
                <TiptapEditor
                  content={inputs.content}
                  onChange={handleContentChange}
                />
              </div>
            </div>

            {/* Sidebar Settings Area */}
            <div className="flex flex-col gap-6 bg-gray-50/50 p-6 rounded-sm border border-gray-100 h-fit">
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-black/40 font-sofia-pro">Featured Image URL</label>
                <input 
                  name="img" 
                  type="text" 
                  required 
                  value={inputs.img}
                  placeholder="e.g. /assets/news/news1.jpg"
                  onChange={handleChange}
                  className="w-full border border-gray-100 p-4 outline-none focus:border-black transition-colors font-sofia-pro text-[13px] bg-white"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-black/40 font-sofia-pro">Author</label>
                <input 
                  name="author" 
                  type="text" 
                  value={inputs.author}
                  onChange={handleChange}
                  className="w-full border border-gray-100 p-4 outline-none focus:border-black transition-colors font-sofia-pro text-[13px] bg-white"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-black/40 font-sofia-pro">Publishing Status</label>
                <select 
                  name="status" 
                  value={inputs.status}
                  onChange={handleChange}
                  className="w-full border border-gray-100 p-4 outline-none focus:border-black transition-colors font-sofia-pro text-[13px] bg-white appearance-none"
                >
                  <option value="draft">Brouillon (Draft)</option>
                  <option value="published">Publié (Published)</option>
                </select>
              </div>

              {error && (
                <p className="text-red-500 text-[12px] font-medium font-sofia-pro bg-red-50 p-3 rounded-sm">{error}</p>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="mt-4 w-full bg-black text-white py-4 text-[13px] font-bold uppercase tracking-widest font-sofia-pro hover:bg-black/80 transition-all disabled:opacity-50 flex items-center justify-center"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  editData ? "Update Blog Post" : "Create Blog Post"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBlogModal;
