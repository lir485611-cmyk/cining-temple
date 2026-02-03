
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import { Product, CartItem, Member } from './types';
import { X, ChevronRight, ShoppingBag, ArrowLeft, Loader2, AlertCircle, RefreshCw, CheckCircle2, LogOut, User as UserIcon, Settings, History, CreditCard, Heart, Landmark, MapPin, Sparkles, BookOpen, Star, Send, ShieldCheck, Moon, Sun, HeartHandshake, Compass, Zap } from 'lucide-react';

type View = 'Home' | 'ProductDetail' | 'Cart' | 'Login' | 'Account' | 'Checkout' | 'History';
type AuthMode = 'Login' | 'Register';

const GAS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbxD6QwijcuVb6l3RSB1XGE0hA9cjXUg3us_tmtVIBReeL2ffAaS_ZJKDFKMt1aCkJ0a/exec';

// 快捷入口資料
const QUICK_ACCESS_ITEMS = [
  { id: 1, title: '點燈祈福', imgId: '1gpME6-MqIAWRp7z9Oy95vLUyGdtWiIt6' },
  { id: 2, title: '油香喜添', imgId: '1s_N9r_7kx0dygts1HDdUwOVXHSVcC5R_' },
  { id: 3, title: '祈安燈籠', imgId: '1juMctdxwkk91ldfC_PUu1SYtP-qvEPqH' },
  { id: 4, title: '線上求籤', imgId: '1WtFQQT2Mq3jX-Iq7I65P046EbE1N0g1C' },
  { id: 5, title: '靈籤解籤', imgId: '1rcm_LaIAMYbZFEhHu4L9gTRtfvB4B64B' },
];

// 神尊圖片資料
const DIVINE_STATUES = [
  {
    name: '千手觀音',
    imgId: '1VVFGy1FdpVHWK-nG45D7dGcttBZbXgCG',
    quote: '「千處祈求千處現，苦海常作度人舟」'
  },
  {
    name: '天上聖母',
    imgId: '1eCe_3ffYdKIe1-eEXEQdnL9ojsUqOQeo',
    quote: '「聖母慈光，護國佑民」'
  }
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('Home');
  const [authMode, setAuthMode] = useState<AuthMode>('Login');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<{ message: string; details?: string } | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [user, setUser] = useState<Partial<Member> | null>(null);

  const introRef = useRef<HTMLDivElement>(null);

  const [authFormData, setAuthFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    phone: '',
    address: '',
    gender: '',
    birthday: '',
  });

  const [shippingAddr, setShippingAddr] = useState('');

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${GAS_WEB_APP_URL}?action=getProducts&timestamp=${Date.now()}`);
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setProducts(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('[APP_ERROR]', err);
      const { MOCK_PRODUCTS } = await import('./data/mockData');
      setProducts(MOCK_PRODUCTS);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  useEffect(() => {
    const savedCart = localStorage.getItem('cining_cart');
    if (savedCart) try { setCart(JSON.parse(savedCart)); } catch (e) {}
    const savedUser = sessionStorage.getItem('cining_user');
    if (savedUser) try { 
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser); 
      setShippingAddr(parsedUser.address || '');
    } catch (e) {}
  }, []);

  useEffect(() => { localStorage.setItem('cining_cart', JSON.stringify(cart)); }, [cart]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product_id === product.product_id);
      if (existing) return prev.map(item => item.product_id === product.product_id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => setCart(prev => prev.filter(item => item.product_id !== productId));
  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => item.product_id === productId ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item));
  };

  const startCheckout = () => {
    if (!user) {
      setIsCartOpen(false);
      setCurrentView('Login');
      setError({ message: '大德，請先登入帳戶', details: '登入後即可進行線上法務登記。' });
      return;
    }
    setIsCartOpen(false);
    setCurrentView('Checkout');
    window.scrollTo(0, 0);
  };

  const submitOrder = async () => {
    if (!user || cart.length === 0) return;
    setIsSubmitting(true);
    setError(null);

    const orderData = {
      action: 'createOrder',
      m_id: user.member_id,
      items: cart.map(item => ({ product_id: item.product_id, name: item.name, quantity: item.quantity, price: item.price })),
      o_total: cartTotal,
      o_shipping_addr: shippingAddr
    };

    try {
      const response = await fetch(GAS_WEB_APP_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(orderData),
      });
      const result = await response.json();
      if (result.error) throw new Error(result.error);

      setSuccessMsg(`登記成功！感謝您的虔誠護持。`);
      setCart([]);
      setTimeout(() => {
        setCurrentView('Home');
        setSuccessMsg(null);
      }, 3000);
    } catch (err: any) {
      setError({ message: '登記失敗', details: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const payload = {
      action: authMode === 'Register' ? 'register' : 'login',
      ...authFormData
    };

    try {
      const response = await fetch(GAS_WEB_APP_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (result.error) throw new Error(result.error);

      if (authMode === 'Register') {
        setSuccessMsg('帳號已成功開通。請登入。');
        setAuthMode('Login');
      } else {
        if (result.member) {
          setUser(result.member);
          setShippingAddr(result.member.address || '');
          sessionStorage.setItem('cining_user', JSON.stringify(result.member));
          setCurrentView('Home');
        }
      }
    } catch (err: any) {
      setError({ message: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // 輔助函式：取得 Google Drive 直連網址
  const getDriveUrl = (id: string) => `https://drive.google.com/uc?id=${id}`;

  return (
    <div className="min-h-screen">
      <Header 
        cartCount={cartCount} 
        onCartClick={() => setIsCartOpen(true)}
        onUserClick={() => user ? setCurrentView('Account') : setCurrentView('Login')}
        onHomeClick={() => { setCurrentView('Home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        onIntroClick={() => { setCurrentView('Home'); setTimeout(() => introRef.current?.scrollIntoView({ behavior: 'smooth' }), 100); }}
        user={user}
      />

      <main>
        {currentView === 'Home' && (
          <div className="fade-in">
            <Hero />

            {/* 線上服務快捷入口 (Quick Access) */}
            <section className="py-24 bg-white relative">
              <div className="container mx-auto px-6">
                <div className="flex flex-col items-center mb-20 text-center">
                   <h2 className="text-3xl md:text-5xl font-black text-[#1A1A1A] mb-6 tracking-widest">線上服務快捷入口</h2>
                   <div className="h-1.5 w-32 bg-[#003366]"></div>
                   <p className="mt-8 text-gray-500 font-medium tracking-[0.5em] uppercase text-xs">Digital Spiritual Connection</p>
                </div>

                <div className="flex flex-col space-y-16">
                   {/* Top Row: 3 Items */}
                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-16 max-w-6xl mx-auto w-full">
                      {QUICK_ACCESS_ITEMS.slice(0, 3).map(item => (
                        <div key={item.id} className="flex flex-col items-center">
                           <div className="badge-pattern-border w-56 h-56 md:w-64 md:h-64 rounded-full bg-white relative flex items-center justify-center cursor-pointer group">
                              <img 
                                src={getDriveUrl(item.imgId)} 
                                className="w-[55%] h-[55%] object-contain transition-transform duration-700 group-hover:scale-110 z-0" 
                                alt={item.title}
                              />
                              <div className="absolute inset-0 flex items-center justify-center bg-white/40 opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-[1px]">
                                <span className="vertical-text text-3xl md:text-4xl text-[#8B0000] font-black">
                                  {item.title}
                                </span>
                              </div>
                           </div>
                        </div>
                      ))}
                   </div>

                   {/* Bottom Row: 2 Items */}
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-16 max-w-3xl mx-auto w-full">
                      {QUICK_ACCESS_ITEMS.slice(3, 5).map(item => (
                        <div key={item.id} className="flex flex-col items-center">
                           <div className="badge-pattern-border w-56 h-56 md:w-64 md:h-64 rounded-full bg-white relative flex items-center justify-center cursor-pointer group">
                              <img 
                                src={getDriveUrl(item.imgId)} 
                                className="w-[55%] h-[55%] object-contain transition-transform duration-700 group-hover:scale-110" 
                                alt={item.title}
                              />
                              <div className="absolute inset-0 flex items-center justify-center bg-white/40 opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-[1px]">
                                <span className="vertical-text text-3xl md:text-4xl text-[#8B0000] font-black">
                                  {item.title}
                                </span>
                              </div>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            </section>
            
            {/* Cultural History Section */}
            <section ref={introRef} className="py-24 md:py-40 cloud-pattern bg-[#FCF9F2] border-t-2 border-orange-50">
              <div className="container mx-auto px-6 max-w-6xl">
                <div className="text-center mb-24">
                  <span className="text-[#8B0000] text-sm tracking-[0.8em] font-bold uppercase block mb-6">About Cining Temple</span>
                  <h2 className="text-4xl md:text-6xl font-black text-[#1A1A1A] leading-tight mb-8">🏛️ 南海慈寧宮：慈悲濟世，照亮心靈的明燈</h2>
                  <div className="h-1.5 w-32 bg-[#D4AF37] mx-auto"></div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
                  <div className="relative">
                    <div className="ornament-border bg-white p-2">
                      <img 
                        src="https://images.unsplash.com/photo-1578357078586-491aff1aa5ca?auto=format&fit=crop&q=80&w=1200" 
                        alt="朝聖文化" 
                        className="w-full grayscale-[20%] shadow-2xl"
                      />
                    </div>
                  </div>
                  <div className="space-y-8">
                    <h3 className="text-2xl md:text-3xl font-bold text-[#8B0000] border-l-4 border-[#D4AF37] pl-6">關於我們</h3>
                    <p className="text-lg text-gray-700 leading-loose font-normal">
                      位於喧囂塵世中的一抹淨土，南海慈寧宮始終秉持著菩薩大慈大悲的精神，致力於弘揚佛法與道教傳統美德。我們不僅是一個信仰的中心，更是每一位信眾心靈的避風港。
                    </p>
                    <p className="text-lg text-gray-700 leading-loose font-normal">
                      在這裡，香煙裊裊昇華的是眾生的願望，而梵音繞樑安撫的是疲憊的身心。我們深信，修行不只在殿堂之上，更在於日常的慈悲實踐與對社會的關懷。
                    </p>
                  </div>
                </div>

                {/* Core Values Section */}
                <div className="mb-40">
                  <div className="text-center mb-20">
                    <h3 className="text-3xl md:text-4xl font-black text-[#1A1A1A] mb-4">核心宗旨：三德理念</h3>
                    <p className="text-[#8B0000] text-xl font-bold tracking-widest">心誠則靈 ‧ 慈悲無量</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    <div className="bg-white p-10 ornament-border text-center group hover:bg-[#8B0000] transition-all duration-500">
                       <div className="w-16 h-16 bg-[#8B0000]/10 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:bg-white/20">
                          <HeartHandshake className="w-8 h-8 text-[#8B0000] group-hover:text-white" />
                       </div>
                       <h4 className="text-2xl font-black mb-6 text-[#8B0000] group-hover:text-[#D4AF37]">慈悲 (Compassion)</h4>
                       <p className="text-gray-600 group-hover:text-white/80 leading-relaxed font-normal">以同理心看待世間苦難，提供信眾精神上的指引。</p>
                    </div>
                    <div className="bg-white p-10 ornament-border text-center group hover:bg-[#8B0000] transition-all duration-500">
                       <div className="w-16 h-16 bg-[#8B0000]/10 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:bg-white/20">
                          <Compass className="w-8 h-8 text-[#8B0000] group-hover:text-white" />
                       </div>
                       <h4 className="text-2xl font-black mb-6 text-[#8B0000] group-hover:text-[#D4AF37]">智慧 (Wisdom)</h4>
                       <p className="text-gray-600 group-hover:text-white/80 leading-relaxed font-normal">透過法會與教化，引領大家轉化煩惱，找回內心的平靜。</p>
                    </div>
                    <div className="bg-white p-10 ornament-border text-center group hover:bg-[#8B0000] transition-all duration-500">
                       <div className="w-16 h-16 bg-[#8B0000]/10 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:bg-white/20">
                          <Zap className="w-8 h-8 text-[#8B0000] group-hover:text-white" />
                       </div>
                       <h4 className="text-2xl font-black mb-6 text-[#8B0000] group-hover:text-[#D4AF37]">圓滿 (Harmony)</h4>
                       <p className="text-gray-600 group-hover:text-white/80 leading-relaxed font-normal">祈願國泰民安，家庭和樂，建立正向的宗教力量。</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Divine Presence Showcase */}
            <section className="py-40 bg-[#1A1A1A] text-white relative overflow-hidden border-y-4 border-[#D4AF37]">
               <div className="absolute inset-0 opacity-10">
                 <img src="https://www.transparenttextures.com/patterns/black-paper.png" className="w-full h-full" />
               </div>
               
               <div className="container mx-auto px-6 relative z-10">
                 <div className="text-center mb-32">
                   <h2 className="text-5xl md:text-7xl font-black mb-8 text-[#D4AF37] tracking-widest">聖像莊嚴</h2>
                   <p className="text-gray-400 tracking-[0.5em] uppercase text-sm">Divine Presence of South Sea Cining Temple</p>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
                    <div className="group space-y-8 text-center">
                       <div className="relative aspect-[3/4] overflow-hidden ornament-border bg-black">
                          <img 
                            src={getDriveUrl(DIVINE_STATUES[0].imgId)} 
                            className="w-full h-full object-contain transition-transform duration-1000 group-hover:scale-105"
                            alt={DIVINE_STATUES[0].name}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end justify-center p-12">
                             <h3 className="text-3xl font-black text-[#D4AF37]">{DIVINE_STATUES[0].name}</h3>
                          </div>
                       </div>
                       <p className="text-gray-400 leading-relaxed italic max-w-sm mx-auto font-normal">{DIVINE_STATUES[0].quote}</p>
                    </div>

                    <div className="group space-y-8 text-center md:mt-24">
                       <div className="relative aspect-[3/4] overflow-hidden ornament-border bg-black">
                          <img 
                            src={getDriveUrl(DIVINE_STATUES[1].imgId)} 
                            className="w-full h-full object-contain transition-transform duration-1000 group-hover:scale-105"
                            alt={DIVINE_STATUES[1].name}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end justify-center p-12">
                             <h3 className="text-3xl font-black text-[#D4AF37]">{DIVINE_STATUES[1].name}</h3>
                          </div>
                       </div>
                       <p className="text-gray-400 leading-relaxed italic max-w-sm mx-auto font-normal">{DIVINE_STATUES[1].quote}</p>
                    </div>
                 </div>
               </div>
            </section>

            {/* Core Rituals Section */}
            <section className="py-40 bg-white">
              <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-32 border-b-2 border-[#F5F5F5] pb-16">
                  <div className="space-y-4">
                    <span className="text-[#8B0000] text-[11px] tracking-[0.6em] font-bold uppercase">Ritual Registrations</span>
                    <h2 className="text-5xl md:text-6xl font-black text-[#1A1A1A]">法務登記 / 功德項目</h2>
                  </div>
                  <button onClick={fetchProducts} className="text-xs uppercase tracking-widest text-gray-400 hover:text-[#8B0000] flex items-center gap-3 mt-8 md:mt-0">
                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} /> 同步廟方數據
                  </button>
                </div>

                {isLoading ? (
                  <div className="py-60 flex flex-col items-center justify-center space-y-8">
                    <Loader2 className="w-12 h-12 animate-spin text-[#8B0000]" />
                    <p className="text-2xl text-gray-400 font-bold tracking-widest">誠心感應中...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {products.map(product => (
                      <ProductCard 
                        key={product.product_id} 
                        product={product} 
                        onAddToCart={addToCart}
                        onViewDetail={(p) => { setSelectedProduct(p); setCurrentView('ProductDetail'); window.scrollTo(0, 0); }}
