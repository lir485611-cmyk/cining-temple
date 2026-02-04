import React from 'react';

const getDriveImageUrl = (id: string) => {
  if (!id) return '';
  return `https://lh3.googleusercontent.com/d/${id}`;
};

const Hero: React.FC = () => {
  const mainStatueId = '1eCe_3ffYdKIe1-eEXEQdnL9ojsUqOQeo';
  const statueUrl = getDriveImageUrl(mainStatueId);

  return (
    <section className="relative min-h-[90vh] md:min-h-screen w-full flex items-center justify-center overflow-hidden pb-32 md:pb-48">
      {/* 背景層 - 使用較低的 z-index */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF9F6] via-transparent to-[#FAF9F6]"></div>
      </div>

      {/* 神尊聖像層 */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
        <div className="relative w-full h-full max-w-4xl flex items-center justify-center">
          <img 
            src={statueUrl} 
            alt="天上聖母 聖像" 
            className="h-[60vh] md:h-[80vh] w-auto object-contain opacity-40 md:opacity-60 animate-[pulse_8s_infinite_ease-in-out] select-none"
            style={{
              maskImage: 'radial-gradient(circle at center, black 40%, transparent 85%)',
              WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 85%)'
            }}
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vh] h-[60vh] bg-[#C5A009]/5 rounded-full blur-[120px] -z-10"></div>
        </div>
      </div>

      {/* 文字內容層 - z-index 高於聖像 */}
      <div className="container mx-auto px-6 relative z-20 text-center">
        <div className="fade-in max-w-5xl mx-auto space-y-12 md:space-y-16">
          <div className="space-y-8 md:space-y-12">
            <h1 className="text-6xl md:text-[10rem] font-black text-[#3E2723] tracking-[0.2em] serif-title leading-tight drop-shadow-md">
              慈雲普覆 <br className="md:hidden" /> 寧境安心
            </h1>
            <div className="w-32 md:w-56 h-[2px] bg-[#8B0000]/30 mx-auto"></div>
            <h2 className="text-xl md:text-4xl text-[#8B0000] block tracking-[0.5em] md:tracking-[0.8em] font-black serif-title opacity-90 drop-shadow-sm">
              南海慈寧宮 ‧ 廣結善緣 ‧ 澤被蒼生
            </h2>
          </div>
        </div>
      </div>
      
      {/* 底部裝飾 */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center opacity-30 hidden md:block">
        <div className="w-[2px] h-24 bg-gradient-to-b from-[#8B0000] to-transparent mx-auto"></div>
      </div>
    </section>
  );
};

export default Hero;