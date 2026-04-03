import React, { useState, useEffect } from 'react';
import { FiX, FiUpload, FiPlus, FiTrash2 } from 'react-icons/fi';
import { userRequest } from '../requestMethods';

const AddProductModal = ({ isOpen, onClose, onProductAdded, editData }) => {
  const [inputs, setInputs] = useState({});
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [isShoe, setIsShoe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (editData) {
      setInputs({
        title: editData.title,
        desc: editData.desc,
        price: editData.price,
        countInStock: editData.countInStock || 0,
        inStock: editData.inStock?.toString() || "true",
      });
      setCategories(editData.categories || []);
      setImages(editData.img || []);
      setColors(editData.color || []);
      setSizes(editData.size || []);
      setIsShoe(editData.categories?.some(cat => 
        cat.toLowerCase().includes('shoe') || 
        cat.toLowerCase().includes('chaussure') ||
        cat.toLowerCase().includes('sneaker') ||
        cat.toLowerCase().includes('footwear')
      ));
    } else {
      setInputs({ inStock: "true" });
      setCategories([]);
      setImages([]);
      setColors([]);
      setSizes([]);
      setIsShoe(false);
    }
  }, [editData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setInputs((prev) => {
      const val = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
      const newInputs = { ...prev, [e.target.name]: val };
      
      // Si on choisit "Out of Stock", on met la quantité à 0 automatiquement
      if (e.target.name === 'inStock' && val === 'false') {
        newInputs.countInStock = 0;
      }
      
      return newInputs;
    });
  };

  const handleImages = (e) => {
    setImages(e.target.value.split(",").map(img => img.trim()));
  };

  const handleCat = (e) => {
    const cats = e.target.value.split(",").map(cat => cat.trim());
    setCategories(cats);
    
    // Détecter si c'est une chaussure pour changer l'affichage des tailles
    const shoeDetected = cats.some(cat => 
      cat.toLowerCase().includes('shoe') || 
      cat.toLowerCase().includes('chaussure') ||
      cat.toLowerCase().includes('sneaker') ||
      cat.toLowerCase().includes('footwear')
    );
    setIsShoe(shoeDetected);
  };

  const handleColors = (e) => {
    setColors(e.target.value.split(",").map(col => col.trim()));
  };

  const handleSizes = (e) => {
    setSizes(e.target.value.split(",").map(size => size.trim()));
  };

  const handleSizeToggle = (size) => {
    setSizes(prev => 
      prev.includes(size) 
        ? prev.filter(s => s !== size) 
        : [...prev, size]
    );
  };

  const garmentSizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const shoeSizes = ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45"];

  const handleClick = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const product = { 
      ...inputs, 
      img: images,
      categories, 
      color: colors, 
      size: sizes,
      price: Number(inputs.price),
      countInStock: Number(inputs.countInStock || 0),
      inStock: inputs.inStock === "true"
    };

    try {
      let res;
      if (editData) {
        res = await userRequest.put(`/products/${editData._id}`, product);
      } else {
        res = await userRequest.post("/products", product);
      }
      onProductAdded(res.data, !!editData);
      onClose();
    } catch (err) {
      setError(`Failed to ${editData ? 'update' : 'add'} product. Please check your data.`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-sm shadow-2xl">
        <div className="sticky top-0 bg-white z-10 p-4 md:p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-[16px] md:text-[18px] font-bold uppercase tracking-widest text-black font-sofia-pro">
            {editData ? "Edit Product" : "Add New Product"}
          </h2>
          <button onClick={onClose} className="text-black/40 hover:text-black transition-colors">
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleClick} className="p-4 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Basic Info */}
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-black/40 font-sofia-pro">Product Title</label>
                <input 
                  name="title" 
                  type="text" 
                  required 
                  value={inputs.title || ""}
                  placeholder="e.g. Wild Cosmos Hoodie"
                  onChange={handleChange}
                  className="w-full border border-gray-100 p-4 outline-none focus:border-black transition-colors font-sofia-pro text-[14px]"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-black/40 font-sofia-pro">Description</label>
                <textarea 
                  name="desc" 
                  rows="4" 
                  required 
                  value={inputs.desc || ""}
                  placeholder="Tell something about this product..."
                  onChange={handleChange}
                  className="w-full border border-gray-100 p-4 outline-none focus:border-black transition-colors font-sofia-pro text-[14px] resize-none"
                ></textarea>
              </div>

              <div className={`grid ${inputs.inStock === "false" ? "grid-cols-1" : "grid-cols-2"} gap-4 transition-all duration-300`}>
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-black/40 font-sofia-pro">Price ($)</label>
                  <input 
                    name="price" 
                    type="number" 
                    required 
                    value={inputs.price || ""}
                    placeholder="29.99"
                    onChange={handleChange}
                    className="w-full border border-gray-100 p-4 outline-none focus:border-black transition-colors font-sofia-pro text-[14px]"
                  />
                </div>
                {inputs.inStock !== "false" && (
                  <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-right-2 duration-300">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-black/40 font-sofia-pro">Quantity in Stock</label>
                    <input 
                      name="countInStock" 
                      type="number" 
                      required 
                      value={inputs.countInStock || ""}
                      placeholder="100"
                      onChange={handleChange}
                      className="w-full border border-gray-100 p-4 outline-none focus:border-black transition-colors font-sofia-pro text-[14px]"
                    />
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-black/40 font-sofia-pro">Stock Status</label>
                <select 
                  name="inStock" 
                  value={inputs.inStock || "true"}
                  onChange={handleChange}
                  className="w-full border border-gray-100 p-4 outline-none focus:border-black transition-colors font-sofia-pro text-[14px] appearance-none bg-white"
                >
                  <option value="true">In Stock</option>
                  <option value="false">Out of Stock</option>
                </select>
              </div>
            </div>

            {/* Right Column: Categories & Media */}
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-black/40 font-sofia-pro">Image URLs (comma separated)</label>
                <input 
                  type="text" 
                  required 
                  value={images.join(", ")}
                  placeholder="url1.jpg, url2.jpg"
                  onChange={handleImages}
                  className="w-full border border-gray-100 p-4 outline-none focus:border-black transition-colors font-sofia-pro text-[14px]"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-black/40 font-sofia-pro">Categories (comma separated)</label>
                <input 
                  type="text" 
                  value={categories.join(", ")}
                  placeholder="men, hoodies, winter"
                  onChange={handleCat}
                  className="w-full border border-gray-100 p-4 outline-none focus:border-black transition-colors font-sofia-pro text-[14px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-black/40 font-sofia-pro">Colors</label>
                  <input 
                    type="text" 
                    value={colors.join(", ")}
                    placeholder="red, blue"
                    onChange={handleColors}
                    className="w-full border border-gray-100 p-4 outline-none focus:border-black transition-colors font-sofia-pro text-[14px]"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-black/40 font-sofia-pro">
                    {isShoe ? "Shoe Sizes" : "Garment Sizes"}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {(isShoe ? shoeSizes : garmentSizes).map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => handleSizeToggle(size)}
                        className={`px-3 py-1.5 text-[12px] font-medium border transition-all ${
                          sizes.includes(size)
                            ? "bg-black text-white border-black"
                            : "bg-white text-black/60 border-gray-100 hover:border-black hover:text-black"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                  <div className="mt-2">
                    <input 
                      type="text" 
                      value={sizes.join(", ")}
                      placeholder="Or type custom sizes (S, M, 42...)"
                      onChange={handleSizes}
                      className="w-full border border-gray-100 p-3 outline-none focus:border-black transition-colors font-sofia-pro text-[13px]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-[13px] font-sofia-pro mt-6 text-center">{error}</p>
          )}

          <div className="mt-10 flex gap-4">
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
              className="flex-2 py-4 bg-black text-white text-[13px] font-bold uppercase tracking-widest font-sofia-pro hover:bg-black/80 transition-all disabled:bg-black/50"
            >
              {loading ? (editData ? "Updating..." : "Creating...") : (editData ? "Update Product" : "Create Product")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
