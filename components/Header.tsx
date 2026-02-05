import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

interface HeaderProps {
  onHomeClick: () => void;
  onIntroClick: () => void;
  onGodsClick: () => void;
  onPilgrimageClick: () => void;
}

const LOGO_URL = 'https://lh3.googleusercontent.com/d/1Um9FSgxjlrOvIWgvYmOLJI5jrGBNDoWw';

const Header: React.FC<HeaderProps> = ({ onHomeClick, onIntroClick, onGodsClick, onPilgrimageClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: '宮廟沿革', action: onIntroClick },
    { name: '祀奉神尊', action: onGodsClick },
    { name: '朝聖資訊', action: onPilgrimageClick },
  ];

  const handleNavClick = (action: () => void) => {
    action();
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        isScrolled || isMobileMenuOpen ? 'bg-white py-3 border-b border-gray-100 shadow-xl' : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Mobile Menu Button */}
        <button 
          className={`lg:hidden p-2 transition-colors ${isScrolled || isMobileMenuOpen ? 'text-[#B22222]' : 'text-white md:text-[#333333]'}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
        </button>

        {/* Desktop Nav - Left */}
        <nav className="hidden lg:flex items-center space-x-12 text-[15px] font-black tracking-[0.3em] uppercase text-[#333333]">
          {navLinks.slice(0, 2).map((link) => (
            <button key={link.name} onClick={() => handleNavClick(link.action)} className="hover:text-[#B22222] transition-colors relative group">
              {link.name}
              <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-[#B22222] transition-all group-hover:w-full"></span>
            </button>
          ))}
        </nav>

        {/* Logo */}
        <button 
          onClick={() => handleNavClick(onHomeClick)}
          className="flex flex-col items-center transition-transform hover:scale-105"
        >
          <div className="flex items-center gap-3">
            <img src={LOGO_URL} alt="南海慈寧宮 LOGO" className="w-10 h-10 object-contain" />
            <h1 className="text-xl md:text-3xl font-black tracking-[0.4em] serif-title text-[#333333]">南海慈寧宮</h1>
          </div>
          <span className="text-[10px] tracking-[0.6em] opacity-80 uppercase font-bold text-[#B22222]">Cining Temple</span>
        </button>

        {/* Desktop Nav - Right */}
        <div className="flex items-center">
          <nav className="hidden lg:flex items-center text-[15px] font-black tracking-[0.3em] uppercase text-[#333333]">
            {navLinks.slice(2).map((link) => (
              <button key={link.name} onClick={() => handleNavClick(link.action)} className="hover:text-[#B22222] transition-colors relative group">
                {link.name}
                <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-[#B22222] transition-all group-hover:w-full"></span>
              </button>
            ))}
          </nav>
          <div className="w-10 lg:hidden"></div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-100 h-screen shadow-2xl animate-in fade-in slide-in-from-top duration-300">
          <nav className="flex flex-col p-12 space-y-4 text-center">
            {navLinks.map((link) => (
              <button 
                key={link.name} 
                onClick={() => handleNavClick(link.action)}
                className="py-6 border-b border-gray-50 text-[#B22222] font-black text-2xl tracking-[0.4em] uppercase active:text-[#C5A009]"
              >
                {link.name}
              </button>
            ))}
            <div className="pt-16 flex flex-col items-center gap-6">
              <img src={LOGO_URL} alt="南海慈寧宮 LOGO" className="w-16 h-16 object-contain" />
              <p className="text-[12px] tracking-[0.6em] font-black serif-title text-[#B22222]">慈雲普覆 ‧ 寧境安心</p>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;