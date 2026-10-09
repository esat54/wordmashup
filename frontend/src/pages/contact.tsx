import { useState, type FormEvent } from "react";
import SeoHead from "@/components/SeoHead";
import HomeHeader from "@/components/home/header";
import Footer from "@/components/Footer";

const CONTACT_EMAIL = "esatsprx77@gmail.com";

export default function ContactPage() {
  const [emailAppMessage, setEmailAppMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "");
    const email = String(formData.get("email") ?? "");
    const subject = String(formData.get("subject") ?? "");
    const message = String(formData.get("message") ?? "");
    const body = `Ad: ${name}\nE-posta: ${email}\n\nMesaj:\n${message}`;
    const mailtoUrl = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      `WordMashup: ${subject}`,
    )}&body=${encodeURIComponent(body)}`;

    setEmailAppMessage(
      "E-posta uygulamanız açılmazsa doğrudan e-posta adresimizden ulaşabilirsiniz."
    );
    window.location.href = mailtoUrl;
  }

  return (
    <>
      <SeoHead
        title="İletişim & Geri Bildirim"
        description="WordMashup hakkında sorularınız, önerileriniz veya geri bildirimleriniz için bize ulaşın. Destek ve iletişim kanalları."
        canonical="https://www.wordmashup.online/contact"
      />

      <div className="light-page relative min-h-screen bg-white">
        {/* Orijinal Arka Plan Katmanları */}
        <div className="absolute top-0 left-0 w-full h-screen bg-dot-grid bg-white"></div>
        <div
          className="absolute top-0 left-0 w-full h-screen"
          style={{
            background:
              "linear-gradient(to bottom, transparent 0%, transparent 40%, rgba(255,255,255,0.3) 60%, rgba(255,255,255,0.7) 80%, white 100%)",
          }}
        ></div>

        <div className="relative z-10 flex min-h-screen flex-col">
          <HomeHeader />
          <main className="flex-1">
            <section
              aria-labelledby="contact-heading"
              className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16"
            >
              <div className="overflow-hidden rounded-3xl border border-slate-200/60 bg-white shadow-2xl shadow-slate-200/50 lg:grid lg:grid-cols-[0.85fr_1.15fr]">
                
                {/* Sol Panel - Karanlık Kısım */}
                <aside className="relative flex flex-col justify-between overflow-hidden bg-slate-900 p-8 text-white sm:p-10 lg:p-12">
                  <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl"></div>
                  <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl"></div>

                  <div className="relative z-10">
                    <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-1.5 text-xs font-medium tracking-wide text-blue-300">
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      İLETİŞİM
                    </span>
                    <h1
                      id="contact-heading"
                      className="mt-8 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl"
                    >
                      Bir fikrin mi var?
                      <span className="mt-2 block bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                        Dinliyoruz.
                      </span>
                    </h1>
                    <p className="mt-5 max-w-sm text-base leading-relaxed text-slate-300">
                      Sorularını, önerilerini veya geri bildirimlerini gönder. Ekibimiz en kısa zamanda sana dönüş yapacaktır.
                    </p>
                  </div>

                  <div className="relative z-10 mt-12 border-t border-slate-700/50 pt-8">
                    <p className="mb-4 text-xs font-semibold tracking-widest text-slate-400">
                      DİĞER KANALLAR
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <a
                        href="https://github.com/esat54/wordmashup/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-2 rounded-xl bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-200 ring-1 ring-white/10 transition-all hover:bg-white/10 hover:ring-white/20"
                      >
                        GitHub
                        <span className="text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true">↗</span>
                      </a>
                      <a
                        href="https://www.linkedin.com/in/esatdlkc/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-2 rounded-xl bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-200 ring-1 ring-white/10 transition-all hover:bg-white/10 hover:ring-white/20"
                      >
                        LinkedIn
                        <span className="text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true">↗</span>
                      </a>
                    </div>
                    <div className="mt-6">
                      <a
                        href={`mailto:${CONTACT_EMAIL}`}
                        className="text-sm font-medium text-slate-300 transition-colors hover:text-white"
                      >
                        {CONTACT_EMAIL}
                      </a>
                    </div>
                  </div>
                </aside>

                {/* Sağ Panel - Form Kısmı */}
                <div className="p-8 sm:p-10 lg:p-12">
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">Mesajını yaz</h2>
                    <p className="mt-2 text-sm text-slate-500">Tüm alanları doldurarak bize hızlıca ulaşabilirsin.</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label htmlFor="contact-name" className="mb-2 block text-sm font-medium text-slate-700">
                          Adın
                        </label>
                        <input
                          id="contact-name"
                          name="name"
                          type="text"
                          autoComplete="name"
                          required
                          maxLength={100}
                          placeholder="Ad Soyad"
                          className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition hover:shadow-[0_0_3px_0_rgba(0,0,0,0.12)] focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label htmlFor="contact-email" className="mb-2 block text-sm font-medium text-slate-700">
                          E-posta adresin
                        </label>
                        <input
                          id="contact-email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          required
                          maxLength={254}
                          placeholder="ornek@email.com"
                          className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition hover:shadow-[0_0_3px_0_rgba(0,0,0,0.12)] focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="contact-subject" className="mb-2 block text-sm font-medium text-slate-700">
                        Konu
                      </label>
                      <input
                        id="contact-subject"
                        name="subject"
                        type="text"
                        required
                        maxLength={150}
                        placeholder="Mesajının konusu"
                        className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition hover:shadow-[0_0_3px_0_rgba(0,0,0,0.12)] focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-message" className="mb-2 block text-sm font-medium text-slate-700">
                        Mesajın
                      </label>
                      <textarea
                        id="contact-message"
                        name="message"
                        required
                        rows={5}
                        maxLength={5000}
                        placeholder="Nasıl yardımcı olabiliriz?"
                        className="w-full resize-y rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition hover:shadow-[0_0_3px_0_rgba(0,0,0,0.12)] focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center">
                      <button
                        type="submit"
                        className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:w-auto"
                      >
                        Mesaj gönder 
                        <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </button>
                      <p aria-live="polite" className="text-center text-xs font-medium text-slate-500 sm:text-left">
                        {emailAppMessage || "Gönderim e-posta uygulamanız üzerinden yapılır."}
                      </p>
                    </div>
                  </form>
                </div>

              </div>
            </section>
          </main>
          <Footer />
        </div>
      </div>
    </>
  );
}