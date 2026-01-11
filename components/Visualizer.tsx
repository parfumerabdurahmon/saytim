
import React, { useState, useRef } from 'react';
import { generateProImage, editImage, fileToBtnBase64 } from '../services/geminiService';

const Visualizer: React.FC<{ lang: 'uz' | 'ru' }> = ({ lang }) => {
  const [prompt, setPrompt] = useState("");
  const [editPrompt, setEditPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [imageSize, setImageSize] = useState("1K");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = {
    uz: { title: "Vizual Masterstudiya", gen: "Yaratish", edit: "Tahrirlash", upload: "Rasm yuklash", size: "O'lcham", ratio: "Nisbat" },
    ru: { title: "Визуальная Студия", gen: "Создать", edit: "Изменить", upload: "Загрузить", size: "Размер", ratio: "Соотношение" }
  }[lang];

  const handleGenerate = async () => {
    setLoading(true);
    const url = await generateProImage(prompt, aspectRatio, imageSize);
    setImageUrl(url);
    setLoading(false);
  };

  const handleEdit = async () => {
    if (!imageUrl || !editPrompt) return;
    setLoading(true);
    const base64 = imageUrl.split(',')[1];
    const newUrl = await editImage(base64, editPrompt);
    if (newUrl) setImageUrl(newUrl);
    setLoading(false);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await fileToBtnBase64(file);
      setImageUrl(`data:image/png;base64,${base64}`);
    }
  };

  return (
    <section className="py-24 bg-[#050505] text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="flex-1 space-y-8">
            <h2 className="text-5xl font-serif text-amber-500">{t.title}</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">{t.ratio}</label>
                <select 
                  value={aspectRatio} 
                  onChange={(e) => setAspectRatio(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 p-3 rounded-lg outline-none focus:border-amber-500 transition-colors"
                >
                  {["1:1", "16:9", "9:16", "3:4", "4:3"].map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">{t.size}</label>
                <select 
                  value={imageSize} 
                  onChange={(e) => setImageSize(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 p-3 rounded-lg outline-none focus:border-amber-500 transition-colors"
                >
                  {["1K", "2K", "4K"].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <textarea 
              placeholder={prompt || "Describe your vision..."}
              className="w-full h-32 bg-white/5 border border-white/10 p-4 rounded-xl resize-none outline-none focus:border-amber-500 transition-colors text-lg font-light"
              onChange={(e) => setPrompt(e.target.value)}
            />

            <div className="flex gap-4">
              <button onClick={handleGenerate} disabled={loading} className="flex-1 bg-amber-600 hover:bg-amber-500 py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-all">
                {loading ? "..." : t.gen}
              </button>
              <button onClick={() => fileInputRef.current?.click()} className="px-6 border border-white/20 rounded-xl hover:bg-white/5 transition-all">
                <i className="fas fa-upload"></i>
              </button>
              <input type="file" ref={fileInputRef} hidden onChange={handleUpload} accept="image/*" />
            </div>

            {imageUrl && (
              <div className="pt-8 border-t border-white/10 space-y-4">
                <p className="text-[10px] uppercase tracking-widest text-gray-500">Edit Selected Image</p>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="e.g. Add a golden glow..." 
                    className="flex-1 bg-white/5 border border-white/10 p-3 rounded-lg outline-none focus:border-amber-500"
                    onChange={(e) => setEditPrompt(e.target.value)}
                  />
                  <button onClick={handleEdit} className="bg-white text-black px-6 py-3 rounded-lg font-bold text-xs uppercase hover:bg-amber-500 transition-all">
                    {t.edit}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="relative aspect-square bg-[#111] rounded-3xl overflow-hidden border border-white/5 shadow-2xl flex items-center justify-center">
              {imageUrl ? (
                <img src={imageUrl} className="w-full h-full object-cover animate-fade-in" />
              ) : (
                <div className="text-center opacity-20">
                  <i className="fas fa-palette text-6xl mb-4"></i>
                  <p className="font-serif italic">Your masterpiece will appear here</p>
                </div>
              )}
              {loading && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                  <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Visualizer;
