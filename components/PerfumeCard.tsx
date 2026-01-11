
import React from 'react';

interface PerfumeCardProps {
  perfume: any;
  contactInfo?: { telegram: string };
}

const PerfumeCard: React.FC<PerfumeCardProps> = ({ perfume, contactInfo }) => {
  const tgLink = `${contactInfo?.telegram || 'https://t.me/PremiumParfumes'}?text=${encodeURIComponent(`Salom! Men ${perfume.brand} ${perfume.name} haqida ma'lumot olmoqchi edim.`)}`;

  return (
    <div className="group flex flex-col w-full transition-all duration-500">
      <div className="aspect-[3/4] overflow-hidden bg-luxury-slate relative mb-8 border border-white/5">
        <img 
          src={perfume.image} 
          alt={perfume.name}
          className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60"></div>
        
        <div className="absolute top-0 right-0 p-6">
          <div className="bg-man-gold text-black px-3 py-1 text-[9px] font-black tracking-widest uppercase">
            {perfume.category}
          </div>
        </div>

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <a 
            href={tgLink}
            target="_blank"
            rel="noreferrer"
            className="bg-white text-black px-8 py-4 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-man-gold transition-colors"
          >
            ORDER NOW
          </a>
        </div>
      </div>

      <div className="space-y-2">
        <span className="text-man-gold font-black text-[10px] uppercase tracking-[0.4em]">{perfume.brand}</span>
        <h3 className="text-2xl font-serif text-white tracking-tight group-hover:text-man-gold transition-colors">{perfume.name}</h3>
        <p className="text-gray-500 text-xs font-light leading-relaxed line-clamp-2 uppercase tracking-widest">{perfume.description}</p>
      </div>
    </div>
  );
};

export default PerfumeCard;
