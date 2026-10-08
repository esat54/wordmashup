import type { ReactNode } from "react";
import { Sparkles, BookOpen, Layers, Check } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from "lucide-react";
import { authApi } from "@/lib/api";
import SeoHead from "@/components/SeoHead";
export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
  }>({});
  const validateForm = () => {
    const newErrors: {
      name?: string;
      email?: string;
      password?: string;
    } = {};
    if (!name) {
      newErrors.name = "İsim gereklidir";
    }
    if (!email) {
      newErrors.email = "E-posta adresi gereklidir";
    }
    if (!password) {
      newErrors.password = "Şifre gereklidir";
    } else if (password.length < 6) {
      newErrors.password = "Şifre en az 6 karakter olmalıdır";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    setIsSuccess(false);
    setErrors({});
    try {
      await authApi.register({ name, email, password });
      setIsSuccess(true);
      setTimeout(() => {
        window.location.href = "/login";
      }, 3000);
    } catch (error: any) {
      const errorMessage = error.message || "Kayıt başarısız oldu";
      setErrors({ email: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };
  return (<><SeoHead title="Hesap Oluştur" description="WordMashup — AI destekli İngilizce öğrenme platformu." noindex={true} />
<AuthLayout mode="register"><form onSubmit={handleSubmit} aria-busy={isLoading}><div className="wm-field">
<label htmlFor="name">Adınız soyadınız</label>
<div className={`wm-input ${errors.name ? "wm-invalid" : ""}`}>
<User size={16} aria-hidden="true" />
<input id="name" type="text" value={name} autoComplete="name" placeholder="Adınız soyadınız" aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined} onChange={(e) => { setName(e.target.value); if (errors.name) setErrors({ ...errors, name: undefined }); }} />
</div><div className="wm-error" id="name-error" aria-live="polite">{errors.name}</div></div><div className="wm-field">
<label htmlFor="email">E-posta adresi</label>
<div className={`wm-input ${errors.email ? "wm-invalid" : ""}`}>
<Mail size={16} aria-hidden="true" />
<input id="email" type="email" value={email} autoComplete="email" placeholder="ornek@email.com" aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors({ ...errors, email: undefined }); }} />
</div><div className="wm-error" id="email-error" aria-live="polite">{errors.email}</div></div><div className="wm-field">
<label htmlFor="password">Şifre</label>
<div className={`wm-input ${errors.password ? "wm-invalid" : ""}`}>
<Lock size={16} aria-hidden="true" />
<input id="password" type={showPassword ? "text" : "password"} value={password} autoComplete="new-password" placeholder="En az 6 karakter" aria-invalid={!!errors.password} aria-describedby={errors.password ? "password-error" : undefined} onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors({ ...errors, password: undefined }); }} />
<button type="button" className="wm-eye" aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"} aria-pressed={showPassword} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></div><div className="wm-error" id="password-error" aria-live="polite">{errors.password}</div></div><button className="wm-primary" type="submit" disabled={isLoading || isSuccess}>{isLoading ? "Kaydediliyor..." : isSuccess ? "Kayıt başarılı" : "Hesap Oluştur"}{!isLoading && !isSuccess && <ArrowRight size={16} />}</button>
<div className="wm-status" role="status">{isSuccess ? "Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz..." : "Kendi cümlelerinizle öğrenmeye başlayın."}</div></form></AuthLayout></>);
}

function AuthLayout({ mode, children }: { mode: "login" | "register"; children: ReactNode }) {
 const isLogin = mode === "login";
 return (
 <main className="light-page wm-auth">
  <div className="absolute inset-0 bg-dot-grid bg-white pointer-events-none" />
  <div className="absolute inset-0 pointer-events-none" style={{background:"linear-gradient(to bottom, transparent 0%, transparent 40%, rgba(255,255,255,0.3) 60%, rgba(255,255,255,0.7) 80%, white 100%)"}} />
  <div className="wm-shell">
   <section className="wm-form-card" aria-label={isLogin ? "Giriş yap" : "Hesap oluştur"}>
    <Link href="/" className="wm-logo">Word<span>Mashup</span></Link>
    <nav className="wm-tabs" aria-label="Hesap işlemleri"><Link href="/login" aria-current={isLogin ? "page" : undefined}>Giriş Yap</Link><Link href="/register" aria-current={!isLogin ? "page" : undefined}>Kayıt Ol</Link></nav>
    <div className="wm-form-body">{children}</div>
   </section>
   <aside className="wm-info" aria-labelledby="wm-info-title">
    <div className="wm-pill"><Sparkles size={13} /> AI destekli İngilizce öğrenme</div>
    <h2 id="wm-info-title">Sadece ezberlemeyin.<br /><span>Kendinize ait kılın.</span></h2>
    <p className="wm-intro">Kendi cümlelerinizi yazın, kartlarla pekiştirin ve kelimeleri kişisel arşivinizde biriktirin.</p>
    <div className="wm-word"><div className="wm-word-top"><span>GÜNÜN KELİMESİ</span><span><Sparkles size={12} /> AI analizi</span></div><div className="wm-word-title"><strong>discover</strong><span>/dɪˈskʌvər/</span><b>VERB</b></div><p>Keşfetmek, bulmak</p><blockquote>“I discover new words every day.”<small>Her gün yeni kelimeler keşfediyorum.</small></blockquote><div className="wm-saved"><Check size={13} /> Kişisel kütüphaneniz, kendi cümleleriniz.</div></div>
    <div className="wm-features"><div><BookOpen size={17}/><span><strong>Oxford 3000</strong><small>En önemli kelimeler, tek yerde.</small></span></div><div><Layers size={17}/><span><strong>Akıllı tekrar & gramer</strong><small>Doğru zamanda tekrar, kalıcı öğrenme.</small></span></div></div>
   </aside>
  </div>
  <style jsx global>{`
   .wm-auth,.wm-auth *{box-sizing:border-box}.wm-auth{position:relative;min-height:100dvh;display:flex;align-items:center;justify-content:center;padding:12px;background:#fff;color:#172033;font-family:inherit}
   .wm-shell{position:relative;z-index:1;display:grid;grid-template-columns:1fr 1fr;gap:0;width:min(880px,100%);min-height:500px;border:1px solid #e1e7ef;border-radius:18px;overflow:hidden}
   .wm-form-card,.wm-info{border-radius:0;min-width:0;min-height:500px;border:0}.wm-form-card{padding:24px 28px;display:flex;flex-direction:column;background:rgba(255,255,255,.96)}
   .wm-logo{display:inline-flex;align-items:center;width:fit-content;font-size:21px;font-weight:800;letter-spacing:-.8px;text-decoration:none;color:#172033}.wm-logo span{color:#2563eb}
   
   .wm-tabs{display:flex;padding:4px;background:#f1f4f8;border-radius:9px;gap:4px;margin-top:20px;margin-bottom:18px}.wm-tabs a{flex:1;text-align:center;padding:8px;font-size:12px;font-weight:600;color:#64748b;text-decoration:none;border-radius:6px}.wm-tabs a[aria-current=page]{background:#fff;color:#1d4ed8;box-shadow:0 1px 4px #1720330d}
   .wm-form-body{min-height:0}.wm-field label{display:block;font-size:11px;font-weight:600;margin-bottom:6px}.wm-input{height:42px;border:1px solid #dfe5ed;background:#fff;border-radius:8px;display:flex;align-items:center;padding:0 12px;gap:9px;color:#94a3b8;transition:border-color .15s,box-shadow .15s}.wm-input:focus-within{border-color:#2563eb;box-shadow:0 0 0 3px #2563eb12}.wm-input input{background:transparent;width:100%;min-width:0;outline:none;border:0;color:#172033;font-size:13px;font-family:inherit;padding:0;height:100%}.wm-input input::placeholder{color:#94a3b8}.wm-input svg{flex-shrink:0}.wm-eye{display:flex;align-items:center;justify-content:center;align-self:stretch;border:0;background:transparent;color:#64748b;cursor:pointer;min-width:28px}.wm-invalid{border-color:#fca5a5;background:#fffafa}.wm-error{min-height:17px;padding-top:2px;font-size:10px;color:#dc2626;line-height:1.3;overflow-wrap:anywhere}
   .wm-options{display:flex;justify-content:space-between;align-items:center;font-size:11px;margin:1px 0 15px;gap:8px}.wm-options label{display:flex;align-items:center;gap:6px;color:#64748b}.wm-options input{accent-color:#2563eb;width:13px;height:13px;margin:0}.wm-auth a:not(.wm-logo):not(.wm-tabs a){color:#2563eb;text-decoration:none}.wm-primary,.wm-demo{width:100%;height:41px;display:flex;align-items:center;justify-content:center;gap:8px;border-radius:8px;font-size:12px;font-weight:600;font-family:inherit;cursor:pointer;transition:background .15s;border:0}.wm-primary{background:#2563eb;color:#fff}.wm-primary:hover{background:#1d4ed8}.wm-primary:disabled,.wm-demo:disabled{opacity:.55;cursor:wait}.wm-demo{background:#fff;border:1px solid #dfe5ed;color:#334155}.wm-demo:hover{background:#f8fafc}.wm-divider{display:flex;align-items:center;gap:10px;font-size:9px;color:#94a3b8;margin:12px 0}.wm-divider:before,.wm-divider:after{content:"";height:1px;background:#e9edf3;flex:1}.wm-note{font-size:9px;text-align:center;color:#64748b;margin:7px 0 0}.wm-status{font-size:11px;line-height:1.5;text-align:center;color:#64748b;padding:12px 0;overflow-wrap:anywhere}
   .wm-info{background:linear-gradient(145deg,#f3f7ff,#eaf1ff);position:relative;isolation:isolate;padding:24px;display:flex;flex-direction:column;border-left:1px solid #dce6fa;overflow:hidden}.wm-pill{display:inline-flex;align-items:center;gap:6px;font-size:10px;font-weight:600;color:#4164a3;width:fit-content;border:1px solid #d3dff5;border-radius:20px;padding:6px 9px;background:#ffffff80}.wm-info h2{font-size:25px;line-height:1.22;letter-spacing:-1px;margin:16px 0 10px;font-weight:750}.wm-info h2 span{color:#2563eb}.wm-intro{font-size:12px;line-height:1.7;color:#60718b;margin:0;max-width:330px}.wm-word{margin-top:16px;background:#fff;border:1px solid #e1e8f4;border-radius:13px;padding:14px;box-shadow:0 8px 22px #36578708}.wm-word-top{display:flex;justify-content:space-between;align-items:center;font-size:8px;letter-spacing:1px;color:#6b7d98}.wm-word-top span:last-child{display:flex;align-items:center;gap:4px;color:#2563eb;letter-spacing:0}.wm-word-title{display:flex;gap:8px;align-items:center;margin-top:13px}.wm-word-title strong{font-size:23px;letter-spacing:-.6px}.wm-word-title span{font-size:10px;color:#94a3b8}.wm-word-title b{margin-left:auto;font-size:8px;color:#2563eb;background:#eff5ff;padding:4px 6px;border-radius:4px}.wm-word>p{font-size:11px;color:#64748b;margin:3px 0 12px}.wm-word blockquote{border-left:2px solid #b4ccff;padding-left:10px;margin:0;font-size:12px;color:#334155;line-height:1.5}.wm-word blockquote small{display:block;font-size:10px;color:#94a3b8;margin-top:3px}.wm-saved{border-top:1px solid #eff2f7;margin-top:14px;padding-top:11px;display:flex;align-items:center;gap:5px;color:#65816c;font-size:9px}.wm-features{display:grid;gap:12px;margin-top:18px}.wm-features>div{display:flex;gap:11px;align-items:center;color:#5375ab}.wm-features strong{display:block;font-size:11px;color:#334155;font-weight:600}.wm-features small{display:block;margin-top:3px;font-size:10px;color:#7486a0}
   .wm-auth button:focus-visible,.wm-auth a:focus-visible,.wm-options input:focus-visible{outline:2px solid #2563eb;outline-offset:3px}
   .wm-info:before,.wm-info:after{content:"";position:absolute;z-index:-1;width:220px;height:220px;border-radius:50%;pointer-events:none;filter:blur(28px);opacity:.45;background:radial-gradient(circle,#c0d5ff,transparent 70%);animation:wm-drift 12s ease-in-out infinite alternate}.wm-info:before{top:-65px;right:-55px}.wm-info:after{bottom:-90px;left:-70px;animation-delay:-6s;background:radial-gradient(circle,#d7ccff,transparent 70%)}
   .wm-word{animation:wm-float 7s ease-in-out infinite;will-change:transform}.wm-pill svg{animation:wm-spark 4s ease-in-out infinite}
   @keyframes wm-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
   @keyframes wm-drift{from{transform:translate(0,0)}to{transform:translate(-25px,30px)}}
   @keyframes wm-spark{0%,100%{opacity:1}50%{opacity:.45}}
   @media(max-width:767px){.wm-auth{padding:12px}.wm-shell{grid-template-columns:1fr;width:min(420px,100%);min-height:500px}.wm-info{display:none}.wm-form-card{padding:24px}.wm-input input{font-size:16px}}
   @media(max-height:560px){.wm-auth{padding:8px}.wm-shell,.wm-form-card,.wm-info{min-height:460px}.wm-form-card{padding:18px 24px}.wm-tabs{margin-top:14px;margin-bottom:14px}.wm-info{padding:18px 22px}.wm-info h2{margin-top:12px;font-size:23px}.wm-word{margin-top:12px}.wm-features{margin-top:12px;gap:10px}}
   @media(prefers-reduced-motion:reduce){.wm-info:before,.wm-info:after,.wm-word,.wm-pill svg{animation:none;will-change:auto}}
  `}</style>
 </main>);
}
