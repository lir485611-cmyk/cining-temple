
import React from 'react';

// 封裝圖片轉換邏輯，確保與 App.tsx 一致
const getDriveImageUrl = (id: string) => {
  if (!id) return '';
  return `https://lh3.googleusercontent.com/d/${id}`;
};

const Hero: React.FC = () => {
  // 使用天上聖母作為首頁主視覺
  const mainStatueId = '1eCe_3ffYdKIe1-eEXEQdnL9ojsUqOQeo';
  const statueUrl = getDriveImageUrl(mainStatueId);

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* 背景氛圍層 */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1590059392550-99e28941783f?auto=format&fit=crop&q=80&w=2400" 
          alt="南海慈寧宮 殿堂背景" 
          className="w-full h-full object-cover opacity-5 scale-105"
        />
        {/* 漸層遮罩：從米黃色到透明再到米黃色 */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF9F6] via-transparent to-[#FAF9F6]"></div>
      </div>

      {/* 中心神尊視覺層 */}
      <div className="absolute inset-0 z-5 flex items-center justify-center pointer-events-none">
        <div className="relative w-full h-full max-w-4xl flex items-center justify-center">
          {/* 神尊聖像：帶有柔邊遮罩與微弱動畫 */}
          <img 
            src={statueUrl} 
            alt="天上聖母 聖像" 
            className="h-[65vh] md:h-[80vh] w-auto object-contain opacity-60 animate-[pulse_8s_infinite_ease-in-out] select-none"
            style={{
              maskImage: 'radial-gradient(circle at center, black 40%, transparent 80%)',
              WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 80%)'
            }}
          />
          {/* 背後金光 */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vh] h-[60vh] bg-[#C5A009]/5 rounded-full blur-[120px] -z-10"></div>
        </div>
      </div>

      {/* 文字內容層 */}
      <div className="container mx-auto px-6 relative z-10 text-center">
        <div className="fade-in max-w-5xl mx-auto space-y-12">
          <div className="space-y-8">
            <h1 className="text-6xl md:text-[10rem] font-bold text-[#3E2723] tracking-[0.2em] serif-title leading-tight drop-shadow-[0_0_15px_rgba(62,39,35,0.1)]">
              慈雲普覆 <br className="md:hidden" /> 寧境安心
            </h1>
            <div className="w-32 h-[1px] bg-[#3E2723]/20 mx-auto"></div>
            <h2 className="text-xl md:text-3xl text-[#5D4037] block tracking-[0.6em] font-light serif-title">
              南海慈寧宮 ‧ 廣結善緣 ‧ 澤被蒼生
            </h2>
          </div>
        </div>
      </div>
      
      {/* 裝飾線條 */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center opacity-30">
        <div className="w-[1px] h-24 bg-gradient-to-b from-[#3E2723] to-transparent mx-auto"></div>
      </div>
    </section>
  );
};

export default Hero;
