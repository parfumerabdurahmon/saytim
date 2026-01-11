
import React, { useState, useEffect } from 'react';
import { CONTACT_INFO as INITIAL_CONTACT, TRANSLATIONS as INITIAL_TRANSLATIONS } from '../constants';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<'uz' | 'ru'>('uz');
  const [contactInfo, setContactInfo] = useState(INITIAL_CONTACT);
  const [translations, setTranslations] = useState(INITIAL_TRANSLATIONS);

  useEffect(() => {
    const savedLinks = localStorage.getItem('premium_links_data');
    const savedTranslations = localStorage.getItem('premium_translations_data');
    if (savedLinks) setContactInfo(JSON.parse(savedLinks));
    if (savedTranslations) setTranslations(JSON.parse(savedTranslations));

    const handleLang = (e: any) => setLang(e.detail);
    window.addEventListener('langChange', handleLang);
    return () => window.removeEventListener('langChange', handleLang);
  }, []);

  const t = (translations as any)[lang];

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] text-white">
      <header className="fixed top-0 w-full z-50 bg-[#050505]/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          <div className="flex items-center space-x-4 group cursor-pointer">
            <div className="w-10 h-10 bg-man-gold flex items-center justify-center relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] skew-x-[-20deg]"></div>
               <i className="fas fa-crown text-black text-xl relative z-10 transition-transform duration-500 group-hover:scale-110"></i>
            </div>
            <span className="text-xl md:text-2xl font-serif font-bold tracking-tighter uppercase transition-colors duration-500 group-hover:text-man-gold">PREMIUM PARFUMES</span>
          </div>
          
          <nav className="hidden lg:flex space-x-12 text-[10px] font-black tracking-[0.3em] uppercase">
            <a href="#collection" className="text-gray-400 hover:text-man-gold transition-colors">{t.collection}</a>
            <a href={contactInfo.telegram} target="_blank" className="text-gray-400 hover:text-man-gold transition-colors">{t.contact}</a>
          </nav>

          <div className="flex items-center space-x-8">
            <div className="flex border border-white/10 overflow-hidden text-[9px] font-black">
              <button 
                onClick={() => { setLang('uz'); window.dispatchEvent(new CustomEvent('langChange', { detail: 'uz' })); }}
                className={`px-4 py-2 ${lang === 'uz' ? 'bg-man-gold text-black' : 'text-gray-400'}`}
              >UZ</button>
              <button 
                onClick={() => { setLang('ru'); window.dispatchEvent(new CustomEvent('langChange', { detail: 'ru' })); }}
                className={`px-4 py-2 ${lang === 'ru' ? 'bg-man-gold text-black' : 'text-gray-400'}`}
              >RU</button>
            </div>
            <a href={contactInfo.instagram} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-man-gold transition-colors">
              <i className="fab fa-instagram text-xl"></i>
            </a>
          </div>
        </div>
      </header>

      <main className="flex-grow pt-24">
        {React.Children.map(children, child => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement<any>, { lang, contactInfo });
          }
          return child;
        })}
      </main>

      <footer id="contact" className="bg-[#000000] py-32 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-20">
            <div className="col-span-2">
              <div className="flex items-center space-x-4 mb-8 group w-fit">
                <div className="w-12 h-12 border border-man-gold flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-man-gold/10 group-hover:bg-man-gold/20 transition-colors"></div>
                  <i className="fas fa-crown text-man-gold text-2xl group-hover:animate-bounce transition-all"></i>
                </div>
                <h3 className="text-4xl font-serif tracking-tighter uppercase">
                  PREMIUM <br/> PARFUMES
                </h3>
              </div>
              <p className="text-gray-600 font-light text-sm max-w-sm leading-relaxed tracking-widest uppercase">
                {lang === 'uz' ? 'Eksklyuziv erkaklar arsenali. Biz faqat original va g\'oliblar uchun tanlangan mahsulotlarni taqdim etamiz.' : 'Эксклюзивный мужской арсенал. Мы предлагаем только оригинальную продукцию, выбранную для победителей.'}
              </p>
            </div>
            
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.5em] mb-10 text-man-gold">{t.contact}</h4>
              <ul className="space-y-6 text-gray-500 text-sm font-bold tracking-widest">
                <li className="flex items-center">
                  <i className="fas fa-phone mr-4 text-man-gold text-xs"></i>
                  {contactInfo.phone}
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.5em] mb-10 text-man-gold">Follow</h4>
              <div className="flex gap-6">
                <a href={contactInfo.instagram} target="_blank" className="text-gray-500 hover:text-man-gold text-2xl transition-all"><i className="fab fa-instagram"></i></a>
                <a href={contactInfo.telegram} target="_blank" className="text-gray-500 hover:text-man-gold text-2xl transition-all"><i className="fab fa-telegram"></i></a>
              </div>
            </div>
          </div>
          <div className="mt-32 pt-12 border-t border-white/5 text-center text-gray-800 text-[9px] font-black tracking-[1em] uppercase">
            &copy; {new Date().getFullYear()} PREMIUM PARFUMES ELITE.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
