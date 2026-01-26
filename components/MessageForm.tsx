
import React, { useState } from 'react';

const BOT_TOKEN = "7628257957:AAEp9VuIg8lsGUhHDAET2q6TCR_fyOJgc-Y";
const CHANNEL_URL = "https://t.me/PremiumParfumes";

interface MessageFormProps {
  lang: 'uz' | 'ru';
  contactInfo?: { phone: string };
}

const MessageForm: React.FC<MessageFormProps> = ({ lang, contactInfo }) => {
  const [formData, setFormData] = useState({ name: '', phone: '+998', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const t = {
    uz: {
      title: "MUROJAAT QOLDIRING",
      subtitle: "Biz siz bilan tez orada bog'lanamiz",
      name: "ISMINGIZ",
      phone: "TELEFON RAQAMINGIZ",
      msg: "XABARINGIZ",
      send: "YUBORISH",
      success: "Xabaringiz qabul qilindi. Tez orada bog'lanamiz.",
      channelAction: "Kanalimizni kuzatib boring:",
      channelName: "@PremiumParfumes",
      error: "Xatolik yuz berdi. Iltimos qaytadan urinib ko'ring."
    },
    ru: {
      title: "ОСТАВИТЬ СООБЩЕНИЕ",
      subtitle: "Мы свяжемся с вами в ближайшее время",
      name: "ВАШЕ ИМЯ",
      phone: "ВАШ ТЕЛЕФОН",
      msg: "ВАШЕ СООБЩЕНИЕ",
      send: "ОТПРАВИТЬ",
      success: "Сообщение принято. Мы скоро свяжемся с вами.",
      channelAction: "Следите за нашим каналом:",
      channelName: "@PremiumParfumes",
      error: "Произошла ошибка. Пожалуйста, попробуйте еще раз."
    }
  }[lang];

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    // Force +998 prefix
    if (!val.startsWith('+998')) {
      val = '+998';
    }
    // Extract digits after +998 and limit length
    const digits = val.slice(4).replace(/\D/g, '').slice(0, 9);
    setFormData({ ...formData, phone: '+998' + digits });
  };

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
        setFormData({ name: '', phone: '+998', message: '' }); 
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <section id="leave-message" className="py-32 bg-[#050505] relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-man-gold/5 rounded-full blur-[100px] -mr-48 -mt-48"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-man-gold/5 rounded-full blur-[100px] -ml-48 -mb-48"></div>

      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16 space-y-4">
          <span className="text-man-gold font-bold tracking-[0.5em] text-[10px] uppercase">{t.title}</span>
          <h2 className="text-4xl md:text-5xl font-serif text-white tracking-tighter uppercase">{t.subtitle}</h2>
        </div>

        <div className="bg-white/[0.02] backdrop-blur-xl border border-white/5 p-8 md:p-16 rounded-sm shadow-2xl">
          {status === 'success' ? (
            <div className="animate-scale-in text-center space-y-8 py-10">
              <div className="w-24 h-24 bg-man-gold rounded-full flex items-center justify-center mx-auto animate-pulse shadow-[0_0_50px_rgba(197,160,89,0.4)]">
                <i className="fab fa-telegram-plane text-black text-4xl"></i>
              </div>
              <div className="space-y-4">
                <h3 className="text-man-gold text-3xl font-serif uppercase tracking-widest leading-tight max-w-md mx-auto">{t.success}</h3>
                <p className="text-gray-500 text-[10px] font-bold tracking-[0.3em] uppercase">{t.channelAction}</p>
                <a 
                  href={CHANNEL_URL} 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-block text-white text-2xl font-black tracking-tighter hover:text-man-gold transition-colors underline decoration-man-gold/30 underline-offset-8"
                >
                  {t.channelName}
                </a>
              </div>
              <button 
                onClick={() => setStatus('idle')}
                className="text-gray-700 text-[10px] font-black uppercase tracking-[0.5em] hover:text-white transition-colors block mx-auto pt-8"
              >
                YANGI XABAR / НОВОЕ СООБЩЕНИЕ
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
                <div className="space-y-2 group">
                  <label className="text-[9px] uppercase tracking-[0.3em] text-gray-500 font-black block group-focus-within:text-man-gold transition-colors">{t.name}</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white/[0.03] border border-white/5 focus:border-man-gold/50 p-4 text-white outline-none font-light transition-all focus:bg-white/[0.05]"
                    placeholder="..."
                  />
                </div>
                <div className="space-y-2 group">
                  <label className="text-[9px] uppercase tracking-[0.3em] text-gray-500 font-black block group-focus-within:text-man-gold transition-colors">{t.phone}</label>
                  <input
                    required
                    type="tel"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    className="w-full bg-white/[0.03] border border-white/5 focus:border-man-gold/50 p-4 text-white outline-none font-light transition-all focus:bg-white/[0.05]"
                    placeholder="+998"
                  />
                </div>
              </div>

              <div className="space-y-2 group">
                <label className="text-[9px] uppercase tracking-[0.3em] text-gray-500 font-black block group-focus-within:text-man-gold transition-colors">{t.msg}</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-white/[0.03] border border-white/5 focus:border-man-gold/50 p-4 text-white outline-none font-light resize-none transition-all focus:bg-white/[0.05]"
                  placeholder="..."
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="group relative overflow-hidden bg-man-gold text-black py-7 px-12 w-full font-black uppercase tracking-[0.5em] text-[11px] hover:text-white transition-colors disabled:opacity-50 shadow-[0_10px_30px_rgba(197,160,89,0.2)] hover:shadow-man-gold/30"
                >
                  <span className="relative z-10">{status === 'loading' ? 'SENDING...' : t.send}</span>
                  <div className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
                </button>
              </div>

              {status === 'error' && <p className="text-red-500 text-[10px] font-bold tracking-widest text-center animate-pulse">{t.error}</p>}
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default MessageForm;
