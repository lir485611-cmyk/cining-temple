import React from 'react';
import { Facebook, MessageCircle, MapPin, Phone } from 'lucide-react';

const LOGO_URL = 'https://lh3.googleusercontent.com/d/1V_pOkbobPmP53aSx5A27nbQc78wlsyUV';

const Footer: React.FC = () => {
  const facebookUrl = "https://www.facebook.com/profile.php?id=100088841858344&locale=zh_TW";
  const lineUrl = "https://lin.ee/ISHPOOV";
  const address = "高雄市鼓山區民康街216號";
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  const phoneNumber = "0982243847";

  return (
    <footer className="bg-[#B22222] border-t border-[#C5A009]/20 pt-12 pb-8">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center">
          {/* Logo & Slogan */}
          <div className="flex items-center gap-4 mb-8">
            <img 
              src={LOGO_URL} 
              alt="南海慈寧宮 LOGO" 
              className="w-16 h-16 md:w-20 md:h-20 object-contain" 
            />
            <h3 className="text-2xl font-black text-white tracking-widest serif-title">南海慈寧宮</h3>
          </div>
          
          {/* 精簡後的聯繫資訊橫列 */}
          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 mb-10 text-white/80">
            {/* 地址 */}
            <a 
              href={googleMapsUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-[#C5A009] transition-colors group"
            >
              <MapPin className="w-4 h-4 text-[#C5A009]" />
              <span className="text-xs font-medium tracking-wider">{address}</span>
            </a>

            {/* 電話 */}
            <a 
              href={`tel:${phoneNumber}`}
              className="flex items-center gap-2 hover:text-[#C5A009] transition-colors group"
            >
              <Phone className="w-4 h-4 text-[#C5A009]" />
              <span className="text-xs font-medium tracking-wider">{phoneNumber} (袁師姐)</span>
            </a>

            {/* LINE & FB 社交按鈕 */}
            <div className="flex items-center gap-6 border-l border-white/20 pl-8 ml-2">
              <a 
                href={lineUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-[#C5A009] transition-colors"
                title="官方 LINE"
              >
                <MessageCircle className="w-5 h-5" />
                <span className="text-xs font-bold hidden sm:inline">LINE</span>
              </a>
              <a 
                href={facebookUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-[#C5A009] transition-colors"
                title="臉書專頁"
              >
                <Facebook className="w-5 h-5" />
                <span className="text-xs font-bold hidden sm:inline">Facebook</span>
              </a>
            </div>
          </div>
        </div>

        {/* 版權宣告 */}
        <div className="border-t border-white/10 pt-6 text-center">
          <p className="text-white/40 text-[9px] tracking-[0.3em] uppercase font-bold">
            &copy; 2026 南海慈寧宮 版權所有 ‧ 慈雲普覆 寧境安心
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;