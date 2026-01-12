
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { PERFUMES } from '../constants';

interface TalkingAIProps {
  lang: 'uz' | 'ru';
}

const TalkingAI: React.FC<TalkingAIProps> = ({ lang }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const t = {
    uz: {
      title: "Scent Strategist",
      subtitle: "AI Ekspert",
      placeholder: "Xarakteringizni ayting...",
      send: "YUBORISH",
      greeting: "Assalomu alaykum. Men sizning shaxsiy parfyumeriya bo'yicha maslahatdoshingizman. Qanday hid sizga mos kelishini aniqlaymiz?",
      error: "Kechirasiz, aloqada xatolik yuz berdi."
    },
    ru: {
      title: "Scent Strategist",
      subtitle: "AI Эксперт",
      placeholder: "Опишите ваш характер...",
      send: "ОТПРАВИТЬ",
      greeting: "Здравствуйте. Я ваш персональный консультант по парфюмерии. Давайте подберем аромат, который подчеркнет вашу индивидуальность.",
      error: "Извините, произошла ошибка связи."
    }
  }[lang];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleOpenChat = () => {
    setIsOpen(true);
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    const systemInstruction = `You are a world-class luxury perfume advisor for "Premium Parfumes". 
    Your tone is sophisticated, masculine, and helpful. 
    Current Arsenal (Perfumes you can recommend): ${PERFUMES.map(p => `${p.brand} ${p.name}: ${p.description}`).join('; ')}.
    Answer in ${lang === 'uz' ? 'Uzbek' : 'Russian'}. 
    Focus on matching the user's mood, occasion, or preference with one of the perfumes from the Arsenal.`;

    try {
      // Use process.env.API_KEY directly as required.
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: { systemInstruction }
      });

      const result = await chat.sendMessageStream({ message: userMsg });
      let fullText = '';
      
      setMessages(prev => [...prev, { role: 'model', text: '' }]);

      for await (const chunk of result) {
        const text = chunk.text;
        fullText += text;
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1].text = fullText;
          return updated;
        });
      }
    } catch (error: any) {
      console.error("AI Communication Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: t.error }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <button 
        onClick={handleOpenChat}
        className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-[9999] group flex items-center gap-4 bg-man-gold p-1 shadow-[0_10px_40px_rgba(197,160,89,0.4)] rounded-full transition-all hover:scale-105 active:scale-95"
      >
        <div className="w-14 h-14 bg-black rounded-full flex items-center justify-center border border-man-gold/20">
          <i className="fas fa-robot text-man-gold text-xl"></i>
        </div>
        <span className="hidden md:block pr-6 text-[10px] font-black uppercase tracking-widest text-black">{t.title}</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[10000] bg-black/80 backdrop-blur-md flex items-end md:items-center justify-center p-0 md:p-4 animate-fade-in">
          <div className="w-full max-w-lg bg-[#080808] border-t md:border border-white/10 h-[90vh] md:h-[650px] flex flex-col shadow-[0_0_100px_rgba(0,0,0,1)] animate-slide-up overflow-hidden">
            <header className="p-6 border-b border-white/5 flex justify-between items-center bg-black">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-man-gold rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(197,160,89,0.3)]">
                  <i className="fas fa-crown text-black text-sm"></i>
                </div>
                <div>
                  <h3 className="text-man-gold font-serif text-lg tracking-widest uppercase leading-none mb-1">{t.title}</h3>
                  <p className="text-[8px] text-gray-500 font-bold uppercase tracking-[0.3em]">{t.subtitle}</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-500 hover:text-white transition-colors">
                <i className="fas fa-times"></i>
              </button>
            </header>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth bg-gradient-to-b from-black to-[#080808]">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-man-gold flex-shrink-0 flex items-center justify-center">
                  <i className="fas fa-crown text-black text-[10px]"></i>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none text-xs text-gray-300 leading-relaxed max-w-[85%] border border-white/5">
                  {t.greeting}
                </div>
              </div>

              {messages.map((m, i) => (
                <div key={i} className={`flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${m.role === 'user' ? 'bg-white/10' : 'bg-man-gold'}`}>
                    <i className={`fas ${m.role === 'user' ? 'fa-user' : 'fa-crown'} ${m.role === 'user' ? 'text-white' : 'text-black'} text-[10px]`}></i>
                  </div>
                  <div className={`p-4 rounded-2xl text-xs leading-relaxed max-w-[85%] border ${
                    m.role === 'user' 
                      ? 'bg-man-gold/10 border-man-gold/20 text-white rounded-tr-none' 
                      : 'bg-white/5 border-white/5 text-gray-300 rounded-tl-none'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-man-gold/20 flex-shrink-0 flex items-center justify-center animate-pulse">
                    <i className="fas fa-crown text-man-gold/40 text-[10px]"></i>
                  </div>
                  <div className="bg-white/5 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-1">
                    <div className="w-1 h-1 bg-man-gold rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-1 h-1 bg-man-gold rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-1 h-1 bg-man-gold rounded-full animate-bounce"></div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 bg-black border-t border-white/5 pb-10 md:pb-6">
              <div className="relative flex items-center gap-4">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={t.placeholder}
                  className="flex-1 bg-white/5 border border-white/10 p-4 rounded-full text-xs text-white outline-none focus:border-man-gold transition-colors placeholder:text-gray-700"
                />
                <button 
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="w-12 h-12 bg-man-gold rounded-full flex items-center justify-center text-black hover:bg-white transition-colors disabled:opacity-50 shadow-[0_0_20px_rgba(197,160,89,0.3)]"
                >
                  <i className="fas fa-paper-plane"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TalkingAI;
