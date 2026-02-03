
import { Product } from '../types';

export const MOCK_PRODUCTS: Product[] = [
  {
    product_id: 'S001',
    name: '歲次乙巳年 點燈祈福',
    category: '點燈祈福',
    price: 600,
    original_price: 600,
    stock: 9999,
    image_url: 'https://images.unsplash.com/photo-1590059392550-99e28941783f?auto=format&fit=crop&q=80&w=1200',
    description: '包含光明燈、安太歲、文昌燈等各類祈福，祈求元神光彩、消災解厄。',
    detail_content: '信眾可選擇不同類別之燈種。本宮道長將定期於朔望之日（初一、十五）為點燈信眾誦經祈福，保佑平安順遂。',
    spec: '年度登記 / 線上報名',
    status: 'Active'
  },
  {
    product_id: 'S002',
    name: '慈悲濟世 大法會報名',
    category: '法會報名',
    price: 1200,
    original_price: 1200,
    stock: 500,
    image_url: 'https://images.unsplash.com/photo-1578357078586-491aff1aa5ca?auto=format&fit=crop&q=80&w=1200',
    description: '參與宮內定期舉辦之各項殊勝法會，祈求國泰民安，回向功德。',
    detail_content: '包含消災延壽、除障度母法會。信眾可登記疏文，將愛心轉化為實質力量，淨化身心靈障礙。',
    spec: '限時登記 / 疏文祈福',
    status: 'Active'
  },
  {
    product_id: 'S003',
    name: '聖母聖示 問事報名',
    category: '問事報名',
    price: 0,
    original_price: 0,
    stock: 30,
    image_url: 'https://images.unsplash.com/photo-1541018939203-36eeab6d5721?auto=format&fit=crop&q=80&w=1200',
    description: '尋求聖母指引，解開生活中之迷惑，找回內心的平靜。',
    detail_content: '提供信眾精神上的指引。不論是家庭、事業或學業，歡迎親臨感受祥和。預約制服務，費用隨喜（功德箱）。',
    spec: '預約制 / 隨喜功德',
    status: 'Active'
  },
  {
    product_id: 'S004',
    name: '傳承慈悲 徒步環島',
    category: '徒步環島',
    price: 3600,
    original_price: 3600,
    stock: 200,
    image_url: 'https://images.unsplash.com/photo-1518005020411-38b81210a7ab?auto=format&fit=crop&q=80&w=1200',
    description: '跟隨聖母腳步，進行全台徒步巡禮，體悟修行不只在殿堂之上。',
    detail_content: '年度重大活動。參與者將在日常中實踐慈悲與磨練意志，深入社會角落傳遞愛與關懷。含裝備與全程支援。',
    spec: '年度盛事 / 報名額滿為止',
    status: 'Active'
  }
];
