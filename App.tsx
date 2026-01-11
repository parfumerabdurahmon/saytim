
import React, { useState, useEffect, Suspense, lazy } from 'react';
import Layout from './components/Layout';
import PerfumeCard from './components/PerfumeCard';
import LaunchSection from './components/LaunchSection';
import { TRANSLATIONS as INITIAL_TRANSLATIONS, PERFUMES as INITIAL_PERFUMES, CONTACT_INFO as INITIAL_CONTACT } from './constants';

const AIAdvisor = lazy(() => import('./components/AIAdvisor'));
const Visualizer = lazy(() => import('./components/Visualizer'));
const MotionStudio = lazy(() => import('./components/MotionStudio'));
const Concierge = lazy(() => import('./components/Concierge'));
const MessageForm = lazy(() => import('./components/MessageForm'));
const AdminPanel = lazy(() => import('./components/AdminPanel'));

const App: React.FC = () => {
  const [lang, setLang] = useState<'uz' | 'ru'>('uz');
  const [perfumes, setPerfumes] = useState(INITIAL_PERFUMES);
  const [translations, setTranslations] = useState(INITIAL_TRANSLATIONS);
  const [contactInfo, setContactInfo] = useState(INITIAL_CONTACT);

  useEffect(() => {
    try {
      const savedPerfumes = localStorage.getItem('premium_perfumes_data');
      const savedTranslations = localStorage.getItem('premium_translations_data');
      const savedLinks = localStorage.getItem('premium_links_data');
      
      if (savedPerfumes) setPerfumes(JSON.parse(savedPerfumes));
      if (savedTranslations) setTranslations(JSON.parse(savedTranslations));
      if (savedLinks) setContactInfo(JSON.parse(savedLinks));
    } catch (e) {
      console.warn("Storage sync skipped");
    }

    const handleLang = (e: any) => setLang(e.detail);
    window.addEventListener('langChange', handleLang);
    return () => window.removeEventListener('langChange', handleLang);
  }, []);

  const t = (translations as any)[lang] || INITIAL_TRANSLATIONS[lang];

  return (
    <Layout>
      <section className="relative h-[90vh] md:h-screen flex items-center justify-center overflow-hidden bg-[#050505]">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=1200" 
            className="w-full h-full object-cover opacity-40 brightness-50"
            alt="Hero Background"
            loading="eager"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-5xl">
          <div className="mb-6 inline-block overflow-hidden">
            <span className="text-man-gold font-bold tracking-[1em] text-[10px] uppercase block animate-fade-in">PREMIUM PARFUMES</span>
          </div>
          <h1 className="text-5xl md:text-8xl lg:text-[110px] font-serif text-white mb-8 leading-none tracking-tighter animate-slide-up">
            {t.heroTitle}
          </h1>
          <p className="text-gray-400 text-sm md:text-lg font-light mb-12 tracking-widest uppercase max-w-2xl mx-auto">
            {t.heroSub}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#collection" className="bg-man-gold text-black px-12 py-5 font-black uppercase tracking-widest text-[10px] hover:bg-white transition-all transform hover:-translate-y-1 text-center">
              {t.explore}
            </a>
          </div>
        </div>
      </section>

      <section id="collection" className="py-32 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-baseline mb-20 gap-8">
            <div className="max-w-xl">
              <span className="text-man-gold font-bold text-[10px] uppercase tracking-widest mb-2 block">{t.collection}</span>
              <h2 className="text-5xl font-serif text-white tracking-tighter uppercase">{t.boutiqueColl}</h2>
            </div>
            <p className="text-gray-500 font-serif italic text-xl md:text-right max-w-xs">
              "{t.quote}"
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
            {perfumes.map(p => <PerfumeCard key={p.id} perfume={p} contactInfo={contactInfo} />)}
          </div>
        </div>
      </section>

      <Suspense fallback={<div className="h-64 bg-[#050505]" />}>
        <AIAdvisor lang={lang} />
        <Visualizer lang={lang} />
        <MotionStudio lang={lang} />
        <MessageForm lang={lang} contactInfo={contactInfo} />
        <LaunchSection lang={lang} contactInfo={contactInfo} />
        <Concierge lang={lang} />
        <AdminPanel />
      </Suspense>
    </Layout>
  );
};

export default App;
