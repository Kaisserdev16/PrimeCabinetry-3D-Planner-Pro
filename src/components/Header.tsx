import React from 'react';
import { Save, ShoppingCart, HelpCircle } from 'lucide-react';
import { useStore } from '../store/useStore';

export const Header: React.FC = () => {
  const placedItems = useStore((state) => state.placedItems);
  
  // Calculate total price based on mock prices
  const totalPrice = placedItems.reduce((sum, item) => sum + (item.price || 0), 0);

  return (
    <header className="h-16 bg-white border-b border-zinc-200 flex items-center justify-between px-6 select-none z-10">
      {/* Brand Logo */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-extrabold text-lg shadow-sm cursor-pointer hover:opacity-90">
          <span className="tracking-tight italic font-serif">P</span>
        </div>
        <div className="flex flex-col">
          <span className="text-zinc-800 font-bold tracking-tight text-sm leading-none">PrimeCabinetry</span>
          <span className="text-zinc-400 text-xs tracking-wider font-medium uppercase mt-0.5">3D Planner Pro</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-4">
        {/* Save Button */}
        <button 
          onClick={() => alert("Design saved successfully!")}
          className="flex items-center gap-2 bg-indigo-950 hover:bg-indigo-900 text-white px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-all shadow-sm active:scale-95 cursor-pointer"
        >
          <Save size={14} />
          Save Design
        </button>

        {/* Total Pricing info */}
        {placedItems.length > 0 && (
          <div className="hidden md:flex flex-col text-right">
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Estimated Total</span>
            <span className="text-sm font-extrabold text-zinc-800">${totalPrice.toLocaleString()}</span>
          </div>
        )}

        {/* Add to Cart Button */}
        <button 
          onClick={() => alert(`Adding ${placedItems.length} items to cart! Total: $${totalPrice}`)}
          className="flex items-center gap-2 bg-purple-700 hover:bg-purple-800 text-white px-6 py-2.5 rounded-full text-xs font-bold tracking-wide transition-all shadow-sm active:scale-95 cursor-pointer"
        >
          <ShoppingCart size={14} />
          Add To Cart ({placedItems.length})
        </button>

        {/* Designer Assistance */}
        <button 
          className="hidden sm:flex items-center gap-2 bg-white hover:bg-zinc-50 text-zinc-800 border border-zinc-300 px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-all active:scale-95 cursor-pointer"
        >
          <HelpCircle size={14} className="text-purple-600" />
          Designer Assistance
        </button>
      </div>
    </header>
  );
};
