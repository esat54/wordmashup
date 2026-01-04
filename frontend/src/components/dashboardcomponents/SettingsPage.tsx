"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Save, User, Mail, Trash2, Loader2, X, AlertTriangle } from "lucide-react";
import { authApi } from "@/lib/api";
import { useRouter } from "next/navigation";

interface SettingsProps {
  user: {
    name: string;
    email: string;
  };
}

export default function SettingsPage({ user }: SettingsProps) {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

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

  const handleDeleteAccount = async () => {
    setDeleteError("");

    if (!deletePassword) {
      setDeleteError("Şifre gereklidir.");
      return;
    }

    if (deleteConfirmText !== "hesabı sil") {
      setDeleteError('Lütfen onaylama metnini doğru yazınız.');
      return;
    }

    try {
      setDeleteLoading(true);
      await authApi.deleteAccount({ password: deletePassword });

      localStorage.removeItem("user");
      localStorage.removeItem("token");
      router.push("/login");
    } catch (err: any) {
      setDeleteError(err.message || "Hesap silinirken bir hata oluştu.");
      setDeleteLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Ayarlar</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="flex flex-col space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-5 flex-1">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-gray-600" />
              Hesap Bilgileri
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">İsim</label>
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
                  <User className="w-4 h-4 text-gray-400" />
                  <p className="text-sm text-gray-900">{user.name}</p>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">E-posta</label>
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <p className="text-sm text-gray-900">{user.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tehlikeli Bölge */}
          <div className="bg-white rounded-lg border border-red-200 p-5 flex-1 flex flex-col">
            <h2 className="text-lg font-semibold text-red-600 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Tehlikeli Bölge
            </h2>
            <p className="text-xs text-gray-500 mb-4">Bu işlemler geri alınamaz.</p>
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="mt-auto inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Hesabı Sil
            </button>
          </div>
        </div>  {/* account information */}

        {/* change password */}
        <div className="flex flex-col">
          <div className="bg-white rounded-lg border border-gray-200 p-5 flex-1 flex flex-col">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5 text-gray-600" />
              Şifre Değiştir
            </h2>

            <form className="flex-1 flex flex-col space-y-4" onSubmit={changepassword}>
              <div className="flex-1 flex flex-col space-y-4">
                <div className="flex-1 flex flex-col">
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Mevcut Şifre
                  </label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div className="flex-1 flex flex-col">
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Yeni Şifre
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div className="flex-1 flex flex-col">
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Yeni Şifre (Tekrar)
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              {(error || success) && (
                <div className={`p-3 rounded-lg text-sm ${error ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'
                  }`}>
                  {error || success}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors text-sm font-medium"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Değiştiriliyor...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Şifreyi Değiştir
                  </>
                )}
              </button>
            </form>
          </div>
        </div>  {/* change password */}
      </div>

      <AnimatePresence>  {/* delete account modal */}
        {isDeleteModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDeleteModalOpen(false)}
              className="fixed inset-0 bg-black/30 z-40"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e: any) => e.stopPropagation()}
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
            >
              <div className="bg-white rounded-lg shadow-2xl w-full max-w-md max-h-[85vh] flex flex-col">
                <div className="flex-shrink-0 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <h2 className="text-lg font-bold text-gray-900">Hesabı Sil</h2>
                  </div>
                  <button
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-800">
                        Bu işlem geri alınamaz! Hesabınız ve tüm verileriniz kalıcı olarak silinecektir.
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Şifreniz
                      </label>
                      <input
                        type="password"
                        value={deletePassword}
                        onChange={(e) => setDeletePassword(e.target.value)}
                        placeholder="Şifrenizi girin"
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Onaylamak için <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">hesabı sil</span> yazın
                      </label>
                      <input
                        type="text"
                        value={deleteConfirmText}
                        onChange={(e) => setDeleteConfirmText(e.target.value)}
                        placeholder="hesabı sil"
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>

                    {deleteError && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                        {deleteError}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-shrink-0 px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
                  <button
                    onClick={() => {
                      setIsDeleteModalOpen(false);
                      setDeletePassword("");
                      setDeleteConfirmText("");
                      setDeleteError("");
                    }}
                    disabled={deleteLoading}
                    className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors"
                  >
                    İptal
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deleteLoading}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {deleteLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Siliniyor...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4" />
                        Hesabı Sil
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}