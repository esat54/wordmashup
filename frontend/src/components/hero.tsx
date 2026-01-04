"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function HeroArea() {
  return (
    <div className="relative min-h-[calc(100vh-5rem)] sm:min-h-[calc(100vh-4rem)] flex items-center pt-[calc(2.5rem+4px)] pb-8 sm:pt-14 sm:pb-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 w-full text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-5 leading-tight"
        >
          Kendi cümlelerinle öğren,{" "}
          <span className="relative inline-block">
            <span className="text-blue-600">kartlarla pekiştir</span>
            <span className="absolute bottom-0 left-0 right-0 h-3 bg-blue-100 -z-10" style={{ transform: 'skewY(-2deg)' }}></span>
          </span>
          {" "}ve kelimeleri hafızana yerleştir
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-base sm:text-lg text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          Her kelime için kişisel örnekler ekle, akıllı tekrar sistemiyle doğru zamanda tekrar gör ve bilgiyi kalıcı hâle getir.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 sm:mb-16"
        >
          <Link href="/login" className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-white bg-gray-900 hover:bg-gray-800 rounded-lg transition-colors">
            Ücretsiz Dene
          </Link>
          <Link href="/register" className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-blue-600 bg-white hover:bg-gray-50 rounded-lg border-2 border-gray-300 transition-colors">
            Kayıt Ol
          </Link>
        </motion.div>
      </div>
    </div>
  );
}