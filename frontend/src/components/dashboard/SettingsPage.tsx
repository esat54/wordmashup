import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Save, User, Mail, Trash2, Loader2, X, AlertTriangle } from "lucide-react";
import { authApi } from "@/lib/api";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";

interface SettingsProps {
  user: {
    name: string;
    email: string;
  };
}

export default function SettingsPage({ user }: SettingsProps) {
  const router = useRouter();
  const { logout } = useAuth();
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

    if (!currentPassword) {
      setError("Mevcut şifre gerekli.");
      return;
    }
    if (!newPassword) {
      setError("Yeni şifre gerekli.");
      return;
    }
    if (newPassword.length < 6) {
      setError("Yeni şifre en az 6 karakter olmalı.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError("Yeni şifreler eşleşmiyor.");
      return;
    }

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
      setDeleteError("Lütfen onaylama metnini doğru yazınız.");
      return;
    }

    try {
      setDeleteLoading(true);
      await authApi.deleteAccount({ password: deletePassword });

      logout();
      router.push("/login");
    } catch (err: any) {
      setDeleteError(err.message || "Hesap silinirken bir hata oluştu.");
      setDeleteLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex flex-col space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5 flex-1">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              Hesap Bilgileri
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">İsim</label>
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-700">
                  <User className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                  <p className="text-sm text-gray-900 dark:text-white">{user.name}</p>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                  E-posta
                </label>
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-700">
                  <Mail className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                  <p className="text-sm text-gray-900 dark:text-white">{user.email}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-red-200 dark:border-red-900/50 p-5 flex-1 flex flex-col">
            <h2 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Tehlikeli Bölge
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Bu işlemler geri alınamaz.</p>
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="mt-auto inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 border border-red-300 dark:border-red-900/50 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Hesabı Sil
            </button>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5 flex-1 flex flex-col">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              Şifre Değiştir
            </h2>

            <form className="flex-1 flex flex-col space-y-4" onSubmit={changepassword}>
              <div className="flex-1 flex flex-col space-y-4">
                <div className="flex-1 flex flex-col">
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Mevcut Şifre
                  </label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="flex-1 px-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg transition hover:shadow-[0_0_3px_0_rgba(0,0,0,0.12)] focus:outline-none"
                  />
                </div>

                <div className="flex-1 flex flex-col">
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Yeni Şifre
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="flex-1 px-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg transition hover:shadow-[0_0_3px_0_rgba(0,0,0,0.12)] focus:outline-none"
                  />
                </div>

                <div className="flex-1 flex flex-col">
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Yeni Şifre (Tekrar)
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="flex-1 px-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg transition hover:shadow-[0_0_3px_0_rgba(0,0,0,0.12)] focus:outline-none"
                  />
                </div>
              </div>

              {(error || success) && (
                <div
                  className={`p-3 rounded-lg text-sm ${error
                    ? "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/50"
                    : "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-900/50"
                    }`}
                >
                  {error || success}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 dark:disabled:bg-blue-800 disabled:cursor-not-allowed transition-colors text-sm font-medium"
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
        </div>
      </div>

      <AnimatePresence>
        {isDeleteModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDeleteModalOpen(false)}
              className="fixed inset-0 bg-black/30 dark:bg-black/50 z-40"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e: any) => e.stopPropagation()}
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-md max-h-[85vh] flex flex-col">
                <div className="flex-shrink-0 px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Hesabı Sil</h2>
                  </div>
                  <button
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="p-1.5 rounded-lg text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-lg">
                      <p className="text-sm text-red-800 dark:text-red-400">
                        Bu işlem geri alınamaz! Hesabınız ve tüm verileriniz kalıcı olarak
                        silinecektir.
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Şifreniz
                      </label>
                      <input
                        type="password"
                        value={deletePassword}
                        onChange={(e) => setDeletePassword(e.target.value)}
                        placeholder="Şifrenizi girin"
                        className="w-full px-3 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg text-sm transition hover:shadow-[0_0_3px_0_rgba(0,0,0,0.12)] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Onaylamak için{" "}
                        <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-gray-900 dark:text-white">
                          hesabı sil
                        </span>{" "}
                        yazın
                      </label>
                      <input
                        type="text"
                        value={deleteConfirmText}
                        onChange={(e) => setDeleteConfirmText(e.target.value)}
                        placeholder="hesabı sil"
                        className="w-full px-3 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg text-sm transition hover:shadow-[0_0_3px_0_rgba(0,0,0,0.12)] focus:outline-none"
                      />
                    </div>

                    {deleteError && (
                      <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-lg text-sm text-red-700 dark:text-red-400">
                        {deleteError}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-shrink-0 px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-end gap-3">
                  <button
                    onClick={() => {
                      setIsDeleteModalOpen(false);
                      setDeletePassword("");
                      setDeleteConfirmText("");
                      setDeleteError("");
                    }}
                    disabled={deleteLoading}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 transition-colors"
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