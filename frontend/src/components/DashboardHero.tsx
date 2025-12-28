"use client";

import { useEffect, useState } from "react";
import { BookOpen, BarChart3, FileText, Home, Flame, Loader2 } from "lucide-react";
import { wordsApi } from "@/lib/api";


function StatCard({
  title,
  value,
  icon: Icon,
  color,
  loading,
}: {
  title: string;
  value: string;
  icon: any;
  color: "blue" | "green" | "yellow" | "purple" | "orange";
  loading?: boolean;
}) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    yellow: "bg-yellow-50 text-yellow-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600",
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-gray-600">{title}</p>
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="h-9 flex items-center">
        {loading ? (
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        ) : (
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        )}
      </div>
    </div>
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
    <button
      className={`${colorClasses[color]} text-white rounded-lg p-6 text-left transition-all active:scale-95`}
    >
      <Icon className="w-6 h-6 mb-3" />
      <h3 className="font-semibold text-lg mb-1">{label}</h3>
      <p className="text-sm text-white/90">{description}</p>
    </button>
  );
}


export default function DashboardHero({ user }: { user: { name: string; email: string } }) {
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({ totalWords: 0, favoriteWords: 0, streakCount: 0 });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const response = await wordsApi.getWords() as any;

      setTimeout(() => {
        setStats({
          totalWords: response.totalWords || 0,
          favoriteWords: response.favoriteWords || 0,
          streakCount: 999
        });
        setIsLoading(false);
      }, 300);

    } catch (error: any) {
      console.error("Veri yükleme hatası:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Hoş geldin, {user.name}! 👋
            </h1>
            <p className="text-lg text-gray-600">
              Kelime öğrenme yolculuğuna devam edin.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Toplam Kelime"
          value={stats.totalWords.toString()}
          icon={BookOpen}
          color="blue"
          loading={isLoading}
        />
        <StatCard
          title="Favori Kelimeler"
          value={stats.favoriteWords.toString()}
          icon={BarChart3}
          color="green"
          loading={isLoading}
        />
        <StatCard
          title="Günlük Seri"
          value={stats.streakCount.toString()}
          icon={Flame}
          color="orange"
          loading={isLoading}
        />
        <StatCard
          title="Bugün Eklenen"
          value="0"
          icon={Home}
          color="purple"
          loading={isLoading}
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
    </div>
  );
}