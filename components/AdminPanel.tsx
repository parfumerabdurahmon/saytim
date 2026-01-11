
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
      alert("Xato parol!");
    }
  };

  const saveAll = () => {
    localStorage.setItem('premium_perfumes_data', JSON.stringify(perfumes));
    localStorage.setItem('premium_translations_data', JSON.stringify(translations));
    localStorage.setItem('premium_links_data', JSON.stringify(contactInfo));
    window.location.reload(); 
  };

  const addProduct = () => {
    const newProd: ExtendedPerfume = {
      id: Date.now().toString(),
      name: "Yangi Atir",
      brand: "BREND",
      description: "Tavsif...",
      image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=800",
      notes: [],
      category: "Woody"
    };
    setPerfumes([newProd, ...perfumes]);
  };

  const deleteProduct = (id: string) => {
    setPerfumes(perfumes.filter(p => p.id !== id));
  };

  const updateProduct = (id: string, field: keyof ExtendedPerfume, value: any) => {
    setPerfumes(perfumes.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  if (!isOpen) return (
    <button 
      onClick={() => setIsOpen(true)} 
      className="fixed bottom-6 left-6 z-[100] w-10 h-10 bg-white/5 hover:bg-man-gold text-white hover:text-black rounded-full transition-all flex items-center justify-center opacity-20 hover:opacity-100"
    >
      <i className="fas fa-cog"></i>
    </button>
  );

  return (
    <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4">
      {!isAuthenticated ? (
        <form onSubmit={handleLogin} className="bg-luxury-slate p-12 border border-man-gold/20 max-w-md w-full text-center">
          <i className="fas fa-lock text-man-gold text-4xl mb-6"></i>
          <h2 className="text-2xl font-serif mb-8 tracking-widest uppercase">Admin Panel</h2>
          <input 
            type="password" 
            placeholder="Parol"
            autoFocus
            className="w-full bg-black border border-white/10 p-4 mb-6 outline-none focus:border-man-gold text-center tracking-[0.5em]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="flex gap-4">
            <button type="submit" className="flex-1 bg-man-gold text-black py-4 font-black uppercase text-xs tracking-widest">KIRISH</button>
            <button type="button" onClick={() => setIsOpen(false)} className="px-6 border border-white/10 text-white/50">X</button>
          </div>
        </form>
      ) : (
        <div className="bg-luxury-slate w-full h-full max-w-6xl flex flex-col border border-white/5 shadow-2xl">
          <header className="p-8 border-b border-white/5 flex justify-between items-center bg-black/20">
            <div className="flex gap-8">
              <button onClick={() => setActiveTab('products')} className={`text-[10px] font-black tracking-widest uppercase pb-2 border-b-2 transition-all ${activeTab === 'products' ? 'text-man-gold border-man-gold' : 'text-gray-500 border-transparent'}`}>MAHSULOTLAR</button>
              <button onClick={() => setActiveTab('content')} className={`text-[10px] font-black tracking-widest uppercase pb-2 border-b-2 transition-all ${activeTab === 'content' ? 'text-man-gold border-man-gold' : 'text-gray-500 border-transparent'}`}>MATNLAR</button>
              <button onClick={() => setActiveTab('links')} className={`text-[10px] font-black tracking-widest uppercase pb-2 border-b-2 transition-all ${activeTab === 'links' ? 'text-man-gold border-man-gold' : 'text-gray-500 border-transparent'}`}>LINKLAR</button>
            </div>
            <div className="flex gap-4">
              <button onClick={saveAll} className="bg-man-gold text-black px-8 py-3 font-black text-[10px] tracking-widest uppercase hover:bg-white transition-colors">SAQLASH</button>
              <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white"><i className="fas fa-times text-xl"></i></button>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-8">
            {activeTab === 'products' ? (
              <div className="space-y-8">
                <button onClick={addProduct} className="w-full border-2 border-dashed border-white/10 py-8 text-gray-500 hover:text-man-gold hover:border-man-gold transition-all uppercase font-bold text-xs tracking-widest">
                  + Yangi Mahsulot Qo'shish
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {perfumes.map(p => (
                    <div key={p.id} className="bg-black/40 p-6 border border-white/5 space-y-4 relative group">
                      <button onClick={() => deleteProduct(p.id)} className="absolute top-4 right-4 text-gray-600 hover:text-red-500 transition-colors"><i className="fas fa-trash"></i></button>
                      <div className="flex gap-4">
                        <img src={p.image} className="w-24 h-32 object-cover border border-white/10" alt="" />
                        <div className="flex-1 space-y-2">
                          <input 
                            className="w-full bg-transparent border-b border-white/5 text-man-gold uppercase text-[10px] font-bold outline-none focus:border-man-gold" 
                            value={p.brand} 
                            onChange={e => updateProduct(p.id, 'brand', e.target.value)}
                            placeholder="BRAND"
                          />
                          <input 
                            className="w-full bg-transparent border-b border-white/5 text-white font-serif text-xl outline-none focus:border-man-gold" 
                            value={p.name} 
                            onChange={e => updateProduct(p.id, 'name', e.target.value)}
                            placeholder="Name"
                          />
                        </div>
                      </div>
                      <input 
                        className="w-full bg-transparent border-b border-white/5 text-[10px] text-gray-500 outline-none focus:border-man-gold" 
                        value={p.image} 
                        onChange={e => updateProduct(p.id, 'image', e.target.value)}
                        placeholder="Image URL"
                      />
                      <textarea 
                        className="w-full bg-transparent border border-white/5 p-3 text-xs text-gray-400 h-24 outline-none focus:border-man-gold"
                        value={p.description}
                        onChange={e => updateProduct(p.id, 'description', e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : activeTab === 'content' ? (
              <div className="space-y-12">
                {['uz', 'ru'].map(lang => (
                  <div key={lang} className="space-y-6">
                    <h3 className="text-man-gold font-black text-xs tracking-widest uppercase border-b border-man-gold/20 pb-2">{lang === 'uz' ? 'O\'zbekcha' : 'Русский'}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {Object.keys((translations as any)[lang]).map(key => (
                        <div key={key} className="space-y-2">
                          <label className="text-[9px] text-gray-600 uppercase font-black">{key}</label>
                          <textarea 
                            className="w-full bg-black/40 border border-white/5 p-3 text-xs text-white outline-none focus:border-man-gold h-20"
                            value={(translations as any)[lang][key]}
                            onChange={e => {
                              const next = { ...translations };
                              (next as any)[lang][key] = e.target.value;
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
              <div className="max-w-2xl mx-auto space-y-10 py-10">
                <div className="space-y-6 bg-black/40 p-10 border border-white/5">
                   <h3 className="text-man-gold font-black text-xs tracking-widest uppercase mb-8">Aloqa Linklari</h3>
                   
                   <div className="space-y-2">
                      <label className="text-[9px] text-gray-500 uppercase font-bold tracking-widest">Telefon Raqam</label>
                      <input 
                        className="w-full bg-black border border-white/10 p-4 text-white outline-none focus:border-man-gold"
                        value={contactInfo.phone}
                        onChange={e => setContactInfo({...contactInfo, phone: e.target.value})}
                        placeholder="+998 99 690 95 75"
                      />
                   </div>

                   <div className="space-y-2">
                      <label className="text-[9px] text-gray-500 uppercase font-bold tracking-widest">Instagram URL</label>
                      <input 
                        className="w-full bg-black border border-white/10 p-4 text-white outline-none focus:border-man-gold"
                        value={contactInfo.instagram}
                        onChange={e => setContactInfo({...contactInfo, instagram: e.target.value})}
                        placeholder="https://instagram.com/..."
                      />
                   </div>

                   <div className="space-y-2">
                      <label className="text-[9px] text-gray-500 uppercase font-bold tracking-widest">Telegram URL</label>
                      <input 
                        className="w-full bg-black border border-white/10 p-4 text-white outline-none focus:border-man-gold"
                        value={contactInfo.telegram}
                        onChange={e => setContactInfo({...contactInfo, telegram: e.target.value})}
                        placeholder="https://t.me/..."
                      />
                   </div>
                </div>
              </div>
            )}
          </main>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
