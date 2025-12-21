"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import Image from "next/image";
import { authApi } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter(); {/* Dashboard yönlendirmesi için*/ }
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

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
    setErrors({});

    try {
      const response = await authApi.login({ email, password }) as any;

      if (response && response.token) {
        localStorage.setItem('token', response.token);

        if (response.user) {
          localStorage.setItem('user', JSON.stringify(response.user));
        }

        router.push("/dashboard");

      } else {
        console.error("Login yanıtında token yok:", response);
        setErrors({ email: "Giriş işlemi sırasında beklenmedik bir hata oluştu." });
      }

    } catch (error: any) {
      console.error("Login hatası:", error);
      setErrors({ email: error.message || "Giriş başarısız oldu" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">

      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-12 sm:px-16">
        <div className="mx-auto w-full max-w-sm">

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-gray-900">
                Word<span className="text-blue-600">Mashup</span>
              </span>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Hesabınıza giriş yapın
            </h1>
            <p className="text-sm text-gray-600">
              Hesabınız yok mu?{" "}
              <Link
                href="/register"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Ücretsiz deneme için kayıt olun
              </Link>
            </p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-6">




            <motion.div           // email alanı
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                E-posta adresi
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: undefined });
                  }}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all 
                    ${errors.email ? "border-red-300 bg-red-50" : "border-gray-300 bg-white hover:border-gray-400"}`}
                  placeholder="ornek@email.com"
                />
              </div>
              {errors.email && (<p className="mt-1 text-sm text-red-600">{errors.email}</p>)}
            </motion.div>




            <motion.div       // şifre alanı
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Şifre
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: undefined });
                  }}
                  className={`block w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all 
                    ${errors.password ? "border-red-300 bg-red-50" : "border-gray-300 bg-white hover:border-gray-400"}`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (<EyeOff className="h-5 w-5" />) : (<Eye className="h-5 w-5" />)}
                </button>
              </div>
              {errors.password && (<p className="mt-1 text-sm text-red-600">{errors.password}</p>)}
            </motion.div>




            <motion.div          // Beni hatırla ve Şifremi unuttum
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex items-center justify-between"
            >
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-600 focus:ring-2"
                />
                <span className="ml-2 text-sm text-gray-600">Beni hatırla</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Şifremi unuttum
              </Link>
            </motion.div>



            <motion.button     // Giriş yap butonu
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30"
            >
              {isLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
              {!isLoading && <ArrowRight className="h-5 w-5" />}
            </motion.button>

          </form>
        </div>
      </div>

      <div className="hidden lg:block relative w-0 lg:flex-1">
        <div className="absolute inset-0">
          <Image
            src="/login-image.jpg"
            alt="Login illustration"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </div>
  );
}
