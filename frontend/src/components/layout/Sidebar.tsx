

import { motion } from "framer-motion";
import Link from "next/link";
import { BookOpen, ChevronLeft, ChevronRight, FileMinus, FileSearch, FileText, Home, LogOut, Settings, } from "lucide-react";

import type { DashboardPageKey } from "@/components/layout/DashboardLayout";

interface SidebarProps {
  user: { name: string; email: string };
  isTester: boolean;
  activePage: DashboardPageKey;
  onLogout: () => void;
  sidebarOpen?: boolean;
  onToggle?: () => void;
  variant: "desktop" | "mobile";
  open: boolean;
  onClose?: () => void;
}

const menuItems: {
  icon: React.ComponentType<{ size?: number | string; className?: string }>;
  label: string;
  href: string;
  key: DashboardPageKey;
}[] = [
    { icon: Home, label: "Anasayfa", href: "/dashboard", key: "home" },
    { icon: BookOpen, label: "Kelimelerim", href: "/dashboard/kelimeler", key: "words" },
    { icon: FileText, label: "Oxford Liste", href: "/dashboard/oxfordliste", key: "oxford" },
    { icon: FileSearch, label: "Sözlük", href: "/dashboard/sozluk", key: "dictionary" },
    { icon: FileMinus, label: "Gramer", href: "/dashboard/gramer", key: "grammar" },
    { icon: Settings, label: "Ayarlar", href: "/dashboard/ayarlar", key: "settings" },
  ];

export default function Sidebar({ user, isTester, activePage, onLogout, sidebarOpen = true, onToggle, variant, open, onClose, }: SidebarProps) {
  const content = (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="h-16 flex-shrink-0 flex items-center px-4 border-b border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="flex items-center min-w-0 w-full">
          <div
            className={`transition-all duration-300 flex items-center overflow-hidden ${sidebarOpen ? "opacity-100 w-auto" : "opacity-0 w-0"
              }`}
          >
            <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight whitespace-nowrap">
              Word<span className="text-blue-600 dark:text-blue-400">Mashup</span>
            </span>
          </div>
          <div className="ml-auto">
            {onToggle && (
              <button
                onClick={onToggle}
                className="p-2 rounded-lg text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {sidebarOpen ? (
                  <ChevronLeft size={23} />
                ) : (
                  <ChevronRight size={25} className="mr-0.5" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="flex items-center ml-1 ">
          <div className="w-10 h-10 rounded-xl flex-shrink-0 bg-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-100 dark:shadow-blue-900/30">
            {isTester ? "T" : user.name.charAt(0).toUpperCase()}
          </div>
          <div
            className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${sidebarOpen ? "opacity-100 max-w-xs ml-3" : "opacity-0 max-w-0 ml-0"
              }`}
          >
            <p className="text-sm font-bold text-gray-700 dark:text-gray-200 truncate">
              {isTester ? "Deneme Hesabı" : user.name}
            </p>
            <p className="text-[13px] text-gray-500 dark:text-gray-400 truncate font-medium">
              {isTester ? "" : user.email}
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isDisabled = isTester && item.key === "settings";
          const isActive = activePage === item.key;

          return (
            <div key={item.key} className="relative group/item">
              <Link
                href={isDisabled ? "#" : item.href}
                onClick={(e) => {
                  if (isDisabled) {
                    e.preventDefault();
                    e.stopPropagation();
                    return;
                  }
                  if (variant === "mobile" && onClose) {
                    onClose();
                  }
                }}
                className={`w-full flex items-center px-3 py-3 rounded-xl transition-all font-semibold text-sm overflow-hidden 
                ${isActive
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                    : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                  }
                ${isDisabled ? "opacity-40 cursor-not-allowed pointer-events-auto" : ""}`}
              >
                <div className="relative flex items-center justify-center ml-1.5">
                  <Icon
                    size={21}
                    className={`flex-shrink-0 ${isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-400 dark:text-gray-500"
                      }`}
                  />
                </div>
                <span
                  className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${sidebarOpen ? "opacity-100 max-w-xs ml-3" : "opacity-0 max-w-0 ml-0"
                    }`}
                >
                  {item.label}
                </span>
              </Link>
            </div>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100 dark:border-gray-700">
        <button
          onClick={onLogout}
          className="w-full flex items-center px-3 py-2.5 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all font-bold text-sm overflow-hidden"
        >
          <LogOut size={21} className="flex-shrink-0" />
          <span
            className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${sidebarOpen ? "opacity-100 max-w-xs ml-3" : "opacity-0 max-w-0 ml-0"
              }`}
          >
            Oturumu Kapat
          </span>
        </button>
      </div>
    </div>
  );

  if (variant === "desktop") {
    return (
      <aside
        className={`hidden lg:block sticky top-0 h-screen transition-all duration-300 ease-in-out ${sidebarOpen ? "w-64" : "w-20"
          }`}
      >
        {content}
      </aside>
    );
  }

  if (!open) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
      />
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        exit={{ x: -300 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed left-0 top-0 bottom-0 w-64 shadow-xl z-50 lg:hidden"
      >
        {content}
      </motion.div>
    </>
  );
}