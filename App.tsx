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

/**
 * 重要：請將下方的網址替換為您在 Google Apps Script「部署」後取得的「網頁應用程式 URL」。
 */
const GAS_API_URL = 'https://script.google.com/macros/s/AKfycbxMpcQEBFtDCJULvPZz1rZZfJ1mcduue2w3DlEw2Thj3NlovjM8dW4sqyt3U1pP_Yc/exec'; 

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

// Added DIVINE_STATUES constant to fix the compilation error
const DIVINE_STATUES = [
  {
    name: '天上聖母',
    imgId: '1eCe_3ffYdKIe1-eEXEQdnL9ojsUqOQeo',
    quote: '聖德參天，母儀天下',
    description: '守護海疆，保佑平安。媽祖娘娘慈心護祐，化解災難，引領信眾走向祥和。'
  },
  {
    name: '千手千眼觀世音菩薩',
    imgId: '1eCe_3ffYdKIe1-eEXEQdnL9ojsUqOQeo', // Placeholder ID
    quote: '慈悲廣大，隨類應現',
    description: '具足千手，救護眾生；具足千眼，照明世間。觀世音菩薩以慈悲救苦救難，感應十方信眾。'
  },
  {
    name: '福德正神',
    imgId: '1eCe_3ffYdKIe1-eEXEQdnL9ojsUqOQeo', // Placeholder ID
    quote: '守護家園，財源廣進',
    description: '土地之神，司掌禍福。保佑地方安寧，護持有緣信眾財利亨通、事事順遂。'
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

  // 表單狀態
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
    if (GAS_API_URL.includes('YOUR_ACTUAL_DEPLOYED_ID')) {
      alert('請先在 App.tsx 中第 21 行替換正式的 GAS API URL。');
      return;
    }

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
                {/* 修改為 lg:grid-cols-2 實現兩個一行 */}
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

            {/* 聖像莊嚴輪播 */}
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
                                  <img src={getDriveImageUrl(statue.imgId)} className="max-w-full h-full object-contain transition-transform duration-1000 group-hover:scale-105" alt={statue.name} />
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
                  南海慈寧宮座落於山水匯聚之福地，主祀<span className="font-bold text-[#8B0000]">千手千眼觀世音菩薩</span>與<span className="font-bold text-[#8B0000]">天上聖母</span>。
                </p>
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                   {DIVINE_STATUES.map(s => (
                     <div key={s.name} className="flex flex-col items-center">
                        <div className="w-full aspect-[3/4] bg-gray-50 flex items-center justify-center p-4 border border-gray-100 shadow-inner mb-8">
                           <img src={getDriveImageUrl(s.imgId)} className="max-h-full object-contain" alt={s.name}/>
                        </div>
                        <h4 className="text-2xl font-black serif-title text-[#8B0000] mb-4">{s.name}</h4>
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

      {/* 線上報名表單彈窗 */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center bg-black/60 p-4 animate-in fade-in duration-300 backdrop-blur-sm">
           <div className="bg-white w-full max-w-xl ornament-border shadow-2xl relative flex flex-col max-h-[90vh]">
              {!isSuccess ? (
                <>
                  <div className="bg-[#8B0000] text-white p-6 flex justify-between items-center shadow-lg">
                    <div>
                      <h3 className="text-2xl font-black serif-title tracking-widest">線上報名 ‧ {formType}</h3>
                      <p className="text-[10px] opacity-60 tracking-[0.3em] uppercase mt-1">Cining Temple Online Service</p>
                    </div>
                    <button onClick={() => setIsFormOpen(false)} className="hover:rotate-90 transition-transform p-2">
                      <X className="w-8 h-8" />
                    </button>
                  </div>

                  <form onSubmit={handleFormSubmit} className="p-8 space-y-5 overflow-y-auto no-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-[#8B0000] flex items-center gap-2 tracking-widest uppercase"><User className="w-3 h-3" /> 信眾姓名</label>
                        <input required type="text" placeholder="請輸入姓名" className="w-full bg-[#FDFBF7] border border-gray-100 p-4 focus:ring-1 focus:ring-[#8B0000] outline-none transition-all serif-title"
                          value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-[#8B0000] flex items-center gap-2 tracking-widest uppercase"><PhoneIcon className="w-3 h-3" /> 聯絡電話</label>
                        <input required type="tel" placeholder="請輸入電話" className="w-full bg-[#FDFBF7] border border-gray-100 p-4 focus:ring-1 focus:ring-[#8B0000] outline-none transition-all"
                          value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                      </div>
                    </div>

                    {/* 生日欄位包含類別選擇 */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-end mb-1">
                        <label className="text-xs font-black text-[#8B0000] flex items-center gap-2 tracking-widest uppercase"><Cake className="w-3 h-3" /> 出生日期</label>
                        <div className="flex gap-3 bg-white px-3 py-1 border border-gray-100 shadow-sm rounded-sm">
                          {['國曆', '農曆'].map((type) => (
                            <label key={type} className="flex items-center gap-1.5 cursor-pointer group">
                              <input type="radio" name="birthdayType" value={type} checked={formData.birthdayType === type} onChange={(e) => setFormData({...formData, birthdayType: e.target.value})}
                                className="w-3 h-3 accent-[#8B0000]" />
                              <span className={`text-[11px] font-bold ${formData.birthdayType === type ? 'text-[#8B0000]' : 'text-gray-400 group-hover:text-gray-600'}`}>{type}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <input required type="text" placeholder={`請輸入${formData.birthdayType}日期 (例：70/5/20)`} className="w-full bg-[#FDFBF7] border border-gray-100 p-4 focus:ring-1 focus:ring-[#8B0000] outline-none transition-all"
                        value={formData.birthday} onChange={(e) => setFormData({...formData, birthday: e.target.value})} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-[#8B0000] flex items-center gap-2 tracking-widest uppercase">性別</label>
                        <div className="flex gap-4 p-4 bg-[#FDFBF7] border border-gray-100">
                          {['男', '女'].map((g) => (
                            <label key={g} className="flex items-center gap-2 cursor-pointer group">
                              <input type="radio" name="gender" value={g} checked={formData.gender === g} onChange={(e) => setFormData({...formData, gender: e.target.value})}
                                className="w-4 h-4 accent-[#8B0000]" />
                              <span className="text-sm font-bold group-hover:text-[#8B0000]">{g}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-[#8B0000] flex items-center gap-2 tracking-widest uppercase"><Flower2 className="w-3 h-3" /> {formType === '線上問事' ? '請示類別' : '祈福項目'}</label>
                        <select className="w-full bg-[#FDFBF7] border border-gray-100 p-4 focus:ring-1 focus:ring-[#8B0000] outline-none transition-all serif-title"
                          value={formData.item} onChange={(e) => setFormData({...formData, item: e.target.value})}>
                          {formItems.map(item => <option key={item} value={item}>{item}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black text-[#8B0000] flex items-center gap-2 tracking-widest uppercase"><Home className="w-3 h-3" /> 現居地址</label>
                      <input required type="text" placeholder="請輸入完整地址" className="w-full bg-[#FDFBF7] border border-gray-100 p-4 focus:ring-1 focus:ring-[#8B0000] outline-none transition-all"
                        value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black text-[#8B0000] flex items-center gap-2 tracking-widest uppercase"><MessageCircle className="w-3 h-3" /> {formType === '線上問事' ? '問事說明' : '祈願內容 (選填)'}</label>
                      <textarea placeholder={formType === '線上問事' ? "請簡述您想請示聖母的事由..." : "請寫下您的祈願..."}
                        className="w-full bg-[#FDFBF7] border border-gray-100 p-4 focus:ring-1 focus:ring-[#8B0000] outline-none transition-all min-h-[80px] resize-none"
                        value={formData.reason} onChange={(e) => setFormData({...formData, reason: e.target.value})}></textarea>
                    </div>

                    <div className="pt-4">
                      <button disabled={isSubmitting} type="submit"
                        className={`w-full py-5 bg-[#8B0000] text-white font-black tracking-[0.5em] text-lg shadow-xl hover:bg-[#C5A009] transition-all flex items-center justify-center gap-3 border border-[#C5A009] ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        {isSubmitting ? '報名資料傳送中...' : '誠心報名 ‧ 送出資料'}
                        {!isSubmitting && <Send className="w-5 h-5" />}
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="p-12 text-center space-y-8 animate-in zoom-in-95 duration-500">
                  <div className="flex justify-center">
                    <div className="w-24 h-24 bg-[#8B0000]/10 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-16 h-16 text-[#8B0000] animate-bounce" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-3xl font-black serif-title text-[#8B0000] tracking-widest">已送出申請</h3>
                    <p className="text-[#5D4037] leading-loose">
                      感謝大德誠心參與本宮 {formType}。<br />
                      報名資訊已成功傳送並標註提交時間。<br />
                      師姐將於三個工作日內盡速與您聯繫。<br />
                      <span className="font-bold">慈雲普覆，寧境安心。</span>
                    </p>
                  </div>
                  <button onClick={() => setIsFormOpen(false)} 
                    className="bg-[#8B0000] text-white px-12 py-4 font-black tracking-widest shadow-lg border border-[#C5A009] hover:bg-[#C5A009] transition-all">
                    了解，法喜充滿
                  </button>
                </div>
              )}
           </div>
        </div>
      )}

      {/* 徒步路線燈箱 */}
      {isMapOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/90 p-4 md:p-12 animate-in fade-in duration-300 backdrop-blur-md">
          <button onClick={() => setIsMapOpen(false)} className="absolute top-6 right-6 text-white/60 hover:text-white transition-all z-[310] p-3 bg-white/10 rounded-full hover:bg-white/20">
            <X className="w-10 h-10" />
          </button>
          <div className="w-full h-full max-w-5xl bg-white shadow-2xl rounded-lg overflow-hidden flex flex-col relative">
             <div className="bg-[#8B0000] text-white px-8 py-4 flex justify-between items-center">
                <span className="font-black tracking-widest serif-title">丙午年徒步環島 ‧ 路線手冊</span>
             </div>
             <iframe src={`https://drive.google.com/file/d/${ROUTE_MAP_ID}/preview`} className="w-full flex-1 border-none" allow="autoplay" title="徒步路線手冊" />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default App;