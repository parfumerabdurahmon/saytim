
import { Perfume } from './types';

export interface ExtendedPerfume extends Omit<Perfume, 'price'> {
  price?: number;
  oldPrice?: number;
}

export const PERFUMES: ExtendedPerfume[] = [
  {
    id: 'aventus',
    name: 'Aventus',
    brand: 'CREED',
    description: 'Kuch va g\'alaba ramzi. Qora smorodina, italyan bergamoti va eman moxi uyg\'unligi. / Символ силы и успеха. Гармония черной смородины, итальянского бергамота и дубового мха.',
    image: 'https://images.unsplash.com/photo-1557170334-a9632e77c6e4?auto=format&fit=crop&q=80&w=800',
    notes: ['Pineapple', 'Birch', 'Musk', 'Bergamot'],
    category: 'Woody'
  },
  {
    id: 'sauvage',
    name: 'Sauvage Elixir',
    brand: 'DIOR',
    description: "Yovvoyi tabiat va aslzodalik chorrahasi. Qalampir va Kalabriya bergamotining o'tkir nafasi. / Перекресток дикой природы и благородства. Острый вдох передца и калабрийского бергамота.",
    image: 'https://images.unsplash.com/photo-1615332159800-479532587063?auto=format&fit=crop&q=80&w=800',
    notes: ['Sichuan Pepper', 'Bergamot', 'Ambrosan'],
    category: 'Fresh'
  },
  {
    id: 'ombreleather',
    name: 'Ombre Leather',
    brand: 'TOM FORD',
    description: 'Ochiq cho\'l va teri hidi. Erkinlik va qat\'iyatlik ifodasi. / Запах открытой пустыни и кожи. Выражение свободы и решительности.',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=800',
    notes: ['Leather', 'Jasmine', 'Amber', 'Patchouli'],
    category: 'Woody'
  },
  {
    id: 'blue-chanel',
    name: 'Bleu de Chanel',
    brand: 'CHANEL',
    description: 'Zamonaviy erkak uchun klassik tanlov. Tinchlik va ishonch. / Классический выбор для современного мужчины. Спокойствие и уверенность.',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=800',
    notes: ['Grapefruit', 'Incense', 'Ginger', 'Cedar'],
    category: 'Citrus'
  },
  {
    id: 'strongerwithyou',
    name: 'Stronger With You',
    brand: 'ARMANI',
    description: 'Zamonaviy energiya va shahvoniy iliqlik. Kardamon va adaçayı notalari. / Современная энергия и чувственное тепло. Ноты кардамона и шалфея.',
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=1200',
    notes: ['Cardamom', 'Pink Pepper', 'Vanilla', 'Chestnut'],
    category: 'Oriental'
  },
  {
    id: 'herod',
    name: 'Herod',
    brand: 'PARFUMS DE MARLY',
    description: 'Tutunli tamaki va vanilning shohona uyg\'unligi. / Королевское сочетание дымного табака и ванили.',
    image: 'https://images.unsplash.com/photo-1583445013765-46c20c4a6772?auto=format&fit=crop&q=80&w=1200',
    notes: ['Tobacco', 'Vanilla', 'Cinnamon', 'Incense'],
    category: 'Woody'
  }
];

export const CONTACT_INFO = {
  phone: '+998 99 690 95 75',
  instagram: 'https://www.instagram.com/premium_parfumes_org',
  telegram: 'https://t.me/PremiumParfumes',
};

export const TRANSLATIONS = {
  uz: {
    collection: "ARSENAL",
    aiAdvisor: "AI EKSPERT",
    contact: "BOG'LANISH",
    heroTitle: "Haqiqiy Erkaklar Atirlari",
    heroSub: "Kuch, xarakter va uslub ifodasi. Faqat eng sara va original erkaklar parfyumeriyasi.",
    explore: "Arsenalni ko'rish",
    aiGuide: "AI Ekspert",
    boutiqueColl: "Aslzodalar To'plami",
    quote: "Xarakter - bu siz tanlagan hid.",
    orderNow: "SO'ROV YUBORISH",
    aiTitle: "Scent Strategist",
    aiDesc: "Maqsadingizni ayting, biz sizga g'olibona hidni tanlab beramiz.",
    aiPlaceholder: "Masalan: 'Muzokaralar uchun ishonchli va kuchli hid kerak...'",
    discoverBtn: "Strategiyani tanlang",
    analyzing: "Tahlil...",
    recTitle: "Sizning tanlovingiz",
    tgAction: "Telegram orqali buyurtma bering",
    socialTitle: "Jamiyatimiz",
    socialDesc: "Eksklyuziv takliflar va yangiliklar.",
    tgBtn: "Telegram",
    igBtn: "Instagram",
    followIg: "Obuna bo'ling",
    happyUsers: "3000+ janoblar tanlovi",
    limitedOffer: "SHOHONA TAKLIF"
  },
  ru: {
    collection: "АРСЕНАЛ",
    aiAdvisor: "AI ЭКСПЕРТ",
    contact: "СВЯЗЬ",
    heroTitle: "Ароматы Настоящих Мужчин",
    heroSub: "Выражение силы, характера и стиля. Только лучшая и оригинальная мужская парфюмерия.",
    explore: "Смотреть арсенал",
    aiGuide: "AI Эксперт",
    boutiqueColl: "Коллекция Джентльменов",
    quote: "Характер — это аромат, который вы выбираете.",
    orderNow: "ОТПРАВИТЬ ЗАПРОС",
    aiTitle: "Scent Strategist",
    aiDesc: "Назовите свою цель, и мы подберем для вас победный аромат.",
    aiPlaceholder: "Например: 'Нужен уверенный и сильный аромат для переговоров...'",
    discoverBtn: "Выбрать стратегию",
    analyzing: "Анализ...",
    recTitle: "Ваш выбор",
    tgAction: "Заказать через Telegram",
    socialTitle: "Наше сообщество",
    socialDesc: "Эксклюзивные предложения и новости.",
    tgBtn: "Telegram",
    igBtn: "Instagram",
    followIg: "Подписаться",
    happyUsers: "3000+ выбор джентльменов",
    limitedOffer: "КОРОЛЕВСКОЕ ПРЕДЛОЖЕНИЕ"
  }
};
