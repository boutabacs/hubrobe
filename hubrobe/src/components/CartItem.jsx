import React from 'react';
import { FiX, FiPlus, FiMinus } from 'react-icons/fi';
import { Link } from "react-router-dom";

const CartItem = ({ item, onUpdate, onRemove }) => {
  const productId = item?._id || item?.id;
  return (
    <div className="grid grid-cols-12 items-center py-6 border-b border-gray-100 last:border-none gap-4">
      {/* Product Info */}
      <div className="col-span-12 md:col-span-6 flex items-center gap-6">
        <Link to={`/product/${productId}`} className="w-20 h-24 bg-gray-50 flex-shrink-0 overflow-hidden rounded-sm block">
          <img src={Array.isArray(item.img) ? item.img[0] : item.img} alt={item.title} className="w-full h-full object-cover" />
        </Link>
        <h3 className="text-[14px] md:text-[15px] font-medium text-black font-gt-walsheim">
          {item.title}
        </h3>
      </div>

      {/* Price */}
      <div className="col-span-4 md:col-span-2 text-center md:text-left">
        <span className="text-[14px] md:text-[15px] text-black/60 font-sofia-pro">
          ${item.price.toFixed(2)}
        </span>
      </div>

      {/* Quantity */}
      <div className="col-span-4 md:col-span-2 flex justify-center md:justify-start">
        <div className="flex items-center border border-gray-200 rounded-sm">
          <button 
            onClick={() => onUpdate(item.quantity - 1)}
            className="p-2 hover:bg-gray-50 transition-colors"
          >
            <FiMinus size={12} />
          </button>
          <span className="px-4 text-[13px] font-bold text-black font-sofia-pro">{item.quantity}</span>
          <button 
            onClick={() => onUpdate(item.quantity + 1)}
            className="p-2 hover:bg-gray-50 transition-colors"
          >
            <FiPlus size={12} />
          </button>
        </div>
      </div>

      {/* Total & Remove */}
      <div className="col-span-4 md:col-span-2 flex items-center justify-end md:justify-between gap-4">
        <span className="text-[14px] md:text-[15px] font-bold text-black font-sofia-pro">
          ${(item.price * item.quantity).toFixed(2)}
        </span>
        <button 
          onClick={onRemove}
          className="text-black/20 hover:text-black transition-colors"
        >
          <FiX size={18} />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
