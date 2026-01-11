
import React, { useState } from 'react';

const BOT_TOKEN = "8387180692:AAEsVJGhSTkUCb4mfhRyI69kUceOgJRHAUg";

interface MessageFormProps {
  lang: 'uz' | 'ru';
  contactInfo?: { phone: string };
}

const MessageForm: React.FC<MessageFormProps> = ({ lang, contactInfo }) => {
  const [formData, setFormData] = useState({ name: '', phone: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const myPhone = contactInfo?.phone || "+998996909575";

  const t = {
    uz: {
      name: "ISM",
      phone: "TEL",
      msg: "XABAR",
      send: "YUBORISH",
      smsConfirm: "SMS ORQALI TASDIQLASH",
      success: "Xabaringiz qabul qilindi.",
      error: "Xatolik yuz berdi."
    },
    ru: {
      name: "ИМЯ",
      phone: "ТЕЛ",
      msg: "СООБЩЕНИЕ",
      send: "ОТПРАВИТЬ",
      smsConfirm: "ПОДТВЕРДИТЬ ПО SMS",
      success: "Сообщение принято.",
      error: "Произошла ошибка."
    }
  }[lang];

  const handleSmsRedirect = () => {
    const text = `Salom, men ${formData.name}. Tel: ${formData.phone}. Xabar: ${formData.message}`;
    const separator = /iPhone|iPad|iPod/.test(navigator.userAgent) ? '&' : '?';
    window.location.href = `sms:${myPhone.replace(/\s/g, '')}${separator}body=${encodeURIComponent(text)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    const text = `🤵 Yangi Buyurtma/Xabar ✨\n\n👤 Ism: ${formData.name}\n📞 Tel: ${formData.phone}\n💬 Xabar: ${formData.message}`;

    try {
      const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: "-1002364234547",
          text: text,
          parse_mode: 'HTML'
        })
      });

      if (response.ok) {
        setStatus('success');
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
                />
              </div>
              <div className="relative border-b border-white/10 focus-within:border-man-gold transition-colors pb-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold block mb-2">{t.phone}</label>
                <input
                  required
                  type="tel"
                  placeholder="+998"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-transparent p-0 text-white outline-none font-light"
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
              />
            </div>

            <div className="flex flex-col gap-4">
              <button
                type="submit"
                disabled={status === 'loading'}
                className="group relative overflow-hidden bg-man-gold text-black py-6 px-12 w-full font-black uppercase tracking-[0.4em] text-[10px] hover:text-white transition-colors disabled:opacity-50"
              >
                <span className="relative z-10">{status === 'loading' ? '...' : t.send}</span>
                <div className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              </button>
              
              <button
                type="button"
                onClick={handleSmsRedirect}
                className="border border-white/10 text-white/60 py-4 px-12 w-full font-bold uppercase tracking-[0.3em] text-[9px] hover:border-man-gold hover:text-man-gold transition-all flex items-center justify-center gap-3"
              >
                <i className="fas fa-sms text-lg"></i>
                {t.smsConfirm}
              </button>
            </div>

            {status === 'success' && (
              <div className="animate-fade-in text-center space-y-2">
                <p className="text-man-gold text-[10px] font-bold tracking-widest">{t.success}</p>
                <p className="text-gray-600 text-[8px] uppercase tracking-tighter">Telegram & SMS channels open</p>
              </div>
            )}
            {status === 'error' && <p className="text-red-500 text-[10px] font-bold tracking-widest text-center">{t.error}</p>}
          </form>
        </div>
      </div>
    </section>
  );
};

export default MessageForm;
