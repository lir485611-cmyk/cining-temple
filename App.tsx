
import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Footer from './components/Footer';
import { Product, CartItem, Member } from './types';
import { X, Landmark, HeartHandshake, Compass, Zap, Calendar, ArrowRight, MessageCircle, ChevronLeft, ChevronRight, Flower2, Loader2, CheckCircle2 } from 'lucide-react';

// 請更換為您的 Google Apps Script 部署網址
const GAS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbwh4SWlHVHRFpRERuD19EKjYxkk3ApAUY4nuchLP_XbpSpG7-EG-BkJrg9CC2B_D17p/exec';

type View = 'Home' | 'ProductDetail' | 'Cart' | 'Login' | 'Account' | 'Checkout' | 'History';

export const getDriveImageUrl = (id: string) => {
  if (!id) return '';
  return `https://lh3.googleusercontent.com/d/${id}`;
};

const LATEST_NEWS = [
  {
    id: 'news1',
    title: '龍柱祈福燈',
    desc: '燃燈供佛，龍天護佑。截止日期：115/2/20 (國曆)。',
    deadline: '115/2/20',
    action: 'LINE 線上報名',
    link: 'https://lin.ee/22Yqo9fe',
    isExternal: true,
    status: 'Active'
  },
  {
    id: 'news2',
    title: '丙午年徒步環島',
    desc: '第三次徒步環島，一步一腳印，皆是懺悔，也是祈禱。',
    deadline: '法緣將啟',
    action: 'LINE 線上報名',
    link: 'https://lin.ee/22Yqo9fe',
    isExternal: true,
    status: 'Active'
  }
];

const SERVICE_MATRIX = [
  { 
    id: 1, 
    title: '點燈祈福', 
    tagline: '燃一盞心燈，照亮本命元辰。',
    desc: '於佛前續明燈，驅散生命陰霾，祈願前程如錦、歲月平安順遂。',
    imgId: '1gpME6-MqIAWRp7z9Oy95vLUyGdtWiIt6',
    actionType: 'modal',
    actionValue: 'lighting'
  },
  { 
    id: 2, 
    title: '線上問事', 
    tagline: '慈悲垂示，指引迷途心靈。',
    desc: '在紛擾世間尋求一方清淨，由神靈慈悲指點迷津，化解心中結縛，找回平靜。',
    imgId: '1WtFQQT2Mq3jX-Iq7I65P046EbE1N0g1C',
    actionType: 'modal',
    actionValue: 'inquiry'
  },
  { 
    id: 3, 
    title: '法會資訊', 
    tagline: '法水遍灑，功德圓滿霑法喜。',
    desc: '匯聚眾人願力，消災除障、增益吉祥，令眾生共霑神恩，成就圓滿福慧。',
    imgId: '1rcm_LaIAMYbZFEhHu4L9gTRtfvB4B64B',
    actionType: 'scroll',
    actionValue: 'news-section'
  },
];

const DIVINE_STATUES = [
  {
    name: '千手觀音',
    imgId: '1VVFGy1FdpVHWK-nG45D7dGcttBZbXgCG',
    quote: '「慈悲廣大，感應如響」',
    description: '具足千手千眼，觀照世間苦難。千處祈求千處現，為苦海中渡人的慈航。'
  },
  {
    name: '天上聖母',
    imgId: '1eCe_3ffYdKIe1-eEXEQdnL9ojsUqOQeo',
    quote: '「聖母慈光，護國佑民」',
    description: '湄洲天后聖尊，威靈顯赫。為萬民心靈的避風港，護佑航行者與信眾平安。'
  },
  {
    name: '虎爺公',
    imgId: '1-8qfVQXgkSNi__jJFddNPEtWinNaGgAP',
    quote: '「虎威震懾，財源廣進」',
    description: '鎮守宮殿的金虎將軍，驅邪除煞、守護兒童。更是民間信奉的財神化身。'
  }
];

const LIGHTING_OPTIONS = ["光明燈", "太歲燈", "文昌燈", "財神燈", "龍柱祈福燈"];
const INQUIRY_CATEGORIES = ["姻緣", "事業", "工作", "財運", "健康"];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('Home');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [modalType, setModalType] = useState<'none' | 'lighting' | 'inquiry'>('none');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const [currentStatueIndex, setCurrentStatueIndex] = useState(0);

  const newsRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const cartCount = 0;

  const handleServiceClick = (type: string, value: string) => {
    if (type === 'scroll') {
      newsRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (type === 'modal') {
      setModalType(value as any);
      setSubmitSuccess(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data: Record<string, any> = {};
    formData.forEach((value, key) => data[key] = value);
    
    data.action = 'submitCustomForm';
    data.formType = modalType === 'lighting' ? '點燈報名' : '線上問事';
    data.timestamp = new Date().toLocaleString();

    try {
      const response = await fetch(GAS_WEB_APP_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      setTimeout(() => {
        setSubmitSuccess(true);
        setIsSubmitting(false);
      }, 1000);
    } catch (error) {
      console.error('Submit error:', error);
      alert('傳送失敗，請直接聯繫官方 LINE');
      setIsSubmitting(false);
    }
  };

  const nextStatue = () => {
    setCurrentStatueIndex((prev) => (prev + 1) % DIVINE_STATUES.length);
  };

  const prevStatue = () => {
    setCurrentStatueIndex((prev) => (prev - 1 + DIVINE_STATUES.length) % DIVINE_STATUES.length);
  };

  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const itemWidth = container.offsetWidth;
      container.scrollTo({
        left: currentStatueIndex * itemWidth,
        behavior: 'smooth'
      });
    }
  }, [currentStatueIndex]);

  const SectionTitle = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
    <div className={`flex items-center justify-center gap-6 mb-16 reveal ${className}`}>
      <Flower2 className="w-6 h-6 text-[#8B0000] opacity-60" />
      <h2 className="text-3xl md:text-6xl font-black text-[#8B0000] tracking-widest serif-title">{children}</h2>
      <Flower2 className="w-6 h-6 text-[#8B0000] opacity-60" />
    </div>
  );

  return (
    <div className="min-h-screen text-[#3E2723] overflow-x-hidden">
      <Header 
        cartCount={cartCount} 
        onCartClick={() => setIsCartOpen(true)}
        onUserClick={() => {}}
        onHomeClick={() => { setCurrentView('Home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        onIntroClick={() => {}}
        user={null}
      />

      <main>
        {currentView === 'Home' && (
          <div className="fade-in">
            <Hero />

            {/* 最新消息與活動 */}
            <section ref={newsRef} className="relative -mt-16 md:-mt-24 z-30 px-4">
              <div className="container mx-auto max-w-6xl">
                <SectionTitle className="mb-10 text-[#3E2723]">最新消息</SectionTitle>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                  {LATEST_NEWS.map((news) => (
                    <div key={news.id} className="bg-white ornament-border p-8 md:p-10 shadow-xl reveal active border-l-4 border-[#8B0000] flex flex-col">
                      <div className="flex justify-between items-start mb-6">
                        <span className={`px-3 py-1 text-[10px] font-black tracking-widest uppercase ${news.status === 'Active' ? 'bg-[#8B0000] text-white' : 'bg-gray-200 text-gray-500'}`}>
                          {news.status === 'Active' ? '最新活動' : '即將報名'}
                        </span>
                        <Calendar className="w-5 h-5 text-[#C5A009]" />
                      </div>
                      <h4 className="text-xl md:text-2xl font-black mb-3 serif-title text-[#8B0000]">{news.title}</h4>
                      <p className="text-gray-600 mb-6 font-light">{news.desc}</p>
                      <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mt-auto">
                        <span className="text-xs text-[#8B0000] font-bold tracking-widest uppercase">{news.deadline}</span>
                        <a 
                          href={news.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="w-full sm:w-auto bg-[#8B0000] text-white px-8 py-3 text-sm font-black tracking-widest flex items-center justify-center gap-2 hover:bg-[#C5A009] transition-all"
                        >
                          <MessageCircle className="w-4 h-4" /> {news.action}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 核心服務矩陣 */}
            <section className="py-24 md:py-32">
              <div className="container mx-auto px-4 md:px-6">
                <SectionTitle>服務矩陣</SectionTitle>

                <div className="grid grid-cols-3 md:grid-cols-3 gap-2 md:gap-16 justify-center">
                  {SERVICE_MATRIX.map((item) => (
                    <div 
                      key={item.id} 
                      onClick={() => handleServiceClick(item.actionType, item.actionValue)}
                      className="flex flex-col items-center text-center reveal group cursor-pointer"
                    >
                      <div className="relative w-16 h-16 sm:w-24 sm:h-24 md:w-56 md:h-56 rounded-full border border-[#8B0000]/10 flex items-center justify-center mb-4 md:mb-10 bg-white shadow-sm group-hover:shadow-xl transition-all duration-700 overflow-hidden">
                        <img 
                          src={getDriveImageUrl(item.imgId)} 
                          className="w-[60%] h-[60%] object-contain opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" 
                          alt={item.title} 
                        />
                      </div>
                      <h3 className="text-[10px] sm:text-sm md:text-2xl font-black text-[#3E2723] serif-title tracking-widest uppercase group-hover:text-[#8B0000] transition-colors">{item.title}</h3>
                      <div className="hidden md:block mt-4">
                        <p className="text-[#8B0000] font-bold tracking-widest mb-3 text-sm">{item.tagline}</p>
                        <p className="text-[#5D4037] leading-relaxed font-light text-sm max-w-[200px] mx-auto">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
            
            {/* 聖像莊嚴 */}
            <section className="py-24 md:py-32 border-y border-[#8B0000]/10 relative bg-[#FDFBF7]/50">
               <div className="container mx-auto px-6 relative">
                 <SectionTitle>聖像莊嚴</SectionTitle>

                 <div className="flex md:hidden absolute top-1/2 -translate-y-1/2 left-2 right-2 justify-between z-40 pointer-events-none">
                    <button onClick={prevStatue} className="w-10 h-10 rounded-full bg-white/80 border border-[#8B0000]/20 flex items-center justify-center text-[#8B0000] pointer-events-auto"><ChevronLeft className="w-6 h-6" /></button>
                    <button onClick={nextStatue} className="w-10 h-10 rounded-full bg-white/80 border border-[#8B0000]/20 flex items-center justify-center text-[#8B0000] pointer-events-auto"><ChevronRight className="w-6 h-6" /></button>
                 </div>

                 <div ref={scrollContainerRef} className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar gap-8 pb-12 px-4 md:grid md:grid-cols-3 md:px-0">
                    {DIVINE_STATUES.map((statue, idx) => (
                      <div key={idx} className="flex-shrink-0 w-full md:w-full snap-center group reveal">
                         <div className="relative aspect-[3/4] overflow-hidden ornament-border bg-white flex items-center justify-center p-8 shadow-sm group-hover:shadow-2xl transition-all duration-1000">
                            <img src={getDriveImageUrl(statue.imgId)} className="max-w-full max-h-full object-contain transition-transform duration-1000 group-hover:scale-110" alt={statue.name}/>
                            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent flex items-end justify-center p-10">
                               <h3 className="text-2xl md:text-4xl font-black text-[#8B0000] tracking-[0.3em] serif-title">{statue.name}</h3>
                            </div>
                         </div>
                         <div className="mt-8 text-center px-4">
                            <p className="text-[#C5A009] leading-relaxed italic font-bold text-lg mb-3">{statue.quote}</p>
                            <p className="text-[#5D4037] text-sm leading-loose font-light">{statue.description}</p>
                         </div>
                      </div>
                    ))}
                 </div>
                 
                 <div className="flex md:hidden justify-center gap-3 mt-4">
                    {DIVINE_STATUES.map((_, idx) => (
                      <div key={idx} className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentStatueIndex ? 'bg-[#8B0000] w-6' : 'bg-gray-300'}`}/>
                    ))}
                 </div>
               </div>
            </section>

            <Footer />
          </div>
        )}
      </main>

      {/* 表單彈窗 Modal - 改為米黃色調 */}
      {modalType !== 'none' && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6 overflow-y-auto">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setModalType('none')}></div>
          <div className="relative w-full max-w-2xl bg-[#FAF9F6] ornament-border p-8 md:p-12 shadow-2xl my-auto text-[#3E2723]">
             <button onClick={() => setModalType('none')} className="absolute top-6 right-6 text-[#5D4037] hover:text-[#8B0000] transition-colors z-10"><X className="w-8 h-8" /></button>
             
             {submitSuccess ? (
               <div className="text-center py-12 space-y-8 fade-in">
                  <CheckCircle2 className="w-24 h-24 text-[#8B0000] mx-auto animate-bounce" />
                  <div className="space-y-4">
                    <h3 className="text-2xl md:text-3xl font-black text-[#8B0000] serif-title">資料已成功傳送！</h3>
                    <p className="text-[#5D4037] text-lg font-light leading-loose">
                      請加入官方 LINE 告知小編您的姓名，<br className="hidden md:block" />
                      以利後續安排。
                    </p>
                  </div>
                  <a 
                    href="https://lin.ee/22Yqo9fe" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-3 bg-[#8B0000] text-white px-10 py-4 text-lg font-black tracking-widest hover:bg-[#C5A009] transition-all border border-[#C5A009]"
                  >
                    <MessageCircle className="w-6 h-6" /> 加入官方 LINE
                  </a>
               </div>
             ) : (
               <div className="space-y-8">
                  <div className="text-center">
                    <h3 className="text-3xl font-black text-[#8B0000] serif-title">
                      {modalType === 'lighting' ? '點燈祈福報名' : '線上問事預約'}
                    </h3>
                    <p className="text-[#C5A009] text-xs tracking-widest uppercase mt-2 font-bold">
                      {modalType === 'lighting' ? 'Blessing Registration' : 'Consultation Booking'}
                    </p>
                  </div>

                  <form onSubmit={handleFormSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs text-[#8B0000] font-bold tracking-widest">姓名</label>
                        <input name="name" required className="w-full bg-white border border-[#3E2723]/10 p-3 text-[#3E2723] focus:border-[#8B0000] outline-none transition-colors shadow-sm" />
                      </div>
                      
                      {modalType === 'lighting' ? (
                        <div className="space-y-2">
                          <label className="text-xs text-[#8B0000] font-bold tracking-widest">聯絡電話</label>
                          <input name="phone" required type="tel" className="w-full bg-white border border-[#3E2723]/10 p-3 text-[#3E2723] focus:border-[#8B0000] outline-none transition-colors shadow-sm" />
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <label className="text-xs text-[#8B0000] font-bold tracking-widest">性別</label>
                          <select name="gender" className="w-full bg-white border border-[#3E2723]/10 p-3 text-[#3E2723] focus:border-[#8B0000] outline-none transition-colors shadow-sm">
                            <option value="男">男</option>
                            <option value="女">女</option>
                          </select>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs text-[#8B0000] font-bold tracking-widest">出生年月日 (請註明農/國曆)</label>
                      <input name="birthday" required placeholder="例：1990/01/01 (國)" className="w-full bg-white border border-[#3E2723]/10 p-3 text-[#3E2723] focus:border-[#8B0000] outline-none transition-colors shadow-sm" />
                    </div>

                    {modalType === 'lighting' ? (
                      <>
                        <div className="space-y-2">
                          <label className="text-xs text-[#8B0000] font-bold tracking-widest">通訊地址</label>
                          <input name="address" required className="w-full bg-white border border-[#3E2723]/10 p-3 text-[#3E2723] focus:border-[#8B0000] outline-none transition-colors shadow-sm" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs text-[#8B0000] font-bold tracking-widest">點燈項目</label>
                          <select name="item" className="w-full bg-white border border-[#3E2723]/10 p-3 text-[#3E2723] focus:border-[#8B0000] outline-none transition-colors shadow-sm">
                            {LIGHTING_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                          </select>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <label className="text-xs text-[#8B0000] font-bold tracking-widest">詢問類別</label>
                          <select name="category" className="w-full bg-white border border-[#3E2723]/10 p-3 text-[#3E2723] focus:border-[#8B0000] outline-none transition-colors shadow-sm">
                            {INQUIRY_CATEGORIES.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs text-[#8B0000] font-bold tracking-widest">事由說明</label>
                          <textarea name="reason" rows={3} required className="w-full bg-white border border-[#3E2723]/10 p-3 text-[#3E2723] focus:border-[#8B0000] outline-none transition-colors resize-none shadow-sm" />
                        </div>
                      </>
                    )}

                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full bg-[#8B0000] text-white py-4 text-lg font-black tracking-[0.3em] hover:bg-[#C5A009] transition-all border border-[#C5A009] flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                      {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : '確認傳送'}
                    </button>
                  </form>
               </div>
             )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
