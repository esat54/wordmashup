"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { LogOut, Menu, X, Home, BookOpen, Settings, User, ChevronLeft, ChevronRight, FileText, FileSearch, FileMinus } from "lucide-react";

import WordsPage from "@/components/WordsPage";
import SettingsPage from "@/components/SettingsPage";
import DashboardHero from "@/components/DashboardHero";
import DictionaryPage from "@/components/DictionaryPage";
import GramerPage from "@/components/GramerPage";
import OxfordListPage from "@/components/OxfordListPage";
import GrammarDetailPage from "@/components/GrammarDetailPage";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("home");
  const [grammarDetailId, setGrammarDetailId] = useState<string | null>(null);

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
    { icon: FileText, label: "Oxford Liste", href: "oxford", active: currentPage === "oxford" },
    { icon: FileSearch, label: "Sözlük", href: "dictionary", active: currentPage === "dictionary" },
    { icon: FileMinus, label: "Gramer", href: "grammar", active: currentPage === "grammar" },
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
                onPageChange={(page: string) => {
                  setCurrentPage(page);
                  setMobileMenuOpen(false);
                }}
                grammarDetailId={grammarDetailId}
                setGrammarDetailId={setGrammarDetailId}
                setCurrentPage={setCurrentPage}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <aside className={`hidden lg:block bg-white border-r border-gray-200 sticky top-0 h-screen transition-all duration-300 ease-in-out ${sidebarOpen ? "w-64" : "w-20"}`}>
        <SidebarContent
          user={user}
          menuItems={menuItems}
          onLogout={handleLogout}
          sidebarOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          onPageChange={setCurrentPage}
          grammarDetailId={grammarDetailId}
          setGrammarDetailId={setGrammarDetailId}
          setCurrentPage={setCurrentPage}
        />
      </aside>  {/* Sidebar */}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 px-4 sm:px-6 lg:px-7 pt-4 pb-4 lg:pb-0">
          <div className="max-w-7xl mx-auto bg-white border border-gray-200 shadow-sm rounded-xl h-16 px-4 flex items-center justify-between">

            <div className="flex items-center gap-4 flex-1">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>

              <div className="hidden lg:flex items-center relative max-w-md w-full">
                <div className="absolute left-3 text-gray-400">
                  <FileSearch size={18} />
                </div>
                <input
                  type="text"
                  placeholder="Kelime veya konu ara..."
                  className="w-full bg-gray-50 border border-gray-200 text-sm rounded-lg pl-10 pr-4 py-2 outline-none 
           focus:bg-white focus:border-gray-300 focus:shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgba(0,0,0,0.1)] 
           focus:ring-0 transition-all placeholder:text-gray-400"                />
                <div className="absolute right-3 text-[10px] font-bold text-gray-400 border border-gray-200 px-1.5 py-0.5 rounded bg-white select-none">
                  ⌘ K
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center lg:hidden flex-1">
              <span className="text-xl font-bold text-gray-900 tracking-tight">
                Word<span className="text-blue-600">Mashup</span>
              </span>
            </div>

            <div className="flex items-center justify-end gap-3 flex-1">
              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-100">
                <User size={14} className="text-gray-400" />
                <span className="font-semibold text-gray-900">{user.name}</span>
              </div>

              <button
                onClick={handleLogout}
                title="Çıkış Yap"
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all border border-transparent hover:border-red-100"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-7 overflow-y-auto">     {/* current page selector*/}
          {currentPage === "words" && <WordsPage />}
          {currentPage === "dictionary" && <DictionaryPage />}
          {currentPage === "grammar" && !grammarDetailId && <GramerPage onGrammarClick={(id, slug) => {
            setGrammarDetailId(id);
            setCurrentPage("grammar-detail");
            const newUrl = `/dashboard/${slug}`;
            window.history.pushState({}, '', newUrl);
          }} />}
          {((currentPage === "grammar-detail" && grammarDetailId) || (currentPage === "grammar" && grammarDetailId)) && (
            <GrammarDetailPage
              grammarId={grammarDetailId}
              onBack={() => {
                setGrammarDetailId(null);
                setCurrentPage("grammar");
                window.history.pushState({}, '', '/dashboard');
              }}
            />
          )}
          {currentPage === "oxford" && <OxfordListPage />}
          {currentPage === "settings" && <SettingsPage user={user} />}
          {currentPage === "home" && <DashboardHero />}
        </main>
      </div>
    </div>
  );
}

function SidebarContent({ user, menuItems, onLogout, sidebarOpen = true, onToggle, onClose, onPageChange, }: any) {
  return (
    <div className="h-full flex flex-col">
      <div className="h-16 flex-shrink-0 flex items-center px-4 border-b border-gray-100 overflow-hidden">      {/* logo  */}
        <div className="flex items-center min-w-0 w-full">
          <div className={`transition-all duration-300 flex items-center overflow-hidden ${sidebarOpen ? "opacity-100 w-auto" : "opacity-0 w-0"}`}>
            <span className="text-xl font-bold text-gray-900 tracking-tight whitespace-nowrap">
              Word<span className="text-blue-600">Mashup</span>
            </span>
          </div>
          <div className="ml-auto">
            {onToggle && (
              <button onClick={onToggle} className="p-2 rounded-lg  text-gray-400 hover:bg-gray-100 transition-colors">
                {sidebarOpen ? <ChevronLeft size={23} /> : <ChevronRight size={25} className="mr-0.5" />}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 bg-gray-50/50 border-b border-gray-100 overflow-hidden">  {/* character icon */}
        <div className="flex items-center ml-1 ">
          <div className="w-10 h-10 rounded-xl flex-shrink-0 bg-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-100">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${sidebarOpen ? "opacity-100 max-w-xs ml-3" : "opacity-0 max-w-0 ml-0"
            }`}>
            <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
            <p className="text-[13px] text-gray-500 truncate font-medium">{user.email}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-1 ">        {/* menu list */}
        {menuItems.map((item: any, index: number) => {
          const Icon = item.icon;
          return (
            <button
              key={index}
              onClick={() => onPageChange(item.href)}
              className={`w-full flex items-center px-3 py-3 rounded-xl transition-all font-semibold text-sm overflow-hidden 
                ${item.active ? "bg-blue-50 text-blue-600" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}`}
            >
              <Icon size={21} className={`flex-shrink-0 ml-1.5 ${item.active ? "text-blue-600" : "text-gray-400"}`} />
              <span className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${sidebarOpen ? "opacity-100 max-w-xs ml-3" : "opacity-0 max-w-0 ml-0"
                }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100">     {/* logout button */}
        <button
          onClick={onLogout}
          className="w-full flex items-center px-3 py-2.5 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all font-bold text-sm overflow-hidden"
        >
          <LogOut size={21} className="flex-shrink-0" />
          <span className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${sidebarOpen ? "opacity-100 max-w-xs ml-3" : "opacity-0 max-w-0 ml-0"
            }`}>
            Oturumu Kapat
          </span>
        </button>
      </div>
    </div>
  );
}