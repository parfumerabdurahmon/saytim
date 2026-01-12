
import React, { useState, useEffect, useRef } from 'react';
import { CONTACT_INFO as INITIAL_CONTACT, TRANSLATIONS as INITIAL_TRANSLATIONS } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  onSearch?: (query: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, onSearch }) => {
  const [lang, setLang] = useState<'uz' | 'ru'>('uz');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [contactInfo, setContactInfo] = useState(INITIAL_CONTACT);
  const [translations, setTranslations] = useState(INITIAL_TRANSLATIONS);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedLinks = localStorage.getItem('premium_links_data');
    const savedTranslations = localStorage.getItem('premium_translations_data');
    if (savedLinks) setContactInfo(JSON.parse(savedLinks));
    if (savedTranslations) setTranslations(JSON.parse(savedTranslations));

    const handleLang = (e: any) => setLang(e.detail);
    window.addEventListener('langChange', handleLang);
    return () => window.removeEventListener('langChange', handleLang);
  }, []);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const t = (translations as any)[lang] || INITIAL_TRANSLATIONS[lang];

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] text-white">
      <header className="fixed top-0 w-full z-50 bg-[#050505]/95 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 md:h-24 flex items-center justify-between gap-4">
          
          <div className={`flex items-center space-x-3 md:space-x-4 group cursor-pointer shrink-0 transition-opacity duration-300 ${isSearchOpen ? 'opacity-0 pointer-events-none absolute' : 'opacity-100'}`} onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="w-8 h-8 md:w-10 md:h-10 bg-man-gold flex items-center justify-center relative overflow-hidden">
               <i className="fas fa-crown text-black text-sm md:text-xl relative z-10"></i>
            </div>
            <span className="text-lg md:text-2xl font-serif font-bold tracking-tighter uppercase transition-colors duration-500 group-hover:text-man-gold">PREMIUM PARFUMES</span>
          </div>
          
          <div className={`flex-1 transition-all duration-500 ease-in-out flex items-center justify-end ${isSearchOpen ? 'max-w-full pl-0' : 'max-w-[40px] md:max-w-[100px]'}`}>
            <div className={`relative flex items-center transition-all duration-500 border-b ${isSearchOpen ? 'w-full border-man-gold/40' : 'w-10 border-transparent'}`}>
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={`w-10 h-10 flex items-center justify-center transition-colors hover:text-man-gold ${isSearchOpen ? 'text-man-gold' : 'text-gray-500'}`}
              >
                <i className={`fas ${isSearchOpen ? 'fa-xmark' : 'fa-magnifying-glass'} text-sm md:text-base`}></i>
              </button>
              
              <input 
                ref={searchInputRef}
                type="text" 
                onChange={(e) => onSearch?.(e.target.value)}
                onBlur={() => { if (!searchInputRef.current?.value) setIsSearchOpen(false); }}
                placeholder={lang === 'uz' ? 'HIDNI QIDIRISH...' : 'ПОИСК АРОМАТА...'}
                className={`bg-transparent py-3 pr-4 text-[10px] font-black tracking-[0.25em] uppercase outline-none transition-all duration-500 placeholder:text-gray-800 text-white ${isSearchOpen ? 'flex-1 opacity-100 pl-4' : 'w-0 opacity-0 overflow-hidden'}`}
              />
            </div>
          </div>

          <div className={`flex items-center space-x-4 md:space-x-8 shrink-0 transition-opacity duration-300 ${isSearchOpen ? 'hidden md:flex opacity-30 pointer-events-none' : 'opacity-100'}`}>
            <nav className="hidden lg:flex space-x-12 text-[10px] font-black tracking-[0.3em] uppercase">
              <a href="#collection" className="text-gray-400 hover:text-man-gold transition-colors">{t.collection}</a>
            </nav>

            <div className="flex border border-white/10 overflow-hidden text-[9px] font-black rounded-sm">
              <button 
                onClick={() => { setLang('uz'); window.dispatchEvent(new CustomEvent('langChange', { detail: 'uz' })); }}
                className={`px-3 py-2 transition-colors ${lang === 'uz' ? 'bg-man-gold text-black' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
              >UZ</button>
              <button 
                onClick={() => { setLang('ru'); window.dispatchEvent(new CustomEvent('langChange', { detail: 'ru' })); }}
                className={`px-3 py-2 transition-colors ${lang === 'ru' ? 'bg-man-gold text-black' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
              >RU</button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer id="contact" className="bg-[#000000] py-32 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex flex-col items-center mb-12">
            <div className="w-12 h-12 border border-man-gold flex items-center justify-center mb-6">
              <i className="fas fa-crown text-man-gold text-2xl"></i>
            </div>
            <h3 className="text-4xl font-serif tracking-tighter uppercase mb-4">PREMIUM PARFUMES</h3>
            <p className="text-gray-600 font-light text-xs tracking-widest uppercase max-w-md mx-auto leading-relaxed">
              {lang === 'uz' ? 'Eksklyuziv erkaklar arsenali. Biz faqat original va g\'oliblar uchun tanlangan mahsulotlarni taqdim etamiz.' : 'Эксклюзивный мужской арсенал. Мы предлагаем только оригинальную продукцию, выбранную для победителей.'}
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 md:gap-12 mb-16">
            <a href={`tel:${contactInfo.phone}`} className="text-gray-500 hover:text-man-gold transition-all flex items-center gap-3">
              <i className="fas fa-phone text-man-gold"></i>
              <span className="text-xs font-bold tracking-widest">{contactInfo.phone}</span>
            </a>
            <a href={contactInfo.instagram} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-man-gold text-2xl transition-all"><i className="fab fa-instagram"></i></a>
            <a href={contactInfo.telegram} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-man-gold text-2xl transition-all"><i className="fab fa-telegram"></i></a>
          </div>
          
          <div className="pt-12 border-t border-white/5 text-gray-800 text-[9px] font-black tracking-[1em] uppercase">
            &copy; {new Date().getFullYear()} PREMIUM PARFUMES ELITE.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
