"use client";

import { useState } from "react";
import { Lock, Save } from "lucide-react";
import { authApi } from "@/lib/api";

interface SettingsProps {
  user: {
    name: string;
    email: string;
  };
}

export default function SettingsPageComponent({ user }: SettingsProps) {

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const changepassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!currentPassword) { setError("Mevcut şifre gerekli."); return; }
    if (!newPassword) { setError("Yeni şifre gerekli."); return; }
    if (newPassword.length < 6) { setError("Yeni şifre en az 6 karakter olmalı."); return; }
    if (newPassword !== confirmNewPassword) { setError("Yeni şifreler eşleşmiyor."); return; }

    try {
      setLoading(true);

      await authApi.changePassword({ currentPassword, newPassword });

      setSuccess("Şifre başarıyla değiştirildi.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");

    } catch (err: any) {
      setError(err.message || "Şifre değiştirme sırasında bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Ayarlar</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Lock className="w-5 h-5" />
          Şifre Değiştir
        </h2>

        <form className="space-y-4" onSubmit={changepassword}>
          <div> {/* mevcut şifre */}
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mevcut Şifre
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>

          <div> {/* yeni şifre*/}
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Yeni Şifre
            </label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>

          <div> {/* yeni şifre tekrar*/}
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Yeni Şifre (Tekrar)
            </label>
            <input
              type="password"
              required
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>

          <div className="flex items-center justify-start gap-5">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
            >
              <Save className="w-4 h-4" />
              {loading ? "Şifre Değiştiriliyor..." : "Şifreyi Değiştir"}
            </button>
            {error && <span className="text-red-500 text-sm font-medium">{error}</span>}
            {success && <span className="text-green-500 text-sm font-medium">{success}</span>}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"> {/* hesap bilgileri */}
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Hesap Bilgileri</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">İsim</label>
            <p className="mt-1 text-gray-900">{user.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">E-posta</label>
            <p className="mt-1 text-gray-900">{user.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}