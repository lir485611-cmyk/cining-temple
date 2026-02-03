
import React from 'react';
import { Product } from '../types';
import { Plus, Info } from 'lucide-react';
// Corrected: getDriveThumbnailUrl does not exist in App.tsx, using getDriveImageUrl instead
import { getDriveImageUrl } from '../App';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onViewDetail: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onViewDetail }) => {
  // 自動處理 Google Drive 圖片連結
  const processImageUrl = (url: string) => {
    if (!url) return '';
    if (url.includes('drive.google.com')) {
      const idMatch = url.match(/id=([-\w]{25,})/) || url.match(/\/d\/([-\w]{25,})/);
      // Corrected: Use getDriveImageUrl as exported in App.tsx
      if (idMatch) return getDriveImageUrl(idMatch[1]);
    }
    return url;
  };

  const displayImage = processImageUrl(product.image_url);

  return (
    <div className="group relative flex flex-col bg-white border border-orange-50 shadow-sm hover:shadow-2xl transition-all duration-700 ornament-border">
      <div 
        className="relative overflow-hidden aspect-[3/4] cursor-pointer bg-gray-50 flex items-center justify-center"
        onClick={() => onViewDetail(product)}
      >
        <img 
          src={displayImage} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[10%] group-hover:grayscale-0"
          loading="lazy"
        />
        
        {/* Category Label */}
        <div className="absolute top-0 right-0 bg-[#8B0000] text-white text-[10px] px-4 py-2 font-black tracking-[0.3em] uppercase border-l-2 border-b-2 border-[#D4AF37] z-10 shadow-sm">
          {product.category}
        </div>

        {/* Hover Action Overlay */}
        <div className="absolute inset-0 bg-[#1A1A1A]/70 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center space-y-6">
          <button 
            onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
            className="w-48 bg-[#8B0000] text-white py-4 text-[12px] font-black tracking-[0.4em] uppercase hover:bg-[#B8860B] transition-all border border-[#D4AF37] shadow-lg"
          >
            立即結緣
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onViewDetail(product); }}
            className="w-48 border border-white/50 text-white py-4 text-[12px] font-black tracking-[0.4em] uppercase hover:bg-white/10 backdrop-blur-md transition-all"
          >
            法務詳情
          </button>
        </div>
      </div>
      
      <div className="p-8 text-center space-y-4">
        <h3 className="text-2xl font-black text-[#1A1A1A] group-hover:text-[#8B0000] transition-colors tracking-tight leading-tight">
          {product.name}
        </h3>
        <p className="text-sm text-gray-500 font-normal leading-relaxed line-clamp-2 italic h-10 px-2">
          {product.description}
        </p>
        <div className="pt-6 border-t border-orange-50 flex items-center justify-center">
          <span className="text-2xl font-black text-[#8B0000] tracking-widest">
            NT$ {product.price.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
