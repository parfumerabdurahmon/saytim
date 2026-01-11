
import React, { useState, useEffect, Suspense, lazy } from 'react';
import Layout from './components/Layout';
import PerfumeCard from './components/PerfumeCard';
import LaunchSection from './components/LaunchSection';
import { TRANSLATIONS as INITIAL_TRANSLATIONS, PERFUMES as INITIAL_PERFUMES, CONTACT_INFO as INITIAL_CONTACT } from './constants';

// Lazy load components that are not critical for the initial paint
const AIAdvisor = lazy(() => import('./components/AIAdvisor'));
const AdminPanel = lazy(() => import('./components/AdminPanel'));

const App: React.FC = () => {
  const [lang, setLang] = useState<'uz' | 'ru'>('uz');
  const [perfumes, setPerfumes] = useState(INITIAL_PERFUMES);
  const [translations, setTranslations] = useState(INITIAL_TRANSLATIONS);
  const [contactInfo, setContactInfo] = useState(INITIAL_CONTACT);

  useEffect(() => {
    // Quick load from local storage to prevent hydration mismatch and speed up personalized content
    try {
      const savedPerfumes = localStorage.getItem('premium_perfumes_data');
      const savedTranslations = localStorage.getItem('premium_translations_data');
      const savedLinks = localStorage.getItem('premium_links_data');
      
      if (savedPerfumes) setPerfumes(JSON.parse(savedPerfumes));
      if (savedTranslations) setTranslations(JSON.parse(savedTranslations));
      if (savedLinks) setContactInfo(JSON.parse(savedLinks));
    } catch (e) {
      console.warn("Storage recovery failed", e);
    }

    const handleLang = (e: any) => setLang(e.detail);
    window.addEventListener('langChange', handleLang);
    return () => window.removeEventListener('langChange', handleLang);
  }, []);

  const t = (translations as any)[lang];

  return (
    <Layout>
      {/* Hero Section - Critical Path */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-[#050505]">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=60&w=1200" 
            className="w-full h-full object-cover opacity-40 brightness-50"
            alt="Luxury Fragrance"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-5xl">
          <div className="mb-8 inline-block overflow-hidden">
            <span className="text-man-gold font-bold tracking-[0.8em] text-[10px] uppercase block animate-fade-in">PREMIUM PARFUMES</span>
          </div>
          <h1 className="text-5xl md:text-[100px] font-serif text-white mb-10 leading-none tracking-tighter animate-slide-up">
            {t.heroTitle}
          </h1>
          <p className="text-gray-400 text-sm md:text-xl font-light mb-14 tracking-widest uppercase max-w-2xl mx-auto">
            {t.heroSub}
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a href="#collection" className="bg-man-gold text-black px-14 py-5 font-extrabold uppercase tracking-widest text-[10px] hover:bg-white transition-all transform hover:-translate-y-1 text-center">
              {t.explore}
            </a>
            <a href={contactInfo.telegram} target="_blank" rel="noreferrer" className="border border-white/20 text-white backdrop-blur-md px-14 py-5 font-extrabold uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all text-center">
              {t.contact}
            </a>
          </div>
        </div>
        
        <div className="absolute bottom-10 left-10 hidden lg:block animate-fade-in opacity-30">
           <p className="text-man-gold text-[10px] tracking-[0.3em] font-bold vertical-text uppercase">EST. 2024</p>
        </div>
      </section>

      {/* Boutique Collection */}
      <section id="collection" className="py-40 bg-[#050505] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-baseline mb-24 gap-8">
            <div className="max-w-xl">
              <span className="text-man-gold font-bold text-[10px] uppercase tracking-widest mb-4 block">{t.collection}</span>
              <h2 className="text-6xl font-serif text-white tracking-tighter uppercase">{t.boutiqueColl}</h2>
            </div>
            <div className="w-24 h-px bg-man-gold hidden md:block"></div>
            <p className="text-gray-500 font-serif italic text-2xl md:text-right max-w-xs">
              "{t.quote}"
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-32">
            {perfumes.map(p => <PerfumeCard key={p.id} perfume={p} contactInfo={contactInfo} />)}
          </div>
        </div>
      </section>

      <Suspense fallback={null}>
        <AIAdvisor lang={lang} />
      </Suspense>

      <LaunchSection lang={lang} contactInfo={contactInfo} />

      <Suspense fallback={null}>
        <AdminPanel />
      </Suspense>
    </Layout>
  );
};

export default App;
