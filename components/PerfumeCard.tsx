
import React, { useState, useEffect } from 'react';
import { TRANSLATIONS } from '../constants';

interface PerfumeCardProps {
  perfume: any;
  contactInfo?: { telegram: string };
}

const PerfumeCard: React.FC<PerfumeCardProps> = ({ perfume, contactInfo }) => {
  const [lang, setLang] = useState<'uz' | 'ru'>('uz');

  useEffect(() => {
    const handleLang = (e: any) => setLang(e.detail);
    window.addEventListener('langChange', handleLang);
    return () => window.removeEventListener('langChange', handleLang);
  }, []);

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

        <div className="absolute bottom-6 left-6 right-6 translate-y-4 opacity-0 group-hover