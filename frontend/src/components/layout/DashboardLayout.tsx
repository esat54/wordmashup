import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

import Sidebar from "@/components/layout/Sidebar";
import DashboardHeader from "@/components/layout/Header";

export type DashboardPageKey =
  | "home"
  | "words"
  | "dictionary"
  | "grammar"
  | "oxford"
  | "settings";

interface DashboardUser {
  name: string;
  email: string;
}

interface DashboardLayoutProps {
  activePage: DashboardPageKey;
  children: (user: DashboardUser) => React.ReactNode;
}

export default function DashboardLayout({ activePage, children, }: DashboardLayoutProps) {
  const router = useRouter();
  const { user, isTester, isLoggedIn, logout } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebarOpen');
      return saved !== null ? JSON.parse(saved) : true;
    }
    return true;
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('sidebarOpen', JSON.stringify(sidebarOpen));
  }, [sidebarOpen]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400 animate-pulse">Yükleniyor...</div>
      </div>
    );
  }

  const dashboardUser: DashboardUser = { name: user.name || '', email: user.email || '' };

  const pageTitles: Record<DashboardPageKey, string> = {
    home: "Genel Bakış",
    words: "Kelimelerim",
    dictionary: "Sözlük",
    grammar: "Gramer",
    oxford: "Oxford Liste",
    settings: "Ayarlar"
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <AnimatePresence>
        <Sidebar
          variant="mobile"
          open={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          sidebarOpen={true}
          user={dashboardUser}
          isTester={isTester}
          activePage={activePage}
          onLogout={handleLogout}
        />
      </AnimatePresence>

      <Sidebar
        variant="desktop"
        open={true}
        sidebarOpen={sidebarOpen}
        onToggle={() => setSidebarOpen((prev: boolean) => !prev)}
        user={dashboardUser}
        isTester={isTester}
        activePage={activePage}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader
          user={dashboardUser}
          isTester={isTester}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          pageTitle={pageTitles[activePage]}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-7 overflow-y-auto">
          {children(dashboardUser)}
        </main>
      </div>
    </div>
  );
}