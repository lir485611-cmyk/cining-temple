
import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black">
      {/* Background with multiple layers for depth */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1590059392550-99e28941783f?auto=format&fit=crop&q=80&w=2400" 
          alt="南海慈寧宮 殿堂莊嚴" 
          className="w-full h-full object-cover opacity-50 scale-110 animate-pulse-slow"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90"></div>
        {/* Divine overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
           <div className="w-[90%] h-[90%] md:w-[80%] md:h-[80%] bg-[url('https://images.unsplash.com/photo-1614104030927-507f7f3d4c1e?auto=format&fit=crop&q=80&w=1200')] bg-no-repeat bg-center bg-contain mix-blend-screen opacity-30"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10 text-center">
        <div className="fade-in max-w-full">
          <span className="text-xl sm:text-2xl md:text-3xl text-[#D4AF37] mb-4 md:mb-6 block tracking-[1em] font-medium animate-pulse">
            南海慈寧宮 ‧ 歲次乙巳
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white leading-tight mb-8 drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)] flex flex-col items-center">
            <span className="block border-y-2 border-[#D4AF37]/30 py-6 px-6 md:px-12 whitespace-nowrap tracking-[0.2em]">慈德普化</span>
            <span className="text-2xl sm:text-3xl md:text-4xl tracking-[1.5em] mt-8 text-[#D4AF37] font-light">護佑萬民</span>
          </h1>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-8 mt-12 md:mt-16">
            <button className="relative group overflow-hidden bg-[#8B0000] text-white px-8 md:px-16 py-4 md:py-6 text-sm md:text-lg tracking-[0.5em] font-black shadow-[0_0_30px_rgba(139,0,0,0.4)] border border-[#D4AF37]">
              <span className="relative z-10">線上法務登記</span>
              <div className="absolute inset-0 bg-[#B8860B] translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
            </button>
            <button className="border border-white/40 text-white px-8 md:px-16 py-4 md:py-6 text-sm md:text-lg tracking-[0.5em] font-black hover:bg-white/10 backdrop-blur-md transition-all">
              朝聖參拜資訊
            </button>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator with traditional style */}
      <div className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 text-center opacity-60">
        <div className="text-[#D4AF37] text-lg md:text-xl mb-4 font-bold tracking-[0.3em]">聞聲救苦</div>
        <div className="w-[1px] h-12 md:h-20 bg-gradient-to-b from-[#D4AF37] via-[#D4AF37]/50 to-transparent mx-auto"></div>
      </div>
    </section>
  );
};

export default Hero;
