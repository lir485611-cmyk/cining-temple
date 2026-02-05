import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Footer from './components/Footer';
import { X, Calendar, MessageCircle, Flower2, Map as MapIcon, Clock, MapPin, Send, CheckCircle2 } from 'lucide-react';

type View = 'Home' | 'About' | 'Gods' | 'Pilgrimage';

export const getDriveImageUrl = (id: string) => {
  if (!id) return '';
  return `https://lh3.googleusercontent.com/d/${id}`;
};

const ROUTE_MAP_ID = '1e2cuiEfVfpsvHCaBZ6KoU0Doj5noQh-p';
const GAS_API_URL = 'https://script.google.com/macros/s/AKfycbw9ecTvmXt5zuWSx99yuxkvmpvlBou8fzFVzcIyToxCS9CNPG9pB5B4wg1FxqoWRo-y/exec'; 
const LINE_CONTACT_URL = 'https://lin.ee/VqVsX38';

const LATEST_NEWS = [
  {
    id: 'news3',
    title: '丙午年徒步環島',
    desc: '第三次徒步環島，一步一腳印，皆是懺悔，也是祈禱。跟隨聖母腳步巡禮全台，體悟修行不只在殿堂之上，更在腳下的每一寸土地。',
    deadline: '年度盛事', 
    type: '最新活動',
    actions: [
      { label: 'LINE 諮詢', link: 'https://lin.ee/22Yqo9fe', type: 'primary', icon: 'message' },
      { label: '徒步路線', link: '#', type: 'secondary', icon: 'map', isMapTrigger: true }
    ]
  },
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
    desc: '尋求聖母指引，解開生活迷惑。不論家庭、事業 or 學業，由本宮協助。',
    deadline: '預約制',
    type: '線上問事',
    items: ['事業', '家庭', '姻緣', '財運', '身體健康'],
    actions: [
      { label: '線上預約', type: 'primary', icon: 'form', isFormTrigger: true }
    ]
  }
];

const DIVINE_STATUES = [
  {
    name: '天上聖母',
    imgId: '1xlLX_Qal-hAl8fCNFMw0clHkuPnvYIjK',
    quote: '聖德參天，母儀天下',
    description: '守護海疆，保佑平安。媽祖娘娘慈心護祐，化解災難，引領信眾走向祥和。'
  },
  {
    name: '觀世音菩薩',
    imgId: '1GjOjnXQSe85As0muuHb5tJG2q5JENJ3h',
    quote: '慈悲廣大，隨類應現',
    description: '觀照世間疾苦之聲。尋聲而至，普渡眾生於無量劫。一念虔誠，慈悲相應；萬丈佛光，指引歸途，願以此聖光，照亮人間前路，撫慰每一顆不安的心靈。'
  },
  {
    name: '武財神',
    imgId: '1v44HK02w8ItKawLw347-9aQDr7Sxv8j9',
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
    name: '', phone: '', birthday: '', birthdayType: '國曆', gender: '男', address: '', item: '', reason: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  const handleStatueScroll = () => {
    if (!statueScrollRef.current) return;
    const { scrollLeft, clientWidth } = statueScrollRef.current;
    const index = Math.round(scrollLeft / clientWidth);
    if (index !== activeStatueIndex) setActiveStatueIndex(index);
  };

  const openForm = (type: string, items: string[]) => {
    setFormType(type);
    setFormItems(items);
    setFormData({ 
      name: '', phone: '', birthday: '', birthdayType: '國曆', gender: '男', address: '', item: items[0] || '', reason: '' 
    });
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
        birthday: formType === '線上問事' ? `${formData.birthdayType} ${formData.birthday}` : '',
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
      <Flower2 className="w-6 h-6 text-[#B22222] opacity-60" />
      <h2 className="text-3xl md:text-5xl font-black text-[#B22222] tracking-widest serif-title">{children}</h2>
      <Flower2 className="w-6 h-6 text-[#B22222] opacity-60" />
    </div>
  );

  const NewsCard = ({ news, isMain = false }: { news: any, isMain?: boolean }) => (
    <div className={`bg-white ornament-border ${isMain ? 'p-8 md:p-12' : 'p-6 md:p-8'} shadow-xl border-l-4 border-[#B22222] flex flex-col group transition-all duration-500 hover:-translate-y-1 h-full`}>
      <div className="flex justify-between items-start mb-6">
        <span className="px-4 py-1.5 text-[10px] font-black tracking-widest uppercase bg-[#B22222] text-white shadow-md">
          {news.type}
        </span>
        <Calendar className="w-5 h-5 text-[#C5A009]" />
      </div>
      <h4 className={`${isMain ? 'text-2xl md:text-4xl' : 'text-xl md:text-2xl'} font-black mb-4 serif-title text-[#B22222] group-hover:text-[#C5A009] transition-colors leading-tight`}>
        {news.title}
      </h4>
      <p className={`text-[#333333] mb-8 font-light leading-relaxed ${isMain ? 'text-lg' : 'text-sm'} line-clamp-3`}>
        {news.desc}
      </p>
      
      <div className="flex flex-col gap-6 mt-auto">
        {news.deadline && (
          <span className="text-xs text-[#B22222] font-bold tracking-widest uppercase">
            {news.deadline.includes('預約') ? news.deadline : `截止：${news.deadline}`}
          </span>
        )}
        <div className={`flex flex-col ${isMain ? 'md:flex-row' : ''} gap-3`}>
          {news.actions.map((act: any, idx: number) => (
            <button
              key={idx}
              onClick={() => {
                if (act.isMapTrigger) setIsMapOpen(true);
                else if (act.isFormTrigger) openForm(news.type || '', news.items || []);
                else if (act.link) window.open(act.link, '_blank');
              }}
              className={`${(isMain && news.actions.length > 1) ? 'md:w-1/2' : 'w-full'} px-6 py-4 text-xs md:text-sm font-black tracking-widest flex items-center justify-center gap-2 transition-all shadow-md ${
                act.type === 'primary' 
                ? 'bg-[#B22222] text-white border border-[#C5A009] hover:bg-[#C5A009]' 
                : 'bg-transparent text-[#B22222] border-2 border-[#B22222]/20 hover:border-[#B22222] hover:bg-[#B22222]/5'
              }`}
            >
              {act.icon === 'message' ? <MessageCircle className="w-4 h-4" /> : act.icon === 'form' ? <Send className="w-4 h-4" /> : <MapIcon className="w-4 h-4" />}
              {act.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen text-[#333333] overflow-x-hidden bg-white">
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
            
            <section className="relative z-40 px-4 pt-24 md:pt-40 bg-white">
              <div className="container mx-auto max-w-6xl">
                <SectionTitle className="mb-12">最新消息</SectionTitle>
                
                {/* 1+2 佈局結構 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                  {/* 第一排：環島活動 (全寬) */}
                  <div className="md:col-span-2">
                    <NewsCard news={LATEST_NEWS[0]} isMain={true} />
                  </div>
                  
                  {/* 第二排：祈福燈 & 問事 (並排) */}
                  <div className="md:col-span-1">
                    <NewsCard news={LATEST_NEWS[1]} />
                  </div>
                  <div className="md:col-span-1">
                    <NewsCard news={LATEST_NEWS[2]} />
                  </div>
                </div>
              </div>
            </section>

            <section className="py-24 md:py-40 bg-white overflow-hidden">
               <div className="container mx-auto text-center px-4">
                 <div className="flex justify-center mb-24">
                    <div className="bg-[#B22222] text-white px-12 py-5 font-black tracking-[0.4em] serif-title text-3xl md:text-5xl shadow-[6px_6px_0px_#C5A009] relative z-10">
                      聖像莊嚴
                    </div>
                 </div>

                 <div className="relative">
                    <div ref={statueScrollRef} onScroll={handleStatueScroll} className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar gap-8 md:gap-16 px-4 md:px-[25%] pb-12">
                       {DIVINE_STATUES.map((statue, idx) => (
                         <div key={idx} className="flex-shrink-0 w-full md:w-[600px] snap-center">
                            <div className="group">
                               <div className="relative aspect-[3/4] overflow-hidden ornament-border bg-white flex items-center justify-center p-8 md:p-12 shadow-sm group-hover:shadow-2xl transition-all duration-1000">
                                  <img src={getDriveImageUrl(statue.imgId)} className="max-w-full h-full object-contain transition-transform duration-1000 group-hover:scale-105" alt={statue.name} />
                               </div>
                               <div className="mt-12 text-center px-4">
                                  <h3 className="text-3xl font-black text-[#B22222] serif-title mb-4 tracking-widest">{statue.name}</h3>
                                  <p className="text-[#C5A009] leading-relaxed italic font-bold text-xl mb-4">{statue.quote}</p>
                                  <p className="text-[#333333] text-base leading-loose font-light max-w-lg mx-auto">{statue.description}</p>
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

        {currentView === 'Gods' && (
          <div className="fade-in bg-white py-40">
             <div className="container mx-auto px-6 max-w-5xl text-center">
                <SectionTitle>祀奉神尊</SectionTitle>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                   {DIVINE_STATUES.map(s => (
                     <div key={s.name} className="flex flex-col items-center">
                        <div className="w-full aspect-[3/4] bg-white flex items-center justify-center p-4 border border-gray-100 shadow-inner mb-8 overflow-hidden ornament-border">
                           <img src={getDriveImageUrl(s.imgId)} className="max-h-full object-contain" alt={s.name}/>
                        </div>
                        <h4 className="text-2xl font-black serif-title text-[#B22222] mb-4">{s.name}</h4>
                        <p className="text-[#C5A009] font-bold mb-2">{s.quote}</p>
                        <p className="text-gray-500 text-sm max-w-xs">{s.description}</p>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        )}

        {currentView === 'About' && (
          <div className="fade-in container mx-auto px-6 py-40 max-w-4xl space-y-24">
             <SectionTitle>宮廟沿革</SectionTitle>
             <section className="bg-white ornament-border p-8 md:p-12 shadow-sm space-y-6">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-[2px] bg-[#B22222]"></div>
                  <h2 className="text-2xl md:text-3xl font-black text-[#B22222] serif-title tracking-widest">緣起 ‧ 慈航普渡</h2>
                </div>
                <p className="text-lg leading-relaxed text-[#333333]">
                  南海慈寧宮主祀<span className="font-bold text-[#B22222]">天上聖母</span>與<span className="font-bold text-[#B22222]">觀世音菩薩</span>。
                </p>
                <p className="text-[#333333]">菩薩以慈眼觀照世間，聖母以仁心護佑蒼生。自建宮以來，無數信眾於此尋求心靈安適。</p>
             </section>
             <div className="text-center mt-20">
                <button onClick={() => setCurrentView('Home')} className="bg-[#B22222] text-white px-12 py-4 text-xl font-black tracking-widest hover:bg-[#C5A009] transition-all border border-[#C5A009] shadow-lg">返回首頁</button>
             </div>
          </div>
        )}

        {currentView === 'Pilgrimage' && (
          <div className="fade-in bg-white py-40">
             <div className="container mx-auto px-6 max-w-5xl">
                <SectionTitle>朝聖資訊</SectionTitle>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
                  <div className="bg-white p-10 border border-gray-100 shadow-sm flex items-center gap-8 ornament-border">
                    <Clock className="w-12 h-12 text-[#B22222]" />
                    <div>
                      <h4 className="text-xs font-black tracking-widest text-gray-400 mb-2 uppercase">開放參拜時間</h4>
                      <p className="text-2xl font-black serif-title text-[#333333]">每日 9:00 - 18:00</p>
                    </div>
                  </div>
                  <div className="bg-white p-10 border border-gray-100 shadow-sm flex items-center gap-8 ornament-border">
                    <MapPin className="w-12 h-12 text-[#B22222]" />
                    <div>
                      <h4 className="text-xs font-black tracking-widest text-gray-400 mb-2 uppercase">宮廟地址</h4>
                      <p className="text-xl font-black serif-title text-[#333333]">高雄鼓山區民康街216號</p>
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
                  <div className="bg-[#B22222] text-white p-6 flex justify-between items-center shadow-lg">
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
                        <label className="text-xs font-black text-[#B22222] uppercase tracking-widest">信眾姓名</label>
                        <input required type="text" placeholder="請輸入姓名" className="w-full bg-white border border-gray-200 p-4 outline-none focus:ring-1 focus:ring-[#B22222]"
                          value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-[#B22222] uppercase tracking-widest">聯絡電話</label>
                        <input required type="tel" placeholder="請輸入電話" className="w-full bg-white border border-gray-200 p-4 outline-none focus:ring-1 focus:ring-[#B22222]"
                          value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                       <div className="space-y-2">
                        <label className="text-xs font-black text-[#B22222] uppercase tracking-widest">性別</label>
                        <select className="w-full bg-white border border-gray-200 p-4 outline-none focus:ring-1 focus:ring-[#B22222]"
                          value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})}>
                          <option value="男">男</option>
                          <option value="女">女</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-[#B22222] uppercase tracking-widest">項目</label>
                        <select className="w-full bg-white border border-gray-200 p-4 outline-none focus:ring-1 focus:ring-[#B22222]"
                          value={formData.item} onChange={(e) => setFormData({...formData, item: e.target.value})}>
                          {formItems.map(item => <option key={item} value={item}>{item}</option>)}
                        </select>
                      </div>
                    </div>
                    {formType === '線上問事' && (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div className="space-y-2">
                            <label className="text-xs font-black text-[#B22222] uppercase tracking-widest">生日類型</label>
                            <select className="w-full bg-white border border-gray-200 p-4 outline-none focus:ring-1 focus:ring-[#B22222]"
                              value={formData.birthdayType} onChange={(e) => setFormData({...formData, birthdayType: e.target.value})}>
                              <option value="國曆">國曆</option>
                              <option value="農曆">農曆</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-black text-[#B22222] uppercase tracking-widest">出生日期 (年月日)</label>
                            <input required type="text" placeholder="例：75/10/12" className="w-full bg-white border border-gray-200 p-4 outline-none focus:ring-1 focus:ring-[#B22222]"
                              value={formData.birthday} onChange={(e) => setFormData({...formData, birthday: e.target.value})} />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-black text-[#B22222] uppercase tracking-widest">居住地址</label>
                          <input required type="text" placeholder="請輸入詳細地址" className="w-full bg-white border border-gray-200 p-4 outline-none focus:ring-1 focus:ring-[#B22222]"
                            value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
                        </div>
                      </>
                    )}
                    <div className="space-y-2">
                      <label className="text-xs font-black text-[#B22222] uppercase tracking-widest">其他說明 (事由)</label>
                      <textarea placeholder="請簡述您的需求或祈願事項" className="w-full bg-white border border-gray-200 p-4 outline-none focus:ring-1 focus:ring-[#B22222] h-32"
                        value={formData.reason} onChange={(e) => setFormData({...formData, reason: e.target.value})} />
                    </div>
                    <div className="pt-4">
                      <button disabled={isSubmitting} type="submit" className="w-full py-5 bg-[#B22222] text-white font-black tracking-[0.5em] hover:bg-[#C5A009] transition-all">
                        {isSubmitting ? '傳送中...' : '誠心報名 ‧ 送出資料'}
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="p-12 text-center space-y-8 animate-in zoom-in-95 duration-500">
                  <CheckCircle2 className="w-16 h-16 text-[#B22222] mx-auto animate-bounce" />
                  <div className="space-y-4">
                    <h3 className="text-3xl font-black serif-title text-[#B22222]">已送出報名申請</h3>
                    <p className="text-[#333333] font-medium leading-relaxed">
                      報名資料已成功提交！<br />
                      <span className="font-bold text-[#B22222]">請務必加入 LINE 官方帳號並發送訊息</span>，<br />
                      由小編為您確認報名進度，法喜充滿！
                    </p>
                  </div>
                  <div className="flex flex-col gap-4">
                    <a href={LINE_CONTACT_URL} target="_blank" rel="noopener noreferrer" 
                       className="bg-[#00B900] text-white px-12 py-5 font-black flex items-center justify-center gap-3 hover:bg-[#009900] transition-all shadow-lg rounded-full group">
                      <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
                      加入 LINE 與小編確認
                    </a>
                    <button onClick={() => setIsFormOpen(false)} className="text-[#B22222] font-black underline underline-offset-4 decoration-2">了解，返回網頁</button>
                  </div>
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