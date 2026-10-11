import { useEffect, useRef, useState, type ChangeEvent, type PointerEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ImagePlus, Lock, Save, User, Mail, Trash2, Loader2, X, AlertTriangle, Check } from "lucide-react";
import { authApi } from "@/lib/api";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import { isPresetAvatar, PRESET_AVATARS } from "@/lib/avatars";

const CROP_SIZE = 288;
const MIN_IMAGE_BYTES = 10 * 1024;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_AVATAR_DATA_URL_LENGTH = 350000;

function clampCropOffset(
  x: number,
  y: number,
  width: number,
  height: number,
  zoom: number,
) {
  const scale = Math.max(CROP_SIZE / width, CROP_SIZE / height) * zoom;
  const renderedWidth = width * scale;
  const renderedHeight = height * scale;
  return {
    x: Math.min(0, Math.max(CROP_SIZE - renderedWidth, x)),
    y: Math.min(0, Math.max(CROP_SIZE - renderedHeight, y)),
  };
}

interface SettingsProps {
  user: {
    name: string;
    email: string;
    avatar?: string | null;
  };
}

export default function SettingsPage({ user }: SettingsProps) {
  const router = useRouter();
  const { logout, updateUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cropImageRef = useRef<HTMLImageElement | null>(null);
  const dragRef = useRef<{ pointerId: number; x: number; y: number; offsetX: number; offsetY: number } | null>(null);
  const [imageDraft, setImageDraft] = useState("");
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);
  const [cropZoom, setCropZoom] = useState(1);
  const [cropOffset, setCropOffset] = useState({ x: 0, y: 0 });
  const [avatarError, setAvatarError] = useState("");
  const [avatarSuccess, setAvatarSuccess] = useState("");
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
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

  const handleImageFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setAvatarError("");
    setAvatarSuccess("");
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setAvatarError("Lütfen JPG, PNG veya WebP biçiminde bir görsel seçin.");
      return;
    }
    if (file.size < MIN_IMAGE_BYTES || file.size > MAX_IMAGE_BYTES) {
      setAvatarError("Fotoğraf boyutu en az 10 KB, en fazla 5 MB olmalıdır.");
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      if (image.width < 64 || image.height < 64) {
        URL.revokeObjectURL(imageUrl);
        setAvatarError("Fotoğrafın genişliği ve yüksekliği en az 64 piksel olmalıdır.");
        return;
      }
      cropImageRef.current = image;
      setImageDimensions({ width: image.width, height: image.height });
      setCropZoom(1);
      const baseScale = Math.max(CROP_SIZE / image.width, CROP_SIZE / image.height);
      setCropOffset(clampCropOffset(
        (CROP_SIZE - image.width * baseScale) / 2,
        (CROP_SIZE - image.height * baseScale) / 2,
        image.width,
        image.height,
        1,
      ));
      setImageDraft(imageUrl);
    };
    image.onerror = () => {
      URL.revokeObjectURL(imageUrl);
      setAvatarError("Fotoğraf açılamadı. Başka bir görsel deneyin.");
    };
    image.src = imageUrl;
  };

  const saveAvatar = async (avatar: string | null) => {
    setAvatarError("");
    setAvatarSuccess("");
    try {
      setAvatarLoading(true);
      await authApi.updateAvatar(avatar);
      updateUser({ avatar });
      setImageDraft("");
      setImageDimensions(null);
      setAvatarSuccess("Profil görseliniz güncellendi.");
    } catch (err: unknown) {
      setAvatarError(err instanceof Error ? err.message : "Avatar kaydedilirken bir hata oluştu.");
    } finally {
      setAvatarLoading(false);
    }
  };

  const handleCrop = async () => {
    if (!cropImageRef.current || !imageDimensions) return;

    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const context = canvas.getContext("2d");
    if (!context) {
      setAvatarError("Fotoğraf kırpılırken bir hata oluştu.");
      return;
    }

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    const scale = Math.max(CROP_SIZE / imageDimensions.width, CROP_SIZE / imageDimensions.height) * cropZoom;
    const sourceSize = CROP_SIZE / scale;
    context.drawImage(
      cropImageRef.current,
      -cropOffset.x / scale,
      -cropOffset.y / scale,
      sourceSize,
      sourceSize,
      0,
      0,
      canvas.width,
      canvas.height,
    );

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.8));
    if (!blob) {
      setAvatarError("Fotoğraf hazırlanamadı. Lütfen tekrar deneyin.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const avatar = reader.result;
      if (typeof avatar !== "string" || avatar.length > MAX_AVATAR_DATA_URL_LENGTH) {
        setAvatarError("Kırpılan fotoğraf çok büyük. Daha küçük bir alan seçip tekrar deneyin.");
        return;
      }
      void saveAvatar(avatar);
    };
    reader.onerror = () => setAvatarError("Fotoğraf okunamadı. Lütfen tekrar deneyin.");
    reader.readAsDataURL(blob);
  };

  const handleCropPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!imageDimensions) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      offsetX: cropOffset.x,
      offsetY: cropOffset.y,
    };
  };

  const handleCropPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId || !imageDimensions) return;
    setCropOffset(clampCropOffset(
      drag.offsetX + event.clientX - drag.x,
      drag.offsetY + event.clientY - drag.y,
      imageDimensions.width,
      imageDimensions.height,
      cropZoom,
    ));
  };

  const handleZoomChange = (zoom: number) => {
    if (!imageDimensions) return;
    const centeredX = CROP_SIZE / 2 - (CROP_SIZE / 2 - cropOffset.x) * zoom / cropZoom;
    const centeredY = CROP_SIZE / 2 - (CROP_SIZE / 2 - cropOffset.y) * zoom / cropZoom;
    setCropZoom(zoom);
    setCropOffset(clampCropOffset(centeredX, centeredY, imageDimensions.width, imageDimensions.height, zoom));
  };

  useEffect(() => {
    return () => {
      if (imageDraft.startsWith("blob:")) URL.revokeObjectURL(imageDraft);
    };
  }, [imageDraft]);

  useEffect(() => {
    if (!avatarSuccess) return;
    const timeout = window.setTimeout(() => setAvatarSuccess(""), 3500);
    return () => window.clearTimeout(timeout);
  }, [avatarSuccess]);

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

      await router.push("/login");
      logout();
    } catch (err: any) {
      setDeleteError(err.message || "Hesap silinirken bir hata oluştu.");
      setDeleteLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">

      <AnimatePresence>
        {avatarSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.96 }}
            role="status"
            aria-live="polite"
            className="fixed top-4 right-4 z-[110] flex items-center gap-3 px-4 py-3 bg-white dark:bg-gray-800 border border-green-200 dark:border-green-900/60 rounded-xl shadow-lg text-sm font-medium text-gray-800 dark:text-gray-100"
          >
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400">
              <Check className="w-4 h-4" />
            </span>
            {avatarSuccess}
          </motion.div>
        )}
      </AnimatePresence>

      <section className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center overflow-hidden text-white text-2xl font-bold flex-shrink-0 ${user.avatar && user.avatar.startsWith("data:image/") ? "bg-gray-100 dark:bg-gray-700" : "bg-blue-600"}`}>
            {user.avatar && user.avatar.startsWith("data:image/") ? (
              <img src={user.avatar} alt="Profil görseliniz" className="w-full h-full object-cover" />
            ) : isPresetAvatar(user.avatar) ? (
              <span aria-hidden="true">{user.avatar}</span>
            ) : (
              user.name.charAt(0).toUpperCase()
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">Profil Fotoğrafı</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {user.avatar ? "Profil görselinizi değiştirebilir veya kaldırabilirsiniz." : "Henüz bir profil görseli eklemediniz."}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setAvatarError("");
              setAvatarSuccess("");
              setIsAvatarModalOpen(true);
            }}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ImagePlus className="w-4 h-4" />
            Fotoğrafı düzenle
          </button>
        </div>
      </section>

      <AnimatePresence>
        {isAvatarModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-[80]"
            />
            <motion.section
              role="dialog"
              aria-modal="true"
              aria-labelledby="avatar-modal-title"
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed inset-0 z-[90] flex items-center justify-center p-3 sm:p-6"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden">
                <header className="flex items-center justify-between gap-4 px-5 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <div>
                    <h2 id="avatar-modal-title" className="text-lg font-bold text-gray-900 dark:text-white">Profil görselini düzenle</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Fotoğraf yükle veya hazır avatarlardan birini seç.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAvatarModalOpen(false)}
                    aria-label="Pencereyi kapat"
                    className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </header>

                <div className="overflow-y-auto p-5 sm:p-6 space-y-6">
                  <div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">Hazır avatarlar</p>
                    <div className="grid grid-cols-5 sm:grid-cols-10 gap-2" role="group" aria-label="Hazır avatar seçimi">
                      {PRESET_AVATARS.map((avatar, index) => (
                        <button
                          key={avatar}
                          type="button"
                          onClick={() => void saveAvatar(avatar)}
                          disabled={avatarLoading}
                          aria-label={`Hazır avatar ${index + 1}`}
                          aria-pressed={user.avatar === avatar}
                          className={`aspect-square rounded-xl text-2xl flex items-center justify-center border transition-colors disabled:opacity-50 ${user.avatar === avatar ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 ring-2 ring-blue-500/20" : "border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"}`}
                        >
                          {avatar}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleImageFile}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={avatarLoading}
                      className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 disabled:opacity-50"
                    >
                      <ImagePlus className="w-4 h-4" />
                      Fotoğraf yükle
                    </button>
                    <span className="text-xs text-gray-500 dark:text-gray-400">JPG, PNG veya WebP · 10 KB–5 MB</span>
                    {user.avatar && (
                      <button
                        type="button"
                        onClick={() => void saveAvatar(null)}
                        disabled={avatarLoading}
                        className="ml-auto px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                      >
                        Varsayılan simgeye dön
                      </button>
                    )}
                  </div>

                  {imageDraft && imageDimensions && (
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/40 rounded-xl border border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">Fotoğrafı kare olarak kırp</p>
                      <div
                        className="relative w-72 max-w-full aspect-square rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-900 cursor-grab active:cursor-grabbing touch-none mx-auto"
                        onPointerDown={handleCropPointerDown}
                        onPointerMove={handleCropPointerMove}
                        onPointerUp={() => { dragRef.current = null; }}
                        onPointerCancel={() => { dragRef.current = null; }}
                        aria-label="Kare fotoğraf kırpma alanı; fotoğrafı sürükleyerek konumlandırın"
                      >
                        <img
                          src={imageDraft}
                          alt="Kırpılacak fotoğraf"
                          draggable={false}
                          className="absolute max-w-none select-none pointer-events-none"
                          style={{
                            width: imageDimensions.width * Math.max(CROP_SIZE / imageDimensions.width, CROP_SIZE / imageDimensions.height) * cropZoom,
                            height: imageDimensions.height * Math.max(CROP_SIZE / imageDimensions.width, CROP_SIZE / imageDimensions.height) * cropZoom,
                            left: cropOffset.x,
                            top: cropOffset.y,
                          }}
                        />
                      </div>
                      <div className="mt-4 max-w-sm mx-auto">
                        <label htmlFor="avatar-zoom" className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-2">
                          Yakınlaştır
                        </label>
                        <input
                          id="avatar-zoom"
                          type="range"
                          min="1"
                          max="3"
                          step="0.01"
                          value={cropZoom}
                          onChange={(event) => handleZoomChange(Number(event.target.value))}
                          className="w-full accent-blue-600"
                        />
                      </div>
                      <div className="flex justify-end gap-2 mt-4">
                        <button
                          type="button"
                          onClick={() => {
                            setImageDraft("");
                            setImageDimensions(null);
                            setAvatarError("");
                          }}
                          disabled={avatarLoading}
                          className="px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50"
                        >
                          İptal
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleCrop()}
                          disabled={avatarLoading}
                          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                          {avatarLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                          {avatarLoading ? "Kaydediliyor..." : "Kırp ve kaydet"}
                        </button>
                      </div>
                    </div>
                  )}

                  {avatarError && (
                    <p className="text-sm text-red-600 dark:text-red-400" role="alert">{avatarError}</p>
                  )}
                </div>
              </div>
            </motion.section>
          </>
        )}
      </AnimatePresence>

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