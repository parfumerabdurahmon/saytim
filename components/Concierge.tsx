
import React, { useState } from 'react';
import { getGroundedChatResponse } from '../services/geminiService';

const Concierge: React.FC<{ lang: 'uz' | 'ru' }> = ({ lang }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string, sources?: any[]}[]>([
    { role: 'bot', text: lang === 'uz' ? "Assalomu alaykum! Men sizning shaxsiy parfyum konsyerjingizman." : "Здравствуйте! Я ваш персональный парфюмерный консьерж." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput("");
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const { text, grounding } = await getGroundedChatResponse(userMsg);
      setMessages(prev => [...prev, { role: 'bot', text, sources: grounding }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'bot', text: "Error connection..." }]);
    }
    setLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {!isOpen ? (
        <button onClick={() => setIsOpen(true)} className="bg-amber-600 text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform">
          <i className="fas fa-comment-dots text-2xl"></i>
        </button>
      ) : (
        <div className="bg-white dark:bg-[#1a1a1a] w-80 md:w-96 h-[500px] rounded-3xl shadow-2xl border border-gray-100 dark:border-white/10 flex flex-col animate-scale-in origin-bottom-right overflow-hidden">
          <div className="bg-amber-600 p-4 flex justify-between items-center text-white">
            <span className="font-serif font-bold">Concierge AI</span>
            <button onClick={() => setIsOpen(false)}><i className="fas fa-times"></i></button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${m.role === 'user' ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-950 dark:text-amber-100' : 'bg-gray-100 dark:bg-white/5 dark:text-white'}`}>
                  {m.text}
                  {m.sources && m.sources.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-black/5 dark:border-white/5">
                      <p className="text-[9px] uppercase font-bold opacity-50 mb-1">Sources:</p>
                      {m.sources.map((src, idx) => (
                        <div key={idx} className="mb-1">
                          {src.web && <a href={src.web.uri} target="_blank" className="text-[10px] text-blue-500 block underline truncate">{src.web.title}</a>}
                          {src.maps && <a href={src.maps.uri} target="_blank" className="text-[10px] text-green-600 block underline truncate">{src.maps.title}</a>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && <div className="text-center animate-pulse text-amber-600 text-xs">Thinking...</div>}
          </div>

          <div className="p-4 border-t border-gray-100 dark:border-white/10 flex gap-2">
            <input 
              value={input} 
              onChange={e => setInput(e.target.value)} 
              onKeyPress={e => e.key === 'Enter' && handleSend()}
              className="flex-1 bg-gray-50 dark:bg-white/5 border-none outline-none rounded-full px-4 text-sm dark:text-white"
              placeholder="Ask me anything..."
            />
            <button onClick={handleSend} className="text-amber-600 px-2"><i className="fas fa-paper-plane"></i></button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Concierge;
