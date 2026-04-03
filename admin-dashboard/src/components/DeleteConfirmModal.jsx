import React from 'react';
import { FiX, FiAlertTriangle } from 'react-icons/fi';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, title, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-md rounded-sm shadow-2xl overflow-hidden">
        <div className="p-8 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-6">
            <FiAlertTriangle size={32} />
          </div>
          
          <h2 className="text-[20px] font-bold text-black font-gt-walsheim mb-2">Confirm Deletion</h2>
          <p className="text-[14px] text-black/40 font-sofia-pro mb-8 leading-relaxed">
            Are you sure you want to delete <span className="font-bold text-black">"{title}"</span>? This action cannot be undone.
          </p>

          <div className="flex gap-4 w-full">
            <button 
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-4 border border-gray-100 text-[13px] font-bold uppercase tracking-widest font-sofia-pro hover:bg-gray-50 transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button 
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 py-4 bg-red-500 text-white text-[13px] font-bold uppercase tracking-widest font-sofia-pro hover:bg-red-600 transition-all disabled:opacity-50"
            >
              {loading ? "Deleting..." : "Yes, Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
