"use client";

import { LogOut, Menu, User, FileSearch } from "lucide-react";

interface DashboardHeaderProps {
  user: { name: string; email: string };
  isTester: boolean;
  onLogout: () => void;
  onOpenMobileMenu: () => void;
}

export default function DashboardHeader({ user, isTester, onLogout, onOpenMobileMenu, }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-30 px-4 sm:px-6 lg:px-7 pt-4 pb-4 lg:pb-0">
      <div className="max-w-7xl mx-auto bg-white border border-gray-200 shadow-sm rounded-xl h-16 px-4 flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <button
            onClick={onOpenMobileMenu}
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
              className="w-full bg-gray-50 text-sm rounded-lg pl-10 pr-4 py-2  border border-gray-200  transition hover:shadow-[0_0_3px_0_rgba(0,0,0,0.12)] outline-none placeholder:text-gray-400"
            />
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
          {isTester ? (
            <div className="hidden sm:flex items-center gap-2.5 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-xl shadow-sm select-none">
              <div className="relative flex items-center justify-center">
                <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                <div className="absolute w-2 h-2 bg-indigo-400 rounded-full" />
              </div>
              <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-[0.15em]">
                TEST ACCOUNT
              </span>
            </div>
          ) : (
            <>
              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-100">
                <User size={14} className="text-gray-400" />
                <span className="font-semibold text-gray-900">{user.name}</span>
              </div>

              <button
                onClick={onLogout}
                title="Çıkış Yap"
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all border border-transparent hover:border-red-100"
              >
                <LogOut size={20} />
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}