
import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Footer from './components/Footer';
import { X, Calendar, MessageCircle, Flower2, Map as MapIcon, Clock, MapPin, Facebook, Send, User, Phone as PhoneIcon, Home, Cake, CheckCircle2 } from 'lucide-react';

type View = 'Home' | 'About' | 'Gods' | 'Pilgrimage';

export const getDriveImageUrl = (id: string) => {
  if (!id) return '';
  return `https://lh3.googleusercontent.com/d/${id}`;
};

const ROUTE_MAP_ID = '1ZS5SILdpJXxlNxpCXpLk963SBGuv_1sn';
const GAS_API_URL = 'https://script.google.com/macros/s/AKfycbw-OBnT-XiO0I0_4giYSHBNv13e_rbyeV014fpdK18AQKfHk_7l42xbug_4U8Qnq_Jt/exec'; 

const LATEST_NEWS = [
  {
    id: 'news1',
    title: '龍柱祈福燈',
    desc: '燃燈供佛，龍天護佑。點亮整年元神光明，祈求闔家平安順遂。',
    deadline: '115/2/20',
    type: '點燈報名',
    items: ['龍柱燈'],
    actions: [
      { label: '線上報名', type: 'primary', icon: 'form', isFormTrigger: true }
    ]
  },
  {
    id: 'news2',
    title: '聖母聖示 ‧ 線上問事',
    desc: '尋求聖母指引，解開生活迷惑。不論家庭、事業 or 學業，由本宮協助請示聖母。',
    deadline: '預約制',
    type: '線上問事',
    items: ['家庭運勢', '事業前程', '身體健康', '姻緣求子', '開運補財庫', '其他'],
    actions: [
      { label: '線上預約', type: 'primary', icon: 'form', isFormTrigger: true }
    ]
  },
  {
    id: 'news3',
    title: '丙午年徒步環島',
    desc: '第三次徒步環島，一步一腳印，皆是懺悔，也是祈禱。朝向聖母的懷抱。',
    deadline: '', 
    actions: [
      { label: 'LINE 諮詢', link: 'https://lin.ee/22Yqo9fe', type: 'primary', icon: 'message' },
      { label: '徒步路線', link: '#', type: 'secondary', icon: 'map', isMapTrigger: true }
    ]
  }
];

const DIVINE_STATUES = [
  {
    name: '天上聖母',
    imgId: '1eCe_3ffYdKIe1-eEXEQdnL9ojsUqOQeo',
    quote: '聖德參天，母儀天下',
    description: '守護海疆，保佑平安。媽祖娘娘慈心護祐，化解災難，引領信眾走向祥和。'
  },
  {
    name: '千手千眼觀世音菩薩',
    imgId: '1VVFGy1FdpVHWK-nG45D7dGcttBZbXgCG',
    quote: '慈悲廣大，隨類應現',
    description: '具足千手，救護眾生；具足千眼，照明世間。觀世音菩薩以慈悲救苦救難，感應十方信眾。'
  },
  {
    name: '武財神',
    imgId: '1ZS5SILdpJXxlNxpCXpLk963SBGuv_1sn', // Placeholder
    quote: '招財進寶，事業亨通',
    description: '主掌天下財源，為勤奮經營的大德招財開運、指引財路，助事業蒸蒸日上。'
  },
  {
    name: '虎爺大將軍',
    imgId: '1-8qfVQXgkSNi__jJFddNPEtWinNaGgAP',
    quote: '驅邪鎮宅，守護財庫',
    description: '鎮守神龕之下，具備強大的驅邪與咬錢招財之力。護佑孩童平安長大，避開小人是非。'
  }
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('Home');
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [activeStatueIndex, setActiveStatueIndex] = useState(0);
  const [formType, setFormType] = useState('');
  const [formItems, setFormItems] = useState<string[]>([]);
  const statueScrollRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    birthday: '',
    birthdayType: '國曆',
    gender: '男',
    address: '',
    item: '',
    reason: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const openForm = (type: string, items: string[]) => {
    setFormType(type);
    setFormItems(items);
    setFormData({ ...formData, item: items[0] || '', reason: '', gender: '男', birthdayType: '國曆', birthday: '' });
    setIsSuccess(false);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        action: 'submitCustomForm',
        formType: formType,
        ...formData,
        birthday: `${formData.birthdayType} ${formData.birthday}`,
        timestamp: new Date().toLocaleString('zh-TW', { hour12: false })
      };

      await fetch(GAS_API_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      setTimeout(() => {
        setIsSuccess(true);
        setIsSubmitting(false);
      }, 800);

    } catch (error) {
      console.error('Submission error:', error);
      alert('資料送出失敗，請確認網路連線。');
      setIsSubmitting(false);
    }
  };

  const SectionTitle = ({ children, className = "" }: { children?: React.ReactNode, className?: string }) => (
    <div className={`flex items-center justify-center gap-6 mb-16 ${className}`}>
      <Flower2 className="w-6 h-6 text-[#8B0000] opacity-60" />
      <h2 className="text-3xl md:text-5xl font-black text-[#8B0000] tracking-widest serif-title">{children}</h2>
      <Flower2 className="w-6 h-6 text-[#8B0000] opacity-60" />
    </div>
  );

  return (
    <div className="min-h-screen text-[#3E2723] overflow-x-hidden bg-white">
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
            
            <section className="relative z-40 px-4 pt-24 md:pt-40">
              <div className="container mx-auto max-w-5xl">
                <SectionTitle className="mb-12">最新消息</SectionTitle>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  {LATEST_NEWS.map((news) => (
                    <div key={news.id} className="bg-white ornament-border p-8 md:p-10 shadow-xl border-l-4 border-[#8B0000] flex flex-col group transition-all duration-500 hover:-translate-y-1">
                      <div className="flex justify-between items-start mb-6">
                        <span className="px-4 py-1.5 text-[10px] font-black tracking-widest uppercase bg-[#8B0000] text-white shadow-md">
                          {news.type === '線上問事' ? '聖母聖示' : '最新活動'}
                        </span>
                        <Calendar className="w-5 h-5 text-[#C5A009]" />
                      </div>
                      <h4 className="text-xl md:text-2xl font-black mb-4 serif-title text-[#8B0000] group-hover:text-[#C5A009] transition-colors">{news.title}</h4>
                      <p className="text-[#5D4037] mb-8 font-light leading-relaxed line-clamp-2 h-16">{news.desc}</p>
                      
                      <div className="flex flex-col gap-6 mt-auto">
                        {news.deadline && (
                          <span className="text-xs text-[#8B0000] font-bold tracking-widest uppercase">
                            {news.deadline.includes('預約') ? news.deadline : `截止：${news.deadline}`}
                          </span>
                        )}
                        <div className="flex flex-col gap-3">
                          {news.actions.map((act, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                if (act.isMapTrigger) setIsMapOpen(true);
                                else if (act.isFormTrigger) openForm(news.type || '', news.items || []);
                                else window.open(act.link, '_blank');
                              }}
                              className={`w-full px-6 py-3 text-sm font-black tracking-widest flex items-center justify-center gap-2 transition-all shadow-md ${
                                act.type === 'primary' 
                                ? 'bg-[#8B0000] text-white border border-[#C5A009] hover:bg-[#C5A009]' 
                                : 'bg-transparent text-[#8B0000] border-2 border-[#8B0000]/20 hover:border-[#8B0000] hover:bg-[#8B0000]/5'
                              }`}
                            >
                              {act.icon === 'message' ? <MessageCircle className="w-4 h-4" /> : act.icon === 'form' ? <Send className="w-4 h-4" /> : <MapIcon className="w-4 h-4" />}
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

            <section className="py-24 md:py-40 bg-white mt-32 overflow-hidden">
               <div className="container mx-auto">
                 <div className="flex justify-center mb-24">
                    <div className="bg-[#B22222] text-white px-12 py-5 font-black tracking-[0.4em] serif-title text-3xl md:text-5xl shadow-[6px_6px_0px_#C5A009] relative z-10">
                      聖像莊嚴
                    </div>
                 </div>

                 <div className="relative">
                    <div ref={statueScrollRef} onScroll={handleStatueScroll} className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar gap-8 md:gap-16 px-6 md:px-[25%] pb-12">
                       {DIVINE_STATUES.map((statue, idx) => (
                         <div key={idx} className="flex-shrink-0 w-full md:w-[600px] snap-center">
                            <div className="group">
                               <div className="relative aspect-[3/4] overflow-hidden ornament-border bg-[#FDFBF7] flex items-center justify-center p-8 md:p-12 shadow-sm group-hover:shadow-2xl transition-all duration-1000">
                                  {statue.imgId ? (
                                    <img src={getDriveImageUrl(statue.imgId)} className="max-w-full h-full object-contain transition-transform duration-1000 group-hover:scale-105" alt={statue.name} />
                                  ) : (
                                    <div className="w-32 h-32 border-8 border-[#C5A009] rounded-full flex items-center justify-center">
                                      <span className="text-[#C5A009] text-6xl font-black serif-title">財</span>
                                    </div>
                                  )}
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
                    <div className="flex justify-center items-center gap-4 mt-8">
                       {DIVINE_STATUES.map((_, idx) => (
                         <button key={idx} onClick={() => statueScrollRef.current?.scrollTo({ left: idx * (statueScrollRef.current?.clientWidth || 0), behavior: 'smooth' })} className={`transition-all duration-500 rounded-full h-2.5 ${activeStatueIndex === idx ? 'w-10 bg-[#B22222]' : 'w-2.5 bg-gray-200 hover:bg-[#B22222]/30'}`} />
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
                  南海慈寧宮座落於山水匯聚之福地，主祀<span className="font-bold text-[#8B0000]">天上聖母</span>與<span className="font-bold text-[#8B0000]">千手千眼觀世音菩薩</span>。
                </p>
                <p>菩薩以千眼觀照世間苦厄，聖母以慈心護佑萬民平安。自建宮以來，無數信眾於此尋求心靈寄託。</p>
             </section>
             <div className="text-center mt-20">
                <button onClick={() => setCurrentView('Home')} className="bg-[#8B0000] text-white px-12 py-4 text-xl font-black tracking-widest hover:bg-[#C5A009] transition-all border border-[#C5A009] shadow-lg">返回首頁</button>
             </div>
          </div>
        )}

        {currentView === 'Gods' && (
          <div className="fade-in bg-white py-40">
             <div className="container mx-auto px-6 max-w-5xl text-center">
                <SectionTitle>祀奉神尊</SectionTitle>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                   {DIVINE_STATUES.map(s => (
                     <div key={s.name} className="flex flex-col items-center">
                        <div className="w-full aspect-[3/4] bg-gray-50 flex items-center justify-center p-4 border border-gray-100 shadow-inner mb-8 overflow-hidden ornament-border">
                           {s.imgId ? (
                             <img src={getDriveImageUrl(s.imgId)} className="max-h-full object-contain" alt={s.name}/>
                           ) : (
                             <div className="w-48 h-48 border-8 border-[#C5A009] rounded-full flex items-center justify-center">
                               <span className="text-[#C5A009] text-8xl font-black serif-title">財</span>
                             </div>
                           )}
                        </div>
                        <h4 className="text-2xl font-black serif-title text-[#8B0000] mb-4">{s.name}</h4>
                        <p className="text-[#C5A009] font-bold mb-2">{s.quote}</p>
                        <p className="text-gray-500 text-sm max-w-xs">{s.description}</p>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        )}

        {currentView === 'Pilgrimage' && (
          <div className="fade-in bg-white py-40">
             <div className="container mx-auto px-6 max-w-5xl">
                <SectionTitle>朝聖資訊</SectionTitle>
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
             </div>
          </div>
        )}
      </main>

      {isFormOpen && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center bg-black/60 p-4 animate-in fade-in duration-300 backdrop-blur-sm">
           <div className="bg-white w-full max-w-xl ornament-border shadow-2xl relative flex flex-col max-h-[90vh]">
              {!isSuccess ? (
                <>
                  <div className="bg-[#8B0000] text-white p-6 flex justify-between items-center shadow-lg">
                    <div>
                      <h3 className="text-2xl font-black serif-title tracking-widest">線上報名 ‧ {formType}</h3>
                    </div>
                    <button onClick={() => setIsFormOpen(false)} className="hover:rotate-90 transition-transform p-2">
                      <X className="w-8 h-8" />
                    </button>
                  </div>
                  <form onSubmit={handleFormSubmit} className="p-8 space-y-5 overflow-y-auto no-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-[#8B0000] uppercase tracking-widest">信眾姓名</label>
                        <input required type="text" placeholder="請輸入姓名" className="w-full bg-[#FDFBF7] border border-gray-100 p-4 outline-none focus:ring-1 focus:ring-[#8B0000]"
                          value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-[#8B0000] uppercase tracking-widest">聯絡電話</label>
                        <input required type="tel" placeholder="請輸入電話" className="w-full bg-[#FDFBF7] border border-gray-100 p-4 outline-none focus:ring-1 focus:ring-[#8B0000]"
                          value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                      </div>
                    </div>
                    <div className="pt-4">
                      <button disabled={isSubmitting} type="submit" className="w-full py-5 bg-[#8B0000] text-white font-black tracking-[0.5em] hover:bg-[#C5A009] transition-all">
                        {isSubmitting ? '傳送中...' : '誠心報名 ‧ 送出資料'}
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="p-12 text-center space-y-8 animate-in zoom-in-95 duration-500">
                  <CheckCircle2 className="w-16 h-16 text-[#8B0000] mx-auto animate-bounce" />
                  <h3 className="text-3xl font-black serif-title text-[#8B0000]">已送出申請</h3>
                  <button onClick={() => setIsFormOpen(false)} className="bg-[#8B0000] text-white px-12 py-4 font-black">了解，法喜充滿</button>
                </div>
              )}
           </div>
        </div>
      )}

      {isMapOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/90 p-4 md:p-12 animate-in fade-in duration-300 backdrop-blur-md">
          <button onClick={() => setIsMapOpen(false)} className="absolute top-6 right-6 text-white/60 hover:text-white transition-all z-[310] p-3 bg-white/10 rounded-full">
            <X className="w-10 h-10" />
          </button>
          <div className="w-full h-full max-w-5xl bg-white shadow-2xl rounded-lg overflow-hidden relative">
             <iframe src={`https://drive.google.com/file/d/${ROUTE_MAP_ID}/preview`} className="w-full h-full border-none" allow="autoplay" title="徒步路線手冊" />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default App;
