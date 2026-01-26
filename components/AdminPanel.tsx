
import React, { useState, useEffect } from 'react';
import { dataService } from '../services/dataService';
import { ExtendedPerfume } from '../constants';

const ADMIN_PASSWORD = "admin123";

const AdminPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState<'products' | 'content' | 'links'>('products');
  const [isSaving, setIsSaving] = useState(false);
  
  const [perfumes, setPerfumes] = useState<ExtendedPerfume[]>([]);
  const [translations, setTranslations] = useState<any>(null);
  const [contactInfo, setContactInfo] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      const data = await dataService.getSiteData();
      setPerfumes(data.perfumes);
      setTranslations(data.translations);
      setContactInfo(data.contacts);
    };
    if (isAuthenticated) load();
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert("Parol noto'g'ri! / Неверный пароль!");
    }
  };

  const saveAll = async () => {
    setIsSaving(true);
    try {
      await dataService.updateSiteData({
        perfumes,
        translations,
        contacts: contactInfo
      });
      alert("Google Sheet muvaffaqiyatli yangilandi! / Google Sheet успешно обновлен!");
      // Force reload to sync all components
      window.location.reload(); 
    } catch (error) {
      console.error(error);
      alert("Xatolik yuz berdi! / Произошла ошибка!");
    } finally {
      setIsSaving(false);
    }
  };

  const addProduct = () => {
    const newProd: ExtendedPerfume = {
      id: Date.now().toString(),
      name: "Yangi Atir / Новый Парфюм",
      brand: "BREND",
      description: "Tavsif... / Описание...",
      image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=800",
      notes: [],
      category: 'Woody'
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

  const handleImageUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024 * 3) {
        alert("Rasm juda katta (max 3MB). / Файл слишком большой (макс 3МБ).");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        updateProduct(id, 'image', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return (
    <button 
      onClick={() => setIsOpen(true)} 
      className="fixed bottom-6 left-6 z-[100] w-12 h-12 bg-black/40 backdrop-blur-md border border-white/10 hover:border-man-gold text-white hover:text-man-gold rounded-full transition-all flex items-center justify-center opacity-30 hover:opacity-100 group shadow-2xl"
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
          <h2 className="text-xl font-serif mb-8 tracking-widest uppercase text-white">Elite Access</h2>
          <input 
            type="password" 
            placeholder="ACCESS KEY"
            className="w-full bg-black border border-white/10 p-4 mb-6 outline-none focus:border-man-gold text-center tracking-[0.5em] text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="w-full bg-man-gold text-black py-4 font-black uppercase text-[10px] tracking-[0.3em] hover:bg-white transition-all">
            UNLOCK DASHBOARD
          </button>
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
              <button 
                onClick={saveAll} 
                disabled={isSaving}
                className="flex-1 md:flex-none bg-man-gold text-black px-10 py-4 font-black text-[10px] tracking-[0.3em] uppercase hover:bg-white transition-all disabled:opacity-50"
              >
                {isSaving ? 'SYNCING SHEET...' : 'DEPLOY TO GOOGLE SHEET'}
              </button>
              <button onClick={() => setIsOpen(false)} className="w-12 h-12 flex items-center justify-center border border-white/10 text-gray-500 hover:text-white transition-colors">
                <i className="fas fa-times"></i>
              </button>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-6 md:p-12">
            {translations && contactInfo && activeTab === 'products' ? (
              <div className="space-y-10">
                <button onClick={addProduct} className="w-full border border-dashed border-white/10 py-10 text-gray-600 hover:text-man-gold hover:border-man-gold transition-all uppercase font-black text-[10px] tracking-[0.5em] bg-white/5">
                  + Add New Arsenal Item
                </button>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  {perfumes.map(p => (
                    <div key={p.id} className="bg-white/5 p-8 border border-white/5 space-y-6 relative group hover:border-man-gold/30 transition-colors">
                      <button onClick={() => deleteProduct(p.id)} className="absolute top-6 right-6 text-gray-700 hover:text-red-500"><i className="fas fa-trash-can"></i></button>
                      <div className="flex flex-col md:flex-row gap-8">
                        <div className="w-full md:w-40 aspect-[3/4] bg-black border border-white/10 overflow-hidden relative group/img">
                          <img src={p.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt="" />
                          <label className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                            <i className="fas fa-camera text-white text-xl"></i>
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(p.id, e)} />
                          </label>
                        </div>
                        <div className="flex-1 space-y-4">
                          <input className="w-full bg-transparent border-b border-white/10 text-man-gold uppercase text-xs font-black outline-none py-1" value={p.brand} onChange={e => updateProduct(p.id, 'brand', e.target.value)} placeholder="Brand" />
                          <input className="w-full bg-transparent border-b border-white/10 text-white font-serif text-lg outline-none py-1" value={p.name} onChange={e => updateProduct(p.id, 'name', e.target.value)} placeholder="Name" />
                          <select className="w-full bg-black border border-white/10 p-2 text-[10px] text-white outline-none focus:border-man-gold" value={p.category} onChange={e => updateProduct(p.id, 'category', e.target.value as any)}>
                            {['Woody', 'Floral', 'Fresh', 'Oriental', 'Citrus'].map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                      </div>
                      <textarea className="w-full bg-black/40 border border-white/10 p-4 text-[11px] text-gray-400 h-28 resize-none outline-none focus:border-man-gold" value={p.description} onChange={e => updateProduct(p.id, 'description', e.target.value)} />
                    </div>
                  ))}
                </div>
              </div>
            ) : activeTab === 'content' && translations ? (
              <div className="space-y-16">
                {['uz', 'ru'].map(langCode => (
                  <div key={langCode} className="space-y-8">
                    <h3 className="text-man-gold font-black text-[10px] tracking-[0.5em] uppercase text-center border-b border-white/5 pb-4">{langCode} Edition</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {Object.keys(translations[langCode]).map(key => (
                        <div key={key} className="space-y-2">
                          <label className="text-[8px] text-gray-600 uppercase font-black">{key}</label>
                          <textarea className="w-full bg-black/60 border border-white/5 p-4 text-[11px] text-white h-24 resize-none outline-none focus:border-man-gold" value={translations[langCode][key]} onChange={e => {
                            const next = JSON.parse(JSON.stringify(translations));
                            next[langCode][key] = e.target.value;
                            setTranslations(next);
                          }} />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : activeTab === 'links' && contactInfo ? (
              <div className="max-w-xl mx-auto space-y-10 py-10">
                <div className="text-center mb-10">
                   <h3 className="text-man-gold font-black text-xs tracking-[0.4em] uppercase">Global Connections</h3>
                </div>
                {['phone', 'instagram', 'telegram'].map(key => (
                  <div key={key} className="space-y-3">
                    <label className="text-[9px] text-gray-500 uppercase font-black tracking-widest">{key}</label>
                    <input className="w-full bg-black border border-white/10 p-5 text-white text-xs outline-none focus:border-man-gold transition-colors" value={contactInfo[key]} onChange={e => setContactInfo({...contactInfo, [key]: e.target.value})} />
                  </div>
                ))}
              </div>
            ) : <div className="text-center text-gray-600 uppercase text-[10px] tracking-widest py-20 flex flex-col items-center gap-4">
                  <div className="w-8 h-8 border border-man-gold/40 border-t-man-gold rounded-full animate-spin"></div>
                  Initializing Sheet Interface...
                </div>}
          </main>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
