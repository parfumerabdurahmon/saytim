
import React, { useState, useEffect } from 'react';
import { PERFUMES as INITIAL_PERFUMES, TRANSLATIONS as INITIAL_TRANSLATIONS, CONTACT_INFO as INITIAL_CONTACT } from '../constants';
import { ExtendedPerfume } from '../constants';

const ADMIN_PASSWORD = "admin123";

const AdminPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState<'products' | 'content' | 'links'>('products');
  
  const [perfumes, setPerfumes] = useState<ExtendedPerfume[]>([]);
  const [translations, setTranslations] = useState(INITIAL_TRANSLATIONS);
  const [contactInfo, setContactInfo] = useState(INITIAL_CONTACT);

  useEffect(() => {
    const savedPerfumes = localStorage.getItem('premium_perfumes_data');
    const savedTranslations = localStorage.getItem('premium_translations_data');
    const savedLinks = localStorage.getItem('premium_links_data');
    
    if (savedPerfumes) setPerfumes(JSON.parse(savedPerfumes));
    else setPerfumes(INITIAL_PERFUMES);

    if (savedTranslations) setTranslations(JSON.parse(savedTranslations));
    if (savedLinks) setContactInfo(JSON.parse(savedLinks));
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert("Parol noto'g'ri! / Неверный пароль!");
    }
  };

  const saveAll = () => {
    localStorage.setItem('premium_perfumes_data', JSON.stringify(perfumes));
    localStorage.setItem('premium_translations_data', JSON.stringify(translations));
    localStorage.setItem('premium_links_data', JSON.stringify(contactInfo));
    alert("Ma'lumotlar saqlandi! Sahifa yangilanadi. / Данные сохранены! Страница будет обновлена.");
    window.location.reload(); 
  };

  const addProduct = () => {
    const newProd: ExtendedPerfume = {
      id: Date.now().toString(),
      name: "Yangi Atir / Новый Парфюм",
      brand: "BREND",
      description: "Tavsif... / Описание...",
      image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=800",
      notes: [],
      category: "Woody"
    };
    setPerfumes([newProd, ...perfumes]);
  };

  const deleteProduct = (id: string) => {
    if(confirm("Haqiqatdan ham o'chirmoqchimisiz? / Вы уверены, что хотите удалить?")) {
      setPerfumes(perfumes.filter(p => p.id !== id));
    }
  };

  const updateProduct = (id: string, field: keyof ExtendedPerfume, value: any) => {
    setPerfumes(perfumes.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  if (!isOpen) return (
    <button 
      onClick={() => setIsOpen(true)} 
      className="fixed bottom-6 left-6 z-[100] w-12 h-12 bg-black/40 backdrop-blur-md border border-white/10 hover:border-man-gold text-white hover:text-man-gold rounded-full transition-all flex items-center justify-center opacity-30 hover:opacity-100 group shadow-2xl"
      aria-label="Admin settings"
    >
      <i className="fas fa-cog group-hover:rotate-90 transition-transform duration-500"></i>
    </button>
  );

  return (
    <div className="fixed inset-0 z-[200] bg-black/98 backdrop-blur-2xl flex items-center justify-center p-0 md:p-8 animate-fade-in">
      {!isAuthenticated ? (
        <form onSubmit={handleLogin} className="bg-luxury-slate p-10 border border-man-gold/20 max-w-sm w-full text-center shadow-2xl animate-scale-in">
          <div className="w-16 h-16 border border-man-gold flex items-center justify-center mx-auto mb-8">
            <i className="fas fa-shield-halved text-man-gold text-2xl"></i>
          </div>
          <h2 className="text-xl font-serif mb-8 tracking-widest uppercase">Elite Access</h2>
          <input 
            type="password" 
            placeholder="ACCESS KEY"
            autoFocus
            className="w-full bg-black border border-white/10 p-4 mb-6 outline-none focus:border-man-gold text-center tracking-[0.5em] text-white placeholder:text-gray-700"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="flex flex-col gap-3">
            <button type="submit" className="w-full bg-man-gold text-black py-4 font-black uppercase text-[10px] tracking-[0.3em] hover:bg-white transition-all">
              UNLOCK DASHBOARD
            </button>
            <button type="button" onClick={() => setIsOpen(false)} className="text-gray-500 text-[9px] uppercase tracking-widest hover:text-white py-2">
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-[#080808] w-full h-full md:max-h-[90vh] max-w-7xl flex flex-col border border-white/5 shadow-2xl overflow-hidden animate-slide-up">
          <header className="p-6 md:p-10 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 bg-black/40">
            <div className="flex flex-wrap justify-center gap-6 md:gap-10">
              {(['products', 'content', 'links'] as const).map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)} 
                  className={`text-[10px] font-black tracking-[0.4em] uppercase pb-2 border-b-2 transition-all ${activeTab === tab ? 'text-man-gold border-man-gold' : 'text-gray-600 border-transparent hover:text-gray-400'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="flex gap-4 w-full md:w-auto">
              <button onClick={saveAll} className="flex-1 md:flex-none bg-man-gold text-black px-10 py-4 font-black text-[10px] tracking-[0.3em] uppercase hover:bg-white transition-all">
                DEPLOY CHANGES
              </button>
              <button onClick={() => setIsOpen(false)} className="w-12 h-12 flex items-center justify-center border border-white/10 text-gray-500 hover:text-white transition-colors">
                <i className="fas fa-times"></i>
              </button>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-6 md:p-12">
            {activeTab === 'products' ? (
              <div className="space-y-10">
                <button onClick={addProduct} className="w-full border border-dashed border-white/10 py-10 text-gray-600 hover:text-man-gold hover:border-man-gold transition-all uppercase font-black text-[10px] tracking-[0.5em] bg-white/5">
                  + Add New Arsenal Item
                </button>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  {perfumes.map(p => (
                    <div key={p.id} className="bg-white/5 p-8 border border-white/5 space-y-6 relative group hover:border-man-gold/30 transition-colors">
                      <button 
                        onClick={() => deleteProduct(p.id)} 
                        className="absolute top-6 right-6 text-gray-700 hover:text-red-500 transition-colors"
                      >
                        <i className="fas fa-trash-can"></i>
                      </button>
                      <div className="flex flex-col md:flex-row gap-8">
                        <div className="w-full md:w-32 aspect-[3/4] bg-black border border-white/10 overflow-hidden">
                          <img src={p.image} className="w-full h-full object-cover grayscale" alt="" />
                        </div>
                        <div className="flex-1 space-y-4">
                          <div className="space-y-1">
                            <label className="text-[8px] text-gray-600 uppercase font-black tracking-widest">Brand</label>
                            <input 
                              className="w-full bg-transparent border-b border-white/10 text-man-gold uppercase text-xs font-black outline-none focus:border-man-gold py-1" 
                              value={p.brand} 
                              onChange={e => updateProduct(p.id, 'brand', e.target.value)}
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[8px] text-gray-600 uppercase font-black tracking-widest">Model Name</label>
                            <input 
                              className="w-full bg-transparent border-b border-white/10 text-white font-serif text-lg outline-none focus:border-man-gold py-1" 
                              value={p.name} 
                              onChange={e => updateProduct(p.id, 'name', e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-[8px] text-gray-600 uppercase font-black tracking-widest">Image URL</label>
                          <input 
                            className="w-full bg-black/40 border border-white/10 p-3 text-[10px] text-gray-400 outline-none focus:border-man-gold" 
                            value={p.image} 
                            onChange={e => updateProduct(p.id, 'image', e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] text-gray-600 uppercase font-black tracking-widest">Detailed Description</label>
                          <textarea 
                            className="w-full bg-black/40 border border-white/10 p-4 text-[11px] text-gray-400 h-28 outline-none focus:border-man-gold resize-none"
                            value={p.description}
                            onChange={e => updateProduct(p.id, 'description', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : activeTab === 'content' ? (
              <div className="space-y-16">
                {(['uz', 'ru'] as const).map(langCode => (
                  <div key={langCode} className="space-y-8">
                    <div className="flex items-center gap-4">
                      <div className="h-[1px] flex-1 bg-white/5"></div>
                      <h3 className="text-man-gold font-black text-[10px] tracking-[0.5em] uppercase">{langCode === 'uz' ? 'O\'zbek Tili' : 'Русский Язык'}</h3>
                      <div className="h-[1px] flex-1 bg-white/5"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {Object.keys((translations as any)[langCode]).map(key => (
                        <div key={key} className="space-y-2 bg-white/2 pb-4">
                          <label className="text-[8px] text-gray-600 uppercase font-black tracking-tighter">{key}</label>
                          <textarea 
                            className="w-full bg-black/60 border border-white/5 p-4 text-[11px] text-white outline-none focus:border-man-gold h-24 resize-none leading-relaxed"
                            value={(translations as any)[langCode][key]}
                            onChange={e => {
                              const next = JSON.parse(JSON.stringify(translations));
                              next[langCode][key] = e.target.value;
                              setTranslations(next);
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="max-w-xl mx-auto space-y-12 py-10">
                <div className="text-center space-y-4 mb-16">
                   <div className="w-12 h-12 border border-man-gold/30 rounded-full flex items-center justify-center mx-auto mb-6">
                      <i className="fas fa-link text-man-gold/50"></i>
                   </div>
                   <h3 className="text-man-gold font-black text-xs tracking-[0.4em] uppercase">Communication Grid</h3>
                   <p className="text-gray-600 text-[10px] uppercase tracking-widest">Update your global contact destinations</p>
                </div>
                
                <div className="space-y-10">
                   {[
                     { label: 'Primary Phone', key: 'phone', icon: 'fa-phone', placeholder: '+998 ...' },
                     { label: 'Instagram Channel', key: 'instagram', icon: 'fa-instagram', placeholder: 'https://instagram.com/...' },
                     { label: 'Telegram Concierge', key: 'telegram', icon: 'fa-paper-plane', placeholder: 'https://t.me/...' }
                   ].map(field => (
                     <div key={field.key} className="space-y-3">
                        <div className="flex items-center gap-3">
                           <i className={`fas ${field.icon} text-man-gold text-[10px]`}></i>
                           <label className="text-[9px] text-gray-500 uppercase font-black tracking-widest">{field.label}</label>
                        </div>
                        <input 
                          className="w-full bg-black border border-white/10 p-5 text-white text-xs outline-none focus:border-man-gold transition-all placeholder:text-gray-800"
                          value={(contactInfo as any)[field.key]}
                          onChange={e => setContactInfo({...contactInfo, [field.key]: e.target.value})}
                          placeholder={field.placeholder}
                        />
                     </div>
                   ))}
                </div>
              </div>
            )}
          </main>
          
          <footer className="p-6 border-t border-white/5 bg-black/60 text-center">
            <p className="text-[8px] text-gray-700 uppercase tracking-[1em] font-black">Elite System Dashboard v2.1</p>
          </footer>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
