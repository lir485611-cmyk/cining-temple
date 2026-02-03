
import React, { useState, useEffect } from 'react';
import { ShoppingBag, User, Menu, X, Landmark, UserCheck } from 'lucide-react';
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
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: '宮廟沿革', action: onIntroClick },
    { name: '祀奉神尊', action: onHomeClick },
    { name: '法務報名', action: onHomeClick },
    { name: '朝聖資訊', action: onHomeClick },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-500 ${
        isScrolled || isMobileMenuOpen ? 'bg-black/95 backdrop-blur-md py-3 border-b border-[#D4AF37]/30 shadow-2xl' : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Mobile Menu Button */}
        <button 
          className="lg:hidden text-[#D4AF37] p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
        </button>

        {/* Desktop Nav - Left */}
        <nav className="hidden lg:flex items-center space-x-8 text-[12px] font-bold tracking-[0.3em] uppercase text-white">
          {navLinks.slice(0, 2).map((link) => (
            <button key={link.name} onClick={link.action} className="hover:text-[#D4AF37] transition-colors">{link.name}</button>
          ))}
        </nav>

        {/* Logo */}
        <button 
          onClick={() => { onHomeClick(); setIsMobileMenuOpen(false); }}
          className="flex flex-col items-center transition-transform hover:scale-105"
        >
          <div className="flex items-center gap-2">
            <Landmark className="w-6 h-6 text-[#D4AF37]" />
            <h1 className="text-xl md:text-2xl font-black tracking-[0.3em] text-white serif-title">南海慈寧宮</h1>
          </div>
          <span className="text-[8px] tracking-[0.5em] text-[#D4AF37] opacity-60 uppercase font-bold">Cining Temple</span>
        </button>

        {/* Desktop Nav - Right & Icons */}
        <div className="flex items-center space-x-4 md:space-x-8">
          <nav className="hidden lg:flex items-center space-x-8 text-[12px] font-bold tracking-[0.3em] uppercase text-white">
            {navLinks.slice(2).map((link) => (
              <button key={link.name} onClick={link.action} className="hover:text-[#D4AF37] transition-colors">{link.name}</button>
            ))}
          </nav>

          <div className="flex items-center space-x-4 text-white">
            <button onClick={onUserClick} className="hover:text-[#D4AF37] transition-colors">
              {user ? <UserCheck className="w-5 h-5 text-[#D4AF37]" /> : <User className="w-5 h-5" />}
            </button>
            <button onClick={onCartClick} className="relative group">
              <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#8B0000] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center border border-[#D4AF37] font-bold">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-black/95 border-b border-[#D4AF37]/30 fade-in">
          <nav className="flex flex-col p-8 space-y-6 text-center text-[16px] tracking-[0.4em] font-bold text-white uppercase">
            {navLinks.map((link) => (
              <button 
                key={link.name} 
                onClick={() => { link.action(); setIsMobileMenuOpen(false); }}
                className="py-4 border-b border-white/10 active:text-[#D4AF37]"
              >
                {link.name}
              </button>
            ))}
            {user && (
              <div className="pt-4 text-[#D4AF37] text-sm">
                歡迎，{user.full_name} 大德
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
