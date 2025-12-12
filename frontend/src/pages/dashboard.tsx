"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LogOut, 
  Menu, 
  X, 
  Home, 
  BookOpen, 
  Settings, 
  User,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  FileText
} from "lucide-react";

export default function DashboardPage() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      window.location.href = "/login";
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-600">Yükleniyor...</div>
      </div>
    );
  }

  const menuItems = [
    { icon: Home, label: "Ana Sayfa", href: "#", active: true },
    { icon: BookOpen, label: "Kelimelerim", href: "#" },
    { icon: FileText, label: "Kartlarım", href: "#" },
    { icon: BarChart3, label: "İstatistikler", href: "#" },
    { icon: Settings, label: "Ayarlar", href: "#" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-64 bg-white shadow-xl z-50 lg:hidden"
            >
              <SidebarContent
                user={user}
                menuItems={menuItems}
                onLogout={handleLogout}
                onClose={() => setMobileMenuOpen(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <aside
        className={`hidden lg:block bg-white border-r border-gray-200 transition-all duration-300 ease-in-out ${
          sidebarOpen ? "w-64" : "w-20"
        }`}
      >
        <SidebarContent
          user={user}
          menuItems={menuItems}
          onLogout={handleLogout}
          sidebarOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>

              <Link href="/" className="flex items-center">
                <span className="text-xl font-bold text-gray-900">
                  Word<span className="text-blue-600">Mashup</span>
                </span>
              </Link>

              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
                  <User className="w-4 h-4" />
                  <span className="font-medium text-gray-900">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Çıkış</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-7xl mx-auto"
          >
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8 mb-6">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                Hoş geldin, {user.name}! 👋
              </h1>
              <p className="text-lg text-gray-600">
                Kelime öğrenme yolculuğuna devam ediyoruz. Bugün hangi kelimeleri öğreneceksin?
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <StatCard
                title="Toplam Kelime"
                value="0"
                icon={BookOpen}
                color="blue"
              />
              <StatCard
                title="Öğrenilen"
                value="0"
                icon={BarChart3}
                color="green"
              />
              <StatCard
                title="Tekrar Gerekli"
                value="0"
                icon={FileText}
                color="yellow"
              />
              <StatCard
                title="Bugün Çalışılan"
                value="0"
                icon={Home}
                color="purple"
              />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Hızlı İşlemler
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <QuickActionButton
                  icon={BookOpen}
                  label="Yeni Kelime Ekle"
                  description="Kelime kartı oluştur"
                  color="blue"
                />
                <QuickActionButton
                  icon={FileText}
                  label="Kartları Gözden Geçir"
                  description="Tekrar zamanı gelen kartlar"
                  color="green"
                />
                <QuickActionButton
                  icon={BarChart3}
                  label="İlerlemeyi Gör"
                  description="Detaylı istatistikler"
                  color="purple"
                />
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}

function SidebarContent({
  user,
  menuItems,
  onLogout,
  sidebarOpen = true,
  onToggle,
  onClose,
}: {
  user: { name: string; email: string };
  menuItems: Array<{ icon: any; label: string; href: string; active?: boolean }>;
  onLogout: () => void;
  sidebarOpen?: boolean;
  onToggle?: () => void;
  onClose?: () => void;
}) {
  return (
    <div className="h-full flex flex-col">
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
        {sidebarOpen && (
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold text-gray-900">
              Word<span className="text-blue-600">Mashup</span>
            </span>
          </Link>
        )}
        {onToggle && (
          <button
            onClick={onToggle}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          >
            {sidebarOpen ? (
              <ChevronLeft className="w-5 h-5" />
            ) : (
              <ChevronRight className="w-5 h-5" />
            )}
          </button>
        )}
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="p-4 border-b border-gray-200">
        <div className={`flex items-center gap-3 ${!sidebarOpen && "justify-center"}`}>
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          {sidebarOpen && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {user.name}
              </p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <li key={index}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    item.active
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && <span className="text-sm">{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={onLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors ${
            !sidebarOpen && "justify-center"
          }`}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {sidebarOpen && <span className="text-sm font-medium">Çıkış Yap</span>}
        </button>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: string;
  icon: any;
  color: "blue" | "green" | "yellow" | "purple";
}) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    yellow: "bg-yellow-50 text-yellow-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-gray-600">{title}</p>
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </motion.div>
  );
}

function QuickActionButton({
  icon: Icon,
  label,
  description,
  color,
}: {
  icon: any;
  label: string;
  description: string;
  color: "blue" | "green" | "purple";
}) {
  const colorClasses = {
    blue: "bg-blue-600 hover:bg-blue-700",
    green: "bg-green-600 hover:bg-green-700",
    purple: "bg-purple-600 hover:bg-purple-700",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${colorClasses[color]} text-white rounded-lg p-6 text-left transition-colors`}
    >
      <Icon className="w-6 h-6 mb-3" />
      <h3 className="font-semibold text-lg mb-1">{label}</h3>
      <p className="text-sm text-white/90">{description}</p>
    </motion.button>
  );
}
