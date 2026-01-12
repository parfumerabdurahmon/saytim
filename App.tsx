
import React, { useState, useEffect, Suspense, lazy } from 'react';
import Layout from './components/Layout';
import PerfumeCard from './components/PerfumeCard';
import LaunchSection from './components/LaunchSection';
import TalkingAI from './components/TalkingAI';
import { TRANSLATIONS as INITIAL_TRANSLATIONS, PERFUMES as INITIAL_PERFUMES, CONTACT_INFO as INITIAL_CONTACT } from './constants';

const MessageForm = lazy(() => import('./components/MessageForm'));
const AdminPanel = lazy(() => import('./components/AdminPanel'));

const App: React.FC = () => {
  const [lang, setLang] = useState<'uz' | 'ru'>('uz');
  const [perfumes, setPerfumes] = useState(INITIAL_PERFUMES);
  const [searchQuery, setSearchQuery] = useState('');
  const [translations, setTranslations] = useState(INITIAL_TRANSLATIONS);
  const [contactInfo, setContactInfo] = useState(INITIAL_CONTACT);

  useEffect(() => {
    const savedPerfumes = localStorage.getItem('premium_perfumes_data');
    const savedTranslations = localStorage.getItem('premium_translations_data');
    const savedLinks = localStorage.getItem('premium_links_data');
    
    if (savedPerfumes) setPerfumes(JSON.parse(savedPerfumes));
    if (savedTranslations) setTranslations(JSON.parse(savedTranslations));
    if (savedLinks) setContactInfo(JSON.parse(savedLinks));

    const handleLang = (e: any) => setLang(e.detail);
    window.addEventListener('langChange', handleLang);
    return () => window.removeEventListener('langChange', handleLang);
  }, []);

  const t = (translations as any)[lang] || INITIAL_TRANSLATIONS[lang];

  const filteredPerfumes = perfumes.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout onSearch={setSearchQuery}>
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-luxury-dark">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=1200" 
            className="w-full h-full object-cover opacity-30"
            alt="Hero"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-luxury-dark"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 animate-slide-up">
          <span className="text-man-gold font-bold tracking-[1em] text-[10px] uppercase block mb-4">PREMIUM PARFUMES</span>
          <h1 className="text-5xl md:text-8xl font-serif text-white mb-8 tracking-tighter uppercase leading-none">
            {t.heroTitle}
          </h1>
          <p className="text-gray-400 text-sm md:text-lg font-light mb-12 tracking-widest uppercase max-w-2xl mx-auto">
            {t.heroSub}
          </p>
          <a href="#collection" className="inline-block bg-man-gold text-black px-12 py-5 font-black uppercase tracking-widest text-[10px] hover:bg-white transition-all transform hover:-translate-y-1">
            {t.explore}
          </a>
        </div>
      </section>

      <section id="collection" className="py-32 bg-luxury-dark">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-baseline mb-20 gap-8">
            <div className="max-w-xl">
              <span className="text-man-gold font-bold text-[10px] uppercase tracking-widest mb-2 block">{t.collection}</span>
              <h2 className="text-5xl font-serif text-white tracking-tighter uppercase">{t.boutiqueColl}</h2>
            </div>
          </div>

          {filteredPerfumes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
              {filteredPerfumes.map(p => <PerfumeCard key={p.id} perfume={p} contactInfo={contactInfo} />)}
            </div>
          ) : (
            <div className="py-32 text-center border border-white/5 bg-white/[0.02]">
              <div className="w-16 h-16 border border-man-gold/20 flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-search text-man-gold/40"></i>
              </div>
              <p className="text-gray-500 font-serif tracking-widest uppercase text-xs">
                {lang === 'uz' ? 'Hech narsa topilmadi' : 'Ничего не найдено'}
              </p>
            </div>
          )}
        </div>
      </section>

      <Suspense fallback={<div className="h-20" />}>
        <LaunchSection lang={lang} contactInfo={contactInfo} />
        <MessageForm lang={lang} contactInfo={contactInfo} />
        <AdminPanel />
      </Suspense>

      <TalkingAI lang={lang} />
    </Layout>
  );
};

export default App;
