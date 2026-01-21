
import React from 'react';

interface LaunchSectionProps {
  lang: 'uz' | 'ru';
  contactInfo?: { telegram: string };
  translations?: any;
}

const LaunchSection: React.FC<LaunchSectionProps> = ({ lang, contactInfo, translations }) => {
  const t = translations?.[lang] || {};

  return (
    <section className="relative py-48 bg-[#000000] text-white flex justify-center items-center">
      <div className="absolute inset-0 opacity-20">
         <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#222_1px,transparent_1px)] [background-size:40px_40px]"></div>
      </div>
      
      <div className="relative max-w-6xl mx-auto px-4 text-center">
        <div className="border border-white/5 p-16 md:p-32 bg-luxury-slate/30 backdrop-blur-3xl relative">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-man-gold text-black px-6 py-2 text-[10px] font-black tracking-widest uppercase">
            {t.limitedOffer || (lang === 'uz' ? 'YANGI REZERV' : 'НОВЫЙ РЕЗЕРВ')}
          </div>
          
          <h2 className="text-6xl md:text-9xl font-serif mb-12 tracking-tighter uppercase leading-none">
            Royal Amber: Dark Edition
          </h2>
          
          <p className="max-w-2xl mx-auto text-gray-500 text-lg md:text-xl font-light mb-16 tracking-wide leading-relaxed">
            {t.quote || (lang === 'uz' ? "Xarakter - bu siz tanlagan hid." : "Характер — это аромат, который вы выбираете.")}
          </p>
          
          <div className="flex flex-col items-center gap-12">
            <a 
              href={contactInfo?.telegram || "https://t.me/PremiumParfumes"}
              target="_blank"
              className="border-2 border-man-gold text-man-gold px-20 py-6 font-black uppercase tracking-[0.5em] text-xs hover:bg-man-gold hover:text-black transition-all"
            >
              {t.orderNow || (lang === 'uz' ? 'REZERV QILISH' : 'ЗАБРОНИРОВАТЬ')}
            </a>
            <p className="text-gray-700 text-[10px] font-bold tracking-[0.8em] uppercase">
              {lang === 'uz' ? 'Eksklyuziv seriya yaqinda' : 'Эксклюзивная серия скоро'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LaunchSection;
