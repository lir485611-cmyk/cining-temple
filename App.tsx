import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Footer from '././components/Footer';
import { Product, CartItem, Member } from './types';
import { X, Landmark, MapPin, Clock, Calendar, MessageCircle, ChevronLeft, ChevronRight, Flower2, Loader2, CheckCircle2, Facebook, Phone, Info, Map as MapIcon, Maximize2 } from 'lucide-react';

// 請更換為您的 Google Apps Script 部署網址
const GAS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbyVJF82yjSctgUZKm0Hu-nvQ1RgTqbejT1uHXL95OlMj-Cj7CtFjyDMZbDFZb469J6J/exec';

type View = 'Home' | 'About' | 'Gods' | 'Pilgrimage';

export const getDriveImageUrl = (id: string) => {
  if (!id) return '';
  return `https://lh3.googleusercontent.com/d/${id}`;
};

// 徒步路線圖 ID
const ROUTE_MAP_ID = '1ZS5SILdpJXxlNxpCXpLk963SBGuv_1sn';

const LATEST_NEWS = [
  {
    id: 'news1',
    title: '龍柱祈福燈',
    desc: '燃燈供佛，龍天護佑。截止日期：115/2/20 (國曆)。',
    deadline: '115/2/20',
    actions: [
      { label: 'LINE 線上報名', link: 'https://lin.ee/22Yqo9fe', type: 'primary', icon: 'message' }
    ],
    status: 'Active'
  },
  {
    id: 'news2',
    title: '丙午年徒步環島',
    desc: '第三次徒步環島，一步一腳印，皆是懺悔，也是祈禱。一步一步朝向聖母的懷抱。',
    deadline: '', 
    actions: [
      { label: 'LINE 線上報名', link: 'https://lin.ee/22Yqo9fe', type: 'primary', icon: 'message' },
      { label: '徒步路線', link: '#', type: 'secondary', icon: 'map', isMapTrigger: true }
    ],
    status: 'Active'
  }
];

const WORSHIP_STEPS = [
  { id: 1, name: '天公爐', effect: '敬告上蒼', desc: '手持一炷香，向外對天參拜，稟告姓名與祈願。' },
  { id: 2, name: '金元寶', effect: '財源入庫', desc: '敬獻一炷香，祈請招財進寶，守護事業與財氣。' },
  { id: 3, name: '主爐', effect: '聖母、菩薩、武財神', desc: '敬獻一炷香，祈求三尊神明慈雲普覆，賜予智慧、財利與寧境安心。' },
  { id: 4, name: '虎爺大將軍', effect: '鎮守財庫', desc: '敬獻一炷香，祈請虎爺公驅邪避小人，守穩財源。' },
  { id: 5, name: '五營', effect: '出入平安', desc: '敬獻一炷香，感念五營神將守護地方，保佑事事平安。' }
];

const DIVINE_STATUES = [
  {
    name: '天上聖母',
    imgId: '1eCe_3ffYdKIe1-eEXEQdnL9ojsUqOQeo',
    quote: '「聖母慈光，護國佑民」',
    description: '湄洲天后聖尊，威靈顯赫。為萬民心靈的避風港。'
  },
  {
    name: '千手觀音',
    imgId: '1VVFGy1FdpVHWK-nG45D7dGcttBZbXgCG',
    quote: '「慈悲廣大，感應如響」',
    description: '具足千手千眼，觀照世間苦難。千處祈求千處現。'
  },
  {
    name: '武財神',
    imgId: '1-8qfVQXgkSNi__jJFddNPEtWinNaGgAP',
    quote: '「五路招財，事業亨通」',
    description: '威震八方，主掌天下財源，祈請事業順利、財祿豐收。'
  }
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('Home');
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [activeStatueIndex, setActiveStatueIndex] = useState(0);
  const statueScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  const handleStatueScroll = () => {
    if (!statueScrollRef.current) return;
    const { scrollLeft, clientWidth } = statueScrollRef.current;
    const index = Math.round(scrollLeft / clientWidth);
    if (index !== activeStatueIndex) {
      setActiveStatueIndex(index);
    }
  };

  const SectionTitle = ({ children, className = "" }: { children?: React.ReactNode, className?: string }) => (
    <div className={`flex items-center justify-center gap-6 mb-16 ${className}`}>
      <Flower2 className="w-6 h-6 text-[#8B0000] opacity-60" />
      <h2 className="text-3xl md:text-5xl font-black text-[#8B0000] tracking-widest serif-title drop-shadow-sm">{children}</h2>
      <Flower2 className="w-6 h-6 text-[#8B0000] opacity-60" />
    </div>
  );

  return (
    <div className={`min-h-screen text-[#3E2723] overflow-x-hidden ${['Gods', 'Pilgrimage'].includes(currentView) ? 'bg-white' : ''}`}>
      <Header 
        onHomeClick={() => setCurrentView('Home')}
        onIntroClick={() => setCurrentView('About')}
        onGodsClick={() => setCurrentView('Gods')}
        onPilgrimageClick={() => setCurrentView('Pilgrimage')}
      />

      <main>
        {currentView === 'Home' && (
          <div className="fade-in">
            <Hero />
            
            <section className="relative z-40 px-4 pt-24 md:pt-40 bg-transparent">
              <div className="container mx-auto max-w-6xl">
                <SectionTitle className="mb-12">最新消息</SectionTitle>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                  {LATEST_NEWS.map((news) => (
                    <div key={news.id} className="bg-white ornament-border p-8 md:p-12 shadow-xl border-l-4 border-[#8B0000] flex flex-col group hover:shadow-2xl transition-all duration-500">
                      <div className="flex justify-between items-start mb-6">
                        <span className="px-4 py-1.5 text-[10px] font-black tracking-widest uppercase bg-[#8B0000] text-white shadow-md">最新活動</span>
                        <Calendar className="w-5 h-5 text-[#C5A009]" />
                      </div>
                      <h4 className="text-xl md:text-2xl font-black mb-4 serif-title text-[#8B0000] group-hover:text-[#C5A009] transition-colors">{news.title}</h4>
                      <p className="text-[#5D4037] mb-8 font-light leading-relaxed">{news.desc}</p>
                      
                      <div className="flex flex-col gap-6 mt-auto">
                        {news.deadline && (
                          <span className="text-xs text-[#8B0000] font-bold tracking-widest uppercase">截止：{news.deadline}</span>
                        )}
                        <div className="flex flex-col sm:flex-row gap-4">
                          {news.actions.map((act, idx) => (
                            <button
                              key={idx}
                              onClick={() => act.isMapTrigger ? setIsMapOpen(true) : window.open(act.link, '_blank')}
                              className={`flex-1 px-6 py-3 text-sm font-black tracking-widest flex items-center justify-center gap-2 transition-all shadow-md ${
                                act.type === 'primary' 
                                ? 'bg-[#8B0000] text-white border border-[#C5A009] hover:bg-[#C5A009]' 
                                : 'bg-transparent text-[#8B0000] border-2 border-[#8B0000]/20 hover:border-[#8B0000] hover:bg-[#8B0000]/5'
                              }`}
                            >
                              {act.icon === 'message' ? <MessageCircle className="w-4 h-4" /> : <MapIcon className="w-4 h-4" />}
                              {act.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 修復後的聖像莊嚴輪播區塊 */}
            <section className="py-24 md:py-40 bg-white mt-32 overflow-hidden">
               <div className="container mx-auto">
                 {/* 標題塊修復：紅底白字 (#B22222) */}
                 <div className="flex justify-center mb-24">
                    <div className="bg-[#B22222] text-white px-12 py-5 font-black tracking-[0.4em] serif-title text-3xl md:text-5xl shadow-[6px_6px_0px_#C5A009] relative z-10">
                      聖像莊嚴
                    </div>
                 </div>

                 <div className="relative">
                    {/* 滑動容器：確保在 index.html 不會展開跑板 */}
                    <div 
                      ref={statueScrollRef}
                      onScroll={handleStatueScroll}
                      className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar gap-8 md:gap-16 px-6 md:px-[25%] pb-12"
                    >
                       {DIVINE_STATUES.map((statue, idx) => (
                         <div key={idx} className="flex-shrink-0 w-full md:w-[600px] snap-center">
                            <div className="group">
                               <div className="relative aspect-[3/4] overflow-hidden ornament-border bg-[#FDFBF7] flex items-center justify-center p-8 md:p-12 shadow-sm group-hover:shadow-2xl transition-all duration-1000">
                                  <img 
                                    src={getDriveImageUrl(statue.imgId)} 
                                    className="max-w-full max-h-full object-contain transition-transform duration-1000 group-hover:scale-105" 
                                    alt={statue.name}
                                  />
                               </div>
                               <div className="mt-12 text-center px-4">
                                  <h3 className="text-3xl font-black text-[#B22222] serif-title mb-4 tracking-widest">{statue.name}</h3>
                                  <p className="text-[#C5A009] leading-relaxed italic font-bold text-xl mb-4">{statue.quote}</p>
                                  <p className="text-[#5D4037] text-base leading-loose font-light max-w-lg mx-auto">{statue.description}</p>
                               </div>
                            </div>
                         </div>
                       ))}
                    </div>

                    {/* 紅色圓點指示器 */}
                    <div className="flex justify-center items-center gap-4 mt-8">
                       {DIVINE_STATUES.map((_, idx) => (
                         <button 
                           key={idx}
                           onClick={() => {
                             statueScrollRef.current?.scrollTo({ 
                               left: idx * statueScrollRef.current.clientWidth, 
                               behavior: 'smooth' 
                             });
                           }}
                           className={`transition-all duration-500 rounded-full h-2.5 ${
                             activeStatueIndex === idx 
                             ? 'w-10 bg-[#B22222]' 
                             : 'w-2.5 bg-gray-200 hover:bg-[#B22222]/30'
                           }`}
                         />
                       ))}
                    </div>
                 </div>
               </div>
            </section>
          </div>
        )}

        {currentView === 'About' && (
          <div className="fade-in container mx-auto px-6 py-40 max-w-4xl space-y-24">
             <SectionTitle>宮廟沿革</SectionTitle>
             <section className="bg-white ornament-border p-8 md:p-12 shadow-sm space-y-6">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-[2px] bg-[#8B0000]"></div>
                  <h2 className="text-2xl md:text-3xl font-black text-[#8B0000] serif-title tracking-widest">緣起 ‧ 慈航普渡</h2>
                </div>
                <p className="text-lg leading-relaxed text-[#3E2723]">
                  南海慈寧宮座落於山水匯聚之福地，主祀<span className="font-bold text-[#8B0000]">千手千眼觀世音菩薩</span>與<span className="font-bold text-[#8B0000]">天上聖母</span>。
                </p>
                <p className="text-[#5D4037]">
                  菩薩以千眼觀照世間苦厄，聖母以慈心護佑萬民平安。自建宮以來，無數信眾於此尋求心靈寄託。本宮殿宇雖非金碧輝煌，卻承載著佛道圓融之精神，為紛擾城市中一處清淨之地。
                </p>
             </section>
             <div className="text-center mt-20">
                <button onClick={() => setCurrentView('Home')} className="bg-[#8B0000] text-white px-12 py-4 text-xl font-black tracking-widest hover:bg-[#C5A009] transition-all border border-[#C5A009] shadow-lg">返回首頁</button>
             </div>
          </div>
        )}

        {currentView === 'Gods' && (
          <div className="fade-in bg-white py-40">
             <div className="container mx-auto px-6 max-w-5xl">
                <SectionTitle>祀奉神尊</SectionTitle>
                <div className="space-y-32">
                   <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                      <div className="order-2 md:order-1">
                        <div className="bg-[#B22222] text-white px-8 py-2 inline-block font-black tracking-widest serif-title text-xl mb-6 shadow-[3px_3px_0px_#C5A009]">天上聖母</div>
                        <h3 className="text-2xl font-black text-[#B22222] mb-6 tracking-widest">慈航普渡 ‧ 鎮殿主神</h3>
                        <p className="text-[#333333] leading-relaxed text-lg text-justify font-light">天上聖母（媽祖）為南海慈寧宮之主神，以慈悲大愛護佑眾生。無論祈求家內平安、消災解厄，皆感應如響，是信眾心靈最堅實的依靠。</p>
                      </div>
                      <div className="order-1 md:order-2 bg-gray-50 aspect-square flex items-center justify-center p-8 border border-gray-100 shadow-inner">
                         <img src={getDriveImageUrl('1eCe_3ffYdKIe1-eEXEQdnL9ojsUqOQeo')} className="max-h-full object-contain" alt="天上聖母"/>
                      </div>
                   </section>
                   <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                      <div className="bg-gray-50 aspect-square flex items-center justify-center p-8 border border-gray-100 shadow-inner">
                         <img src={getDriveImageUrl('1VVFGy1FdpVHWK-nG45D7dGcttBZbXgCG')} className="max-h-full object-contain" alt="觀世音菩薩"/>
                      </div>
                      <div>
                        <div className="bg-[#B22222] text-white px-8 py-2 inline-block font-black tracking-widest serif-title text-xl mb-6 shadow-[3px_3px_0px_#C5A009]">觀世音菩薩</div>
                        <h3 className="text-2xl font-black text-[#B22222] mb-6 tracking-widest">慈悲示現 ‧ 靈感守護</h3>
                        <p className="text-[#333333] leading-relaxed text-lg text-justify font-light">菩薩具足大威神力，普門示現度一切苦。引領迷途心靈找回正向力量，令信眾皆能「慈雲普覆、寧境安心」。</p>
                      </div>
                   </section>
                </div>
                <div className="mt-40 text-center">
                  <button onClick={() => setCurrentView('Home')} className="border-2 border-[#B22222] text-[#B22222] px-12 py-4 font-black tracking-[0.4em] hover:bg-[#B22222] hover:text-white transition-all">返回首頁</button>
                </div>
             </div>
          </div>
        )}

        {currentView === 'Pilgrimage' && (
          <div className="fade-in bg-white py-40">
             <div className="container mx-auto px-6 max-w-5xl">
                <div className="text-center mb-24">
                  <h2 className="text-4xl md:text-6xl font-black text-[#8B0000] serif-title tracking-[0.4em] mb-6">朝聖資訊</h2>
                  <div className="w-20 h-1 bg-[#C5A009] mx-auto"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
                  <div className="bg-[#FDFBF7] p-10 border border-gray-100 shadow-sm flex items-center gap-8 ornament-border">
                    <Clock className="w-12 h-12 text-[#8B0000]" />
                    <div>
                      <h4 className="text-xs font-black tracking-widest text-gray-400 mb-2 uppercase">開放參拜時間</h4>
                      <p className="text-2xl font-black serif-title text-[#3E2723]">每日 9:00 - 18:00</p>
                    </div>
                  </div>
                  <div className="bg-[#FDFBF7] p-10 border border-gray-100 shadow-sm flex items-center gap-8 ornament-border">
                    <MapPin className="w-12 h-12 text-[#8B0000]" />
                    <div>
                      <h4 className="text-xs font-black tracking-widest text-gray-400 mb-2 uppercase">宮廟地址</h4>
                      <p className="text-xl font-black serif-title text-[#3E2723]">高雄鼓山區民康街216號</p>
                    </div>
                  </div>
                </div>

                <div className="mb-32">
                  <div className="flex items-center gap-4 mb-12">
                    <div className="w-8 h-[2px] bg-[#8B0000]"></div>
                    <h3 className="text-2xl font-black text-[#8B0000] serif-title tracking-widest">參拜流程 ‧ 五步感應</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-8">
                    {WORSHIP_STEPS.map((step) => (
                      <div key={step.id} className="flex flex-col md:flex-row gap-8 p-8 bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow group relative">
                        <div className="w-16 h-16 bg-[#8B0000] text-white flex items-center justify-center text-3xl font-black serif-title flex-shrink-0 group-hover:bg-[#C5A009] transition-colors shadow-[4px_4px_0px_#C5A009]">
                          {step.id}
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-4 mb-4">
                            <h4 className="text-2xl font-black text-[#8B0000] serif-title tracking-widest">【{step.name}】</h4>
                            <span className="px-4 py-1 bg-[#C5A009] text-white text-xs font-bold tracking-widest uppercase shadow-sm">
                              {step.effect}
                            </span>
                          </div>
                          <p className="text-[#5D4037] leading-relaxed text-lg font-light">{step.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#8B0000] p-12 md:p-24 text-white text-center ornament-border relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none manji-pattern"></div>
                  <h3 className="text-2xl md:text-4xl font-black serif-title tracking-[0.3em] mb-12 relative z-10">聯繫慈寧 ‧ 廣結善緣</h3>
                  <div className="flex flex-col md:flex-row justify-center gap-8 relative z-10">
                    <a href="https://lin.ee/22Yqo9fe" target="_blank" rel="noopener noreferrer" className="bg-white text-[#8B0000] px-12 py-5 font-black tracking-widest flex items-center justify-center gap-4 hover:bg-[#C5A009] hover:text-white transition-all shadow-xl text-lg">
                      <MessageCircle className="w-7 h-7" /> 官方 LINE
                    </a>
                    <a href="https://www.facebook.com/profile.php?id=100088841858344" target="_blank" rel="noopener noreferrer" className="bg-transparent border-2 border-white text-white px-12 py-5 font-black tracking-widest flex items-center justify-center gap-4 hover:bg-white hover:text-[#8B0000] transition-all text-lg">
                      <Facebook className="w-7 h-7" /> 臉書專頁
                    </a>
                  </div>
                </div>

                <div className="mt-24 text-center">
                   <button onClick={() => setCurrentView('Home')} className="text-[#8B0000] font-black tracking-widest hover:text-[#C5A009] transition-colors border-b-2 border-[#8B0000]/20 pb-2">返回首頁</button>
                </div>
             </div>
          </div>
        )}
      </main>

      {/* 徒步路線燈箱：採用 Iframe 模式以支援翻閱多頁檔案 */}
      {isMapOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/90 p-4 md:p-12 animate-in fade-in duration-300 backdrop-blur-md">
          <button 
            onClick={() => setIsMapOpen(false)} 
            className="absolute top-6 right-6 text-white/60 hover:text-white transition-all z-[310] p-3 bg-white/10 rounded-full hover:bg-white/20"
          >
            <X className="w-10 h-10" />
          </button>
          
          <div className="w-full h-full max-w-5xl bg-white shadow-2xl rounded-lg overflow-hidden flex flex-col relative">
             <div className="bg-[#8B0000] text-white px-8 py-4 flex justify-between items-center">
                <span className="font-black tracking-widest serif-title">丙午年徒步環島 ‧ 路線手冊</span>
                <span className="text-xs opacity-60 tracking-widest hidden md:block">南海慈寧宮 ‧ 慈雲普覆</span>
             </div>
             
             {/* 透過 Google Drive Preview 模式載入，原生支援滑動、縮放與多頁顯示 */}
             <iframe 
                src={`https://drive.google.com/file/d/${ROUTE_MAP_ID}/preview`} 
                className="w-full flex-1 border-none"
                allow="autoplay"
                title="徒步路線手冊"
             />
             
             <div className="bg-gray-100 p-3 text-center text-[10px] text-gray-400 font-bold tracking-[0.2em]">
               提示：您可以使用兩指縮放或滑動來查看詳細路線
             </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default App;