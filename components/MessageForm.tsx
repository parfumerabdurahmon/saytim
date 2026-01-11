
import React, { useState } from 'react';

const BOT_TOKEN = "7628257957:AAEp9VuIg8lsGUhHDAET2q6TCR_fyOJgc-Y";
const CHANNEL_URL = "https://t.me/PremiumParfumes";

interface MessageFormProps {
  lang: 'uz' | 'ru';
  contactInfo?: { phone: string };
}

const MessageForm: React.FC<MessageFormProps> = ({ lang, contactInfo }) => {
  const [formData, setFormData] = useState({ name: '', phone: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const t = {
    uz: {
      name: "ISM",
      phone: "TEL",
      msg: "XABAR",
      send: "YUBORISH",
      success: "Xabaringiz qabul qilindi. Tez orada bog'lanamiz.",
      channelAction: "Kanalimizni kuzatib boring:",
      channelName: "@PremiumParfumes",
      error: "Xatolik yuz berdi. Iltimos qaytadan urinib ko'ring."
    },
    ru: {
      name: "ИМЯ",
      phone: "ТЕЛ",
      msg: "СООБЩЕНИЕ",
      send: "ОТПРАВИТЬ",
      success: "Сообщение принято. Мы скоро свяжемся с вами.",
      channelAction: "Следите за нашим каналом:",
      channelName: "@PremiumParfumes",
      error: "Произошла ошибка. Пожалуйста, попробуйте еще раз."
    }
  }[lang];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    const text = `🤵 <b>Yangi Buyurtma / Новое Заказ</b> ✨\n\n` +
                 `👤 <b>Ism / Имя:</b> ${formData.name}\n` +
                 `📞 <b>Tel / Тел:</b> <code>${formData.phone}</code>\n` +
                 `💬 <b>Xabar / Сообщение:</b>\n<i>${formData.message}</i>\n\n` +
                 `📅 <b>Sana:</b> ${new Date().toLocaleString('uz-UZ')}`;

    try {
      const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: "8066400336",
          text: text,
          parse_mode: 'HTML'
        })
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', phone: '', message: '' }); 
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <section id="leave-message" className="py-24 bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-4">
        <div>
          {status === 'success' ? (
            <div className="animate-scale-in text-center space-y-8 bg-white/5 p-12 border border-man-gold/20">
              <div className="w-20 h-20 bg-man-gold rounded-full flex items-center justify-center mx-auto animate-pulse shadow-[0_0_30px_rgba(197,160,89,0.3)]">
                <i className="fab fa-telegram-plane text-black text-3xl"></i>
              </div>
              <div className="space-y-4">
                <h3 className="text-man-gold text-2xl font-serif uppercase tracking-widest leading-snug">{t.success}</h3>
                <p className="text-gray-500 text-[10px] font-bold tracking-[0.3em] uppercase">{t.channelAction}</p>
                <a 
                  href={CHANNEL_URL} 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-block text-white text-xl font-black tracking-tighter hover:text-man-gold transition-colors underline decoration-man-gold/30 underline-offset-8"
                >
                  {t.channelName}
                </a>
              </div>
              <button 
                onClick={() => setStatus('idle')}
                className="text-gray-700 text-[10px] font-black uppercase tracking-[0.5em] hover:text-white transition-colors block mx-auto pt-4"
              >
                YANGI XABAR / НОВОЕ СООБЩЕНИЕ
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="relative border-b border-white/10 focus-within:border-man-gold transition-colors pb-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold block mb-2">{t.name}</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-transparent p-0 text-white outline-none font-light"
                    placeholder="..."
                  />
                </div>
                <div className="relative border-b border-white/10 focus-within:border-man-gold transition-colors pb-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold block mb-2">{t.phone}</label>
                  <input
                    required
                    type="tel"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-transparent p-0 text-white outline-none font-light"
                    placeholder="+998"
                  />
                </div>
              </div>

              <div className="relative border-b border-white/10 focus-within:border-man-gold transition-colors pb-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold block mb-2">{t.msg}</label>
                <textarea
                  required
                  rows={2}
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-transparent p-0 text-white outline-none font-light resize-none"
                  placeholder="..."
                />
              </div>

              <div className="flex flex-col gap-4">
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="group relative overflow-hidden bg-man-gold text-black py-6 px-12 w-full font-black uppercase tracking-[0.4em] text-[10px] hover:text-white transition-colors disabled:opacity-50"
                >
                  <span className="relative z-10">{status === 'loading' ? 'SENDING...' : t.send}</span>
                  <div className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                </button>
              </div>

              {status === 'error' && <p className="text-red-500 text-[10px] font-bold tracking-widest text-center">{t.error}</p>}
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default MessageForm;
