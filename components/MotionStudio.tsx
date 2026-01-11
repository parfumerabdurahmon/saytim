
import React, { useState } from 'react';
import { generateVeoVideo } from '../services/geminiService';

const MotionStudio: React.FC<{ lang: 'uz' | 'ru' }> = ({ lang }) => {
  const [prompt, setPrompt] = useState("");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');

  const handleAnimate = async () => {
    setLoading(true);
    try {
      const url = await generateVeoVideo(prompt, undefined, aspectRatio);
      setVideoUrl(url);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  return (
    <section className="py-24 bg-white dark:bg-luxury-dark border-y border-gray-100 dark:border-white/5">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-amber-600 font-bold text-[10px] tracking-[0.4em] uppercase">Cinematic Experience</span>
          <h2 className="text-5xl font-serif mt-4 dark:text-white">Motion Studio by Veo</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-6">
            <div className="p-8 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/10">
              <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-4">Video Prompt</label>
              <textarea 
                className="w-full h-32 bg-transparent outline-none text-xl font-light italic dark:text-white"
                placeholder="e.g. A slow motion golden liquid swirling around a crystal perfume bottle..."
                onChange={(e) => setPrompt(e.target.value)}
              />
              <div className="mt-6 flex items-center justify-between">
                <div className="flex gap-2">
                  <button onClick={() => setAspectRatio('16:9')} className={`px-4 py-2 rounded-lg text-[10px] font-bold ${aspectRatio === '16:9' ? 'bg-amber-600 text-white' : 'bg-gray-200 dark:bg-white/10 dark:text-gray-400'}`}>16:9</button>
                  <button onClick={() => setAspectRatio('9:16')} className={`px-4 py-2 rounded-lg text-[10px] font-bold ${aspectRatio === '9:16' ? 'bg-amber-600 text-white' : 'bg-gray-200 dark:bg-white/10 dark:text-gray-400'}`}>9:16</button>
                </div>
                <button 
                  onClick={handleAnimate} 
                  disabled={loading || !prompt}
                  className="bg-black dark:bg-white text-white dark:text-black px-8 py-3 rounded-full font-bold uppercase tracking-widest text-[10px] hover:scale-105 transition-transform"
                >
                  {loading ? "Generating..." : "Generate Video"}
                </button>
              </div>
            </div>
          </div>

          <div className="aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl relative flex items-center justify-center">
            {videoUrl ? (
              <video src={videoUrl} controls autoPlay loop className="w-full h-full object-cover" />
            ) : (
              <div className="text-center p-12">
                <i className="fas fa-film text-4xl text-amber-500 mb-4 opacity-50"></i>
                <p className="text-gray-500 font-serif italic">The Veo engine will render your cinematic vision here.</p>
              </div>
            )}
            {loading && (
              <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-center p-8">
                <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mb-6"></div>
                <p className="text-amber-500 font-medium animate-pulse">Veo is creating your cinema... This takes a moment.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MotionStudio;
