
import React from 'react';
import { Product } from '../types';
import { Plus, Info } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onViewDetail: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onViewDetail }) => {
  return (
    <div className="group relative flex flex-col bg-white border border-orange-50 shadow-sm hover:shadow-2xl transition-all duration-700 ornament-border">
      <div 
        className="relative overflow-hidden aspect-[3/4] cursor-pointer"
        onClick={() => onViewDetail(product)}
      >
        <img 
          src={product.image_url} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[30%] group-hover:grayscale-0"
        />
        
        {/* Category Label */}
        <div className="absolute top-0 right-0 bg-[#8B0000] text-white text-[10px] px-4 py-2 font-bold tracking-[0.3em] uppercase border-l-2 border-b-2 border-[#D4AF37] z-10">
          {product.category}
        </div>

        {/* Hover Action Overlay */}
        <div className="absolute inset-0 bg-[#1A1A1A]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center space-y-6">
          <button 
            onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
            className="w-48 bg-[#8B0000] text-white py-4 text-[12px] font-bold tracking-[0.4em] uppercase hover:bg-[#D4AF37] hover:text-black transition-all border border-[#D4AF37]"
          >
            立即結緣
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onViewDetail(product); }}
            className="w-48 border border-white/50 text-white py-4 text-[12px] font-bold tracking-[0.4em] uppercase hover:bg-white/10 backdrop-blur-sm transition-all"
          >
            法務詳情
          </button>
        </div>
      </div>
      
      <div className="p-8 text-center space-y-4">
        <h3 className="text-2xl serif-bold text-[#1A1A1A] group-hover:text-[#8B0000] transition-colors">
          {product.name}
        </h3>
        <p className="text-sm text-gray-500 serif leading-relaxed line-clamp-2 italic h-10">
          {product.description}
        </p>
        <div className="pt-4 border-t border-orange-50 flex items-center justify-center">
          <span className="text-xl font-bold text-[#8B0000] tracking-widest">
            NT$ {product.price.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
