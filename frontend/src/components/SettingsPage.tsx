"use client";

import { useState } from "react";
import { Lock, Save } from "lucide-react";

export default function SettingsPage() {


  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Ayarlar</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Lock className="w-5 h-5" />
          Şifre Değiştir
        </h2>


        <form className="space-y-4">

          <div>   {/* mevcut şifre */}
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mevcut Şifre
            </label>
            <input
              type="password"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>

          <div>   {/* yeni şifre*/}
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Yeni Şifre
            </label>
            <input
              type="password"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>

          <div>   {/* yeni şifre tekrar*/}
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Yeni Şifre (Tekrar)
            </label>
            <input
              type="password"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
          >
            <Save className="w-4 h-4" /> Şifreyi Değiştir
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">      {/* hesap bilgileri */}
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Hesap Bilgileri</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">İsim</label>
            <p className="mt-1 text-gray-900">esat</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">E-posta</label>
            <p className="mt-1 text-gray-900">esatsprx77@gmail.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}

