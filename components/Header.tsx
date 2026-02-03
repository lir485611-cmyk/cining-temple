
import React, { useState, useEffect } from 'react';
import { ShoppingBag, User, Search, Menu, X, UserCheck, Landmark, ShieldCheck, ChevronRight } from 'lucide-react';
import { Member } from '../types';

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
  onUserClick: () => void;
  onHomeClick: () => void;
  onIntroClick: () => void;
  user: Partial<Member> | null;
}

const Header: React.FC<HeaderProps> = ({ cartCount, onCartClick, onUserClick, onHomeClick, onIntroClick, user }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        isScrolled ? 'bg-white shadow-xl py-3 border-b-2 border-[#D4AF37]' : 'bg-transparent py-8'
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Desktop Nav - Left */}
        <nav className={`hidden lg:flex items-center space-x-12 text-[13px] font-black tracking-[0.4em] uppercase ${
          isScrolled ? 'text-[#1A1A1A]' : 'text-white drop-shadow-md'
        }`}>
          <button onClick={onIntroClick} className="hover:text-[#D4AF37] transition-colors underline-offset-8 hover:underline">宮廟沿革</button>
          <button onClick={onHomeClick} className="hover:text-[#D4AF37] transition-colors underline-offset-8 hover:underline">祀奉神尊</button>
        </nav>

        {/* Logo - Centered */}
        <button 
          onClick={onHomeClick}
          className={`flex flex-col items-center transition-all duration-700 transform ${
            isScrolled ? 'scale-90 text-[#8B0000]' : 'scale-100 text-white drop-shadow-2xl'
          }`}
        >
          <Landmark className={`w-8 h-8 mb-2 ${isScrolled ? 'text-[#8B0000]' : 'text-[#D4AF37]'}`} />
          <h1 className="text-3xl font-black tracking-[0.4em]">南海慈寧宮</h1>
          <span className="text-[10px] tracking-[0.6em] opacity-60 uppercase mt-1 font-bold">South Sea Cining Temple</span>
        </button>

        {/* Desktop Nav - Right + Icons */}
        <div className="flex items-center space-x-8 lg:space-x-12">
          <nav className={`hidden lg:flex items-center space-x-12 text-[13px] font-black tracking-[0.4em] uppercase ${
            isScrolled ? 'text-[#1A1A1A]' : 'text-white drop-shadow-md'
          }`}>
            <button onClick={onHomeClick} className="hover:text-[#D4AF37] transition-colors underline-offset-8 hover:underline">法務報名</button>
            <button onClick={onHomeClick} className="hover:text-[#D4AF37] transition-colors underline-offset-8 hover:underline">朝聖資訊</button>
          </nav>

          <div className={`flex items-center space-x-6 transition-colors ${isScrolled ? 'text-[#8B0000]' : 'text-white'}`}>
            <button 
              onClick={onUserClick}
              className="group flex items-center gap-3 py-2 px-4 border border-transparent hover:border-[#D4AF37] transition-all"
            >
              {user ? <UserCheck className="w-6 h-6 text-[#D4AF37]" /> : <User className="w-6 h-6" />}
              {user && <span className="hidden xl:block text-[11px] tracking-widest font-black">{user.full_name} 大德</span>}
            </button>

            <button onClick={onCartClick} className="relative group p-2">
              <ShoppingBag className="w-6 h-6 transition-transform group-hover:scale-110" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#8B0000] text-white text-[9px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#D4AF37] shadow-lg font-bold">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
