
import React from 'react';
import { Facebook, Landmark } from 'lucide-react';

const Footer: React.FC = () => {
  const facebookUrl = "https://www.facebook.com/profile.php?id=100088841858344&locale=zh_TW";

  return (
    <footer className="bg-[#050505] border-t border-[#D4AF37]/20 py-16">
      <div className="container mx-auto px-6 text-center">
        <div className="flex flex-col items-center gap-8 mb-12">
          <div className="flex items-center gap-3">
            <Landmark className="w-8 h-8 text-[#D4AF37]" />
            <h3 className="text-2xl font-black text-white tracking-widest serif-title">南海慈寧宮</h3>
          </div>
          
          <a 
            href={facebookUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-3 px-8 py-3 rounded-full border border-white/10 text-gray-400 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all group"
          >
            <Facebook className="w-6 h-6 group-hover:scale-110" />
            <span className="font-bold tracking-widest">官方臉書專頁</span>
          </a>
        </div>

        <div className="border-t border-white/5 pt-8">
          <p className="text-gray-600 text-xs tracking-[0.4em] uppercase font-bold">
            &copy; 2026 南海慈寧宮 版權所有
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
