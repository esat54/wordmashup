"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";

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
  const [user, setUser] = useState<DashboardUser | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebarOpen');
      return saved !== null ? JSON.parse(saved) : true;
    }
    return true;
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!token || !userData) {
      handleLogout();
      return;
    }

    try {
      setUser(JSON.parse(userData));
    } catch {
      handleLogout();
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('sidebarOpen', JSON.stringify(sidebarOpen));
  }, [sidebarOpen]);

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

  const isTester = user.email === "tester@gmail.com";

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AnimatePresence>
        <Sidebar
          variant="mobile"
          open={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          sidebarOpen={true}
          user={user}
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
        user={user}
        isTester={isTester}
        activePage={activePage}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader
          user={user}
          isTester={isTester}
          onLogout={handleLogout}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-7 overflow-y-auto">
          {children(user)}
        </main>
      </div>
    </div>
  );
}