"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import { LogOut, Menu, X, Home, BookOpen, Settings, User, ChevronLeft, ChevronRight, BarChart3, FileText, FileSearch } from "lucide-react";

import WordsPage from "@/components/WordsPage";
import StatsPage from "@/components/StatsPage";
import SettingsPage from "@/components/SettingsPage";
import CardsPage from "@/components/CardsPage";
import DashboardHero from "@/components/DashboardHero";
import DictionaryPage from "@/components/DictionaryPage";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("home");

  useEffect(() => {  // Validation 
    const userData = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!token || !userData) {
      handleLogout();
      return;
    }

    try {
      setUser(JSON.parse(userData));
    } catch (e) {
      handleLogout();
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-600 animate-pulse">Yükleniyor...</div>
      </div>
    );
  }

  const menuItems = [
    { icon: Home, label: "Anasayfa", href: "home", active: currentPage === "home" },
    { icon: BookOpen, label: "Kelimelerim", href: "words", active: currentPage === "words" },
    { icon: FileSearch, label: "Sözlük", href: "dictionary", active: currentPage === "dictionary" },
    { icon: FileText, label: "Kartlarım", href: "cards", active: currentPage === "cards" },
    { icon: BarChart3, label: "İstatistikler", href: "stats", active: currentPage === "stats" },
    { icon: Settings, label: "Ayarlar", href: "settings", active: currentPage === "settings" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AnimatePresence>    {/* Mobile Menu */}
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
                onPageChange={(page) => {
                  setCurrentPage(page);
                  setMobileMenuOpen(false);
                }}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <aside className={`hidden lg:block bg-white border-r border-gray-200 sticky top-0 h-screen transition-all duration-300 ${sidebarOpen ? "w-64" : "w-20"}`}>
        <SidebarContent
          user={user}
          menuItems={menuItems}
          onLogout={handleLogout}
          sidebarOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          onPageChange={setCurrentPage}
        />
      </aside>  {/* Sidebar */}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">   {/* Header */}
          <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between lg:justify-end">
            <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100">
              <Menu className="w-6 h-6" />
            </button>
            <span className="text-xl font-bold text-gray-900 lg:hidden">
              Word<span className="text-blue-600">Mashup</span>
            </span>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span className="font-medium text-gray-900">{user.name}</span>
              </div>
              <button onClick={handleLogout} className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Çıkış</span>
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-7 overflow-y-auto">     {/* Current Page Selector*/}
          {currentPage === "words" && <WordsPage />}
          {currentPage === "dictionary" && <DictionaryPage />}
          {currentPage === "cards" && <CardsPage />}
          {currentPage === "stats" && <StatsPage />}
          {currentPage === "settings" && <SettingsPage user={user} />}
          {currentPage === "home" && <DashboardHero user={user} />}
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
  onPageChange,
}: {
  user: { name: string; email: string };
  menuItems: Array<{ icon: any; label: string; href: string; active?: boolean }>;
  onLogout: () => void;
  sidebarOpen?: boolean;
  onToggle?: () => void;
  onClose?: () => void;
  onPageChange?: (page: string) => void;
}) {
  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      <div className="h-16 flex-shrink-0 flex items-center justify-between px-4 border-b border-gray-200">
        {sidebarOpen && (
          <span className="text-xl font-bold text-gray-900">
            Word<span className="text-blue-600">Mashup</span>
          </span>
        )}
        {onToggle && (
          <button
            onClick={onToggle}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          >
            {sidebarOpen ? (
              <ChevronLeft className="w-5 h-5" />
            ) : (
              <ChevronRight className="w-5 h-5 ml-1" />
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

      <div className="p-4 flex-shrink-0 border-b border-gray-200 bg-white">
        <div className={`flex items-center gap-3 ${!sidebarOpen && "justify-center"}`}>
          <div className="w-10 h-10 rounded-full flex-shrink-0 bg-blue-600 flex items-center justify-center text-white font-semibold">
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

      <nav className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-200">
        <ul className="space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <li key={index}>
                <button
                  onClick={() => onPageChange && onPageChange(item.href)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${item.active
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                    }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && <span className="text-sm">{item.label}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 flex-shrink-0 border-t border-gray-200 bg-white">
        <button
          onClick={onLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors 
            ${!sidebarOpen && "justify-center"}`}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {sidebarOpen && <span className="text-sm font-medium">Çıkış</span>}
        </button>
      </div>
    </div>
  );
}
