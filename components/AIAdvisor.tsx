
import React, { useState, useEffect } from 'react';
import { getPerfumeRecommendation } from '../services/geminiService';
import { TRANSLATIONS } from '../constants';

interface AIAdvisorProps {
  lang?: 'uz' | 'ru';
}

const AIAdvisor: React.FC<AIAdvisorProps> = ({ lang = 'uz' }) => {
  const [currentLang, setCurrentLang] = useState(lang);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<string | null>(null);

  useEffect(() => {
    const handleLang = (e: any) => setCurrentLang(e.detail);
    window.addEventListener('langChange', handleLang);
    return () => window.removeEventListener('langChange', handleLang);
  }, []);

  const t = TRANSLATIONS[currentLang];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    const result = await getPerfumeRecommendation(input + ` (Please respond in ${currentLang === 'uz' ? 'Uzbek' : 'Russian'})`);
    setRecommendation(result || "Error.");
    setLoading(false);
  };

  return (
    <section id="ai-advisor" className="py-24 bg-[#f3f0eb] dark:bg-[#0f0f0f] scroll-mt-20 transition-colors duration-500">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block text-amber-700 dark:text-amber-500 font-bold tracking-widest text-xs uppercase mb-2">Exclusive AI Experience</span>
          <h2 className="text-4xl font-serif mb-4 dark:text-white">{t.aiTitle}</h2>
          <p className="text-gray-600 dark:text-gray-400 italic max-w-2xl mx-auto">{t.aiDesc}</p>
        </div>

        <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] p-8 md:p-12 border border-white dark:border-gray-800">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t.aiPlaceholder}
                className="w-full h-40 p-6 bg-gray-50 dark:bg-luxury-dark border border-gray-100 dark:border-gray-800 rounded-2xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 focus:bg-white dark:focus:bg-[#1a1a1a] outline-none transition-all resize-none text-lg font-light dark:text-gray-200"
                required
              />
              <div className="absolute bottom-4 right-4 text-gray-300 dark:text-gray-700 pointer-events-none">
                <i className="fas fa-magic text-xl"></i>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1a1a1a] dark:bg-white text-white dark:text-black py-5 rounded-2xl font-bold uppercase tracking-[0.2em] text-xs hover:bg-amber-900 dark:hover:bg-amber-100 transition-all disabled:opacity-50 transform active:scale-[0.98] shadow-xl"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin mr-3"></div>
                  {t.analyzing}
                </span>
              ) : t.discoverBtn}
            </button>
          </form>

          {recommendation && (
            <div className="mt-12 p-8 bg-amber-50/50 dark:bg-amber-950/20 rounded-2xl border border-amber-100 dark:border-amber-900/30 animate-fade-in relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <i className="fas fa-quote-right text-6xl text-amber-900 dark:text-amber-500"></i>
              </div>
              <h4 className="font-serif text-2xl text-amber-900 dark:text-amber-500 mb-6 flex items-center">
                <span className="w-8 h-px bg-amber-300 dark:bg-amber-700 mr-4"></span>
                {t.recTitle}
              </h4>
              <div className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-line prose prose-amber dark:prose-invert max-w-none text-lg font-light italic">
                {recommendation}
              </div>
              <div className="mt-8 pt-8 border-t border-amber-200/50 dark:border-amber-800/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-amber-800 dark:text-amber-400 font-medium">{t.tgAction}</p>
                <a 
                  href={`https://t.me/PremiumParfumes?text=${encodeURIComponent("Tavsiya qilingan atir haqida ma'lumot olmoqchiman:\n\n" + recommendation)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-[#0088cc] text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:brightness-110 transition-all flex items-center"
                >
                  <i className="fab fa-telegram-plane mr-2 text-base"></i>
                  Send to Telegram
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AIAdvisor;