"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Flame, BarChart3, PieChart, BookOpen, Heart, FileText, Calendar, ArrowRight, BookMarked, Infinity } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Legend } from "recharts";
import { wordsApi, grammarApi } from "@/lib/api";

interface DailyStat {
  date: string;
  count: number;
}

interface TypeStat {
  type: string;
  name: string;
  count: number;
}

interface Word {
  _id: string;
  text: string;
  translation: string;
  type: string;
  favorite: boolean;
  createdAt: string;
}

interface Grammar {
  _id: string;
  title: string;
  category: string;
  description: string;
  createdAt: string;
}

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4', '#6366f1'];

export default function DashboardHero({ user, onPageChange }: { user: { name: string; email: string }; onPageChange?: (page: string) => void }) {
  const router = useRouter();
  const isTester = user?.email === "tester@gmail.com";

  const [dailyStats, setDailyStats] = useState<DailyStat[]>([]);
  const [typeStats, setTypeStats] = useState<TypeStat[]>([]);
  const [totalWords, setTotalWords] = useState(0);
  const [streak, setStreak] = useState(0);
  const [favoriteWords, setFavoriteWords] = useState(0);
  const [todayWords, setTodayWords] = useState(0);
  const [totalGrammars, setTotalGrammars] = useState(0);
  const [recentWords, setRecentWords] = useState<Word[]>([]);
  const [recentGrammars, setRecentGrammars] = useState<Grammar[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoading(true);

        const [dailyStatsRes, typeStatsRes, streakRes, wordsRes, grammarRes] = await Promise.all([
          wordsApi.getLast7DaysStats().catch(() => ({ dailyStats: [] })),
          wordsApi.getTypeStats().catch(() => ({ typeStats: [], totalWords: 0 })),
          wordsApi.getStreak().catch(() => ({ streak: 0 })),
          wordsApi.getWords({ limit: 5 }).catch(() => ({ words: [], totalWords: 0, favoriteWords: 0 })),
          grammarApi.getAllGrammars().catch(() => ({ grammars: [], count: 0 }))
        ]);

        setDailyStats((dailyStatsRes as { dailyStats: DailyStat[] }).dailyStats || []);

        const typeStatsData = typeStatsRes as { typeStats: TypeStat[]; totalWords: number };
        setTypeStats(typeStatsData.typeStats || []);
        setTotalWords(typeStatsData.totalWords || 0);

        setStreak((streakRes as { streak: number }).streak || 0);

        const wordsData = wordsRes as { words: Word[]; totalWords: number; favoriteWords: number };
        setRecentWords(wordsData.words || []);
        setFavoriteWords(wordsData.favoriteWords || 0);

        const grammarData = grammarRes as { grammars: Grammar[]; count: number };
        setTotalGrammars(grammarData.count || 0);
        setRecentGrammars((grammarData.grammars || []).slice(0, 3));

        const today = new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' });
        const todayData = (dailyStatsRes as { dailyStats: DailyStat[] }).dailyStats?.find(stat => stat.date === today);
        setTodayWords(todayData?.count || 0);

      } catch (error) {
        console.error("Veriler yüklenirken hata:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-4 antialiased">

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {isLoading ? (
            <div className="flex-1">
              <div className="h-8 bg-gray-200 rounded animate-pulse w-48 mb-2"></div>
              <div className="h-4 bg-gray-100 rounded animate-pulse w-40"></div>
            </div>
          ) : isTester ? (
            <div className="flex-1">
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                Hoş Geldiniz! ✨
              </h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-1">
                <p className="text-sm text-gray-500 font-medium">
                  Tam erişim için hemen{" "}
                  <button
                    type="button"
                    onClick={() => router.push('/register')}
                    className="text-sm text-indigo-600 font-bold hover:text-indigo-700 transition-colors underline underline-offset-4"
                  >
                    kayıt olun
                  </button>
                </p>
              </div>
            </div>
          ) : (
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                Merhaba, {user?.name?.split(' ')[0]}! 👋
              </h1>
              <p className="text-sm text-gray-500 font-medium mt-1">Öğrenme yolculuğuna devam et.</p>
            </div>
          )}

          {isLoading ? ( //badge
            <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 pl-2 pr-4 py-1.5 rounded-full">
              <div className="bg-gray-300 p-1.5 rounded-full shadow-sm animate-pulse">
                <Flame size={16} className="text-gray-400" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-gray-400 whitespace-nowrap">Yükleniyor...</span>
              </div>
            </div>
          ) : isTester ? (
            <div className="flex items-center gap-3 bg-gray-50/50 border border-gray-200 pl-2 pr-4 py-1.5 rounded-full shadow-sm">
              <div className="bg-gray-400 p-1.5 rounded-full shadow-sm">
                <Flame size={16} className="text-gray-300" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-gray-500 whitespace-nowrap">
                  Seri: <span className="mx-2">--</span> Gün
                </span>
              </div>
            </div>
          ) : streak > 0 ? (
            <div className="flex items-center gap-3 bg-orange-50/50 border border-orange-100 pl-2 pr-4 py-1.5 rounded-full shadow-sm">
              <div className="bg-orange-500 p-1.5 rounded-full shadow-sm">
                <Flame size={16} className="text-white fill-orange-200" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-orange-700 whitespace-nowrap">Seri: {streak} Gün</span>
                <div className="w-1.5 h-1.5 rounded-full bg-orange-200" />
                <span className="text-[11px] font-bold text-orange-600/80 tracking-tight whitespace-nowrap">Kelime Avcısı</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 bg-gray-50/50 border border-gray-200 pl-2 pr-4 py-1.5 rounded-full shadow-sm">
              <div className="bg-gray-400 p-1.5 rounded-full shadow-sm">
                <Flame size={16} className="text-gray-300" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-gray-500 whitespace-nowrap">Seri: 0 Gün</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gray-100 rounded-lg animate-pulse flex-shrink-0">
                  <div className="w-5 h-5"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="h-7 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-3 bg-gray-100 rounded animate-pulse w-20"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 hover:shadow transition-all group">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gray-50 rounded-lg group-hover:bg-gray-100 transition-colors flex-shrink-0">
                <BookOpen size={20} className="text-gray-700" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-2xl font-black text-gray-900">{totalWords}</div>
                <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Toplam Kelime</div>
              </div>
            </div>
          </div>  {/* total words */}

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 hover:shadow transition-all group">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gray-50 rounded-lg group-hover:bg-gray-100 transition-colors flex-shrink-0">
                <Heart size={20} className="text-gray-700" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-2xl font-black text-gray-900">{favoriteWords}</div>
                <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Toplam Favori</div>
              </div>
            </div>
          </div>  {/* total favorite words */}

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 hover:shadow transition-all group">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gray-50 rounded-lg group-hover:bg-gray-100 transition-colors flex-shrink-0">
                <FileText size={20} className="text-gray-700" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-2xl font-black text-gray-900">{totalGrammars}</div>
                <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Toplam Gramer</div>
              </div>
            </div>
          </div>  {/* total grammar */}

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 hover:shadow transition-all group">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gray-50 rounded-lg group-hover:bg-gray-100 transition-colors flex-shrink-0">
                <Calendar size={20} className="text-gray-700" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-2xl font-black text-gray-900">{todayWords}</div>
                <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Toplam Bugün</div>
              </div>
            </div>
          </div>  {/* total today words */}
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-5 h-[320px] flex flex-col">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-32 mb-4"></div>
            <div className="flex-1 bg-gray-50 rounded-lg animate-pulse"></div>
          </div>
          <div className="sm:col-span-1 bg-white rounded-xl border border-gray-200 shadow-sm p-5 h-[320px] flex flex-col">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-24 mb-4"></div>
            <div className="flex-1 bg-gray-50 rounded-lg animate-pulse"></div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          <div className="sm:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-5 h-[320px] flex flex-col">  {/* 7 günlük analiz */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <BarChart3 size={14} className="text-blue-500" /> 7 GÜNLÜK ANALİZ
              </h3>
            </div>
            {isLoading ? (
              <div className="flex-1 bg-slate-50/50 rounded-lg border border-dashed border-gray-200 flex items-center justify-center">
                <div className="w-full h-full flex items-center justify-center">
                  <div className="space-y-2 w-full px-4">
                    {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                      <div key={i} className="h-8 bg-gray-200 rounded animate-pulse" style={{ width: `${Math.random() * 40 + 30}%` }}></div>
                    ))}
                  </div>
                </div>
              </div>
            ) : dailyStats.length > 0 ? (
              <div className="flex-1 [&_*]:outline-none [&_*]:focus:outline-none">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={dailyStats}
                    margin={{ top: 5, right: 10, left: 5, bottom: 5 }}
                    barCategoryGap="20%"
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#f0f0f0"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="date"
                      type="category"
                      interval={0}
                      tick={{ fontSize: 11, fill: '#6b7280' }}
                      stroke="#d1d5db"
                      tickMargin={8}
                      padding={{ left: 10, right: 10 }}
                    />
                    <YAxis
                      hide={true}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '12px',
                        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                      }}
                      labelStyle={{ color: '#374151', fontWeight: 'bold' }}
                      formatter={(value: number | undefined) => [value || 0, 'Eklenen Kelime']}
                    />
                    <Bar
                      dataKey="count"
                      fill="#3b82f6"
                      radius={[8, 8, 0, 0]}
                      stroke="none"
                      barSize={30}
                      activeBar={{ stroke: 'none', strokeWidth: 0 }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex-1 bg-slate-50/50 rounded-lg border border-dashed border-gray-200 flex items-center justify-center text-gray-400 text-xs italic">
                Henüz veri yok
              </div>
            )}
          </div>

          <div className="sm:col-span-1 bg-white rounded-xl border border-gray-200 shadow-sm p-5 h-[320px] flex flex-col">  {/* type distribution */}
            <div className="mb-4">
              <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <PieChart size={14} className="text-purple-500" /> TÜR DAĞILIMI
              </h3>
            </div>
            {isLoading ? (
              <div className="flex-1 bg-slate-50/50 rounded-lg border border-dashed border-gray-200 flex items-center justify-center">
                <div className="w-32 h-32 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
            ) : typeStats.length > 0 ? (
              <div className="flex-1 flex flex-col">
                <div className="flex-1 min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={typeStats as any}
                        cx="50%"
                        cy="45%"
                        labelLine={false}
                        label={false}
                        outerRadius={70}
                        fill="#8884d8"
                        dataKey="count"
                        isAnimationActive={false}
                      >
                        {typeStats.map((entry, index) => {
                          let color = COLORS[index % COLORS.length];
                          if (entry.type === 'verb') color = '#ef4444';
                          else if (entry.type === 'preposition') color = '#3b82f6';
                          return <Cell key={`cell-${index}`} fill={color} />;
                        })}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '12px',
                          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                        }}
                        formatter={(value: number | undefined, name: string | undefined, props: any) => {
                          const payload = props?.payload;
                          const typeName = payload?.name || typeStats.find(stat => stat.count === value)?.name || name || '';
                          return [value || 0, typeName];
                        }}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-2 space-y-1.5">
                  <div className="text-xs font-bold text-gray-700">
                    Toplam: {totalWords}
                  </div>
                  <div className={`grid ${typeStats.length > 5 ? 'grid-cols-2' : 'grid-cols-1'} gap-x-3 gap-y-1 max-h-24 overflow-y-auto`}>
                    {typeStats.map((stat, index) => {
                      let color = COLORS[index % COLORS.length];
                      if (stat.type === 'verb') color = '#ef4444';
                      else if (stat.type === 'preposition') color = '#3b82f6';
                      return (
                        <div key={stat.type} className="flex items-center justify-between text-[10px]">
                          <div className="flex items-center gap-1.5">
                            <div
                              className="w-2 h-2 rounded-full flex-shrink-0"
                              style={{ backgroundColor: color }}
                            />
                            <span className="text-gray-600 font-medium">{stat.name}:</span>
                          </div>
                          <span className="text-gray-800 font-bold">{stat.count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 bg-slate-50/50 rounded-lg border border-dashed border-gray-200 flex items-center justify-center text-gray-400 text-xs italic">
                Henüz veri yok
              </div>
            )}
          </div>

        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="h-5 bg-gray-200 rounded animate-pulse w-40 mb-4"></div>
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 bg-gray-50 rounded-lg animate-pulse" />
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <div className="h-5 bg-gray-200 rounded animate-pulse w-32 mb-4"></div>
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-gray-50 rounded-lg animate-pulse" />
                ))}
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <div className="h-5 bg-gray-200 rounded animate-pulse w-24 mb-4"></div>
              <div className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-12 bg-gray-50 rounded-lg animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <BookOpen size={16} className="text-blue-500" /> Son Eklenen Kelimeler
              </h3>
              {onPageChange && (
                <button
                  onClick={() => onPageChange('words')}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                >
                  Tümünü Gör <ArrowRight size={12} />
                </button>
              )}
            </div>
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-12 bg-gray-50 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : recentWords.length > 0 ? (
              <div className="space-y-2">
                {recentWords.map((word) => {
                  const typeNames: { [key: string]: string } = {
                    'verb': 'Fiil',
                    'noun': 'İsim',
                    'adjective': 'Sıfat',
                    'adverb': 'Zarf',
                    'preposition': 'Edat',
                    'conjunction': 'Bağlaç',
                    'pronoun': 'Zamir',
                    'other': 'Diğer'
                  };
                  const typeName = typeNames[word.type] || word.type;

                  return (
                    <div
                      key={word._id}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900 mb-0.5">{word.text}</div>
                        <div className="text-xs text-gray-500">{word.translation}</div>
                      </div>
                      {word.favorite && (
                        <Heart size={16} className="text-red-500 fill-red-500 flex-shrink-0" />
                      )}
                      <span className="text-xs px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full font-medium whitespace-nowrap flex-shrink-0">
                        {typeName}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400 text-sm">Henüz kelime eklenmemiş</div>
            )}
          </div>  {/* recently added words */}

          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <FileText size={16} className="text-gray-500" /> Son Gramer Kartları
                </h3>
                {onPageChange && (
                  <button
                    onClick={() => onPageChange('grammar')}
                    className="text-xs text-gray-600 hover:text-gray-700 font-medium flex items-center gap-1"
                  >
                    Tümünü Gör <ArrowRight size={12} />
                  </button>
                )}
              </div>
              {isLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 bg-gray-50 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : recentGrammars.length > 0 ? (
                <div className="space-y-2">
                  {recentGrammars.map((grammar) => (
                    <div
                      key={grammar._id}
                      className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                      onClick={() => onPageChange && onPageChange('grammar')}
                    >
                      <div className="font-semibold text-gray-900 text-sm mb-1">{grammar.title}</div>
                      <div className="text-xs text-gray-500 line-clamp-2">{grammar.description || grammar.category}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-400 text-xs">Henüz gramer kartı eklenmemiş</div>
              )}
            </div>  {/* recently added grammars */}

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">  {/* quick links */}
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-4">
                <BookMarked size={16} className="text-gray-500" /> Hızlı Linkler
              </h3>
              <div className="space-y-2">
                {onPageChange && (
                  <>
                    <button
                      onClick={() => onPageChange('words')}
                      className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left"
                    >
                      <span className="text-sm font-medium text-gray-700">Kelimelerim</span>
                      <ArrowRight size={14} className="text-gray-600" />
                    </button>
                    <button
                      onClick={() => onPageChange('grammar')}
                      className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left"
                    >
                      <span className="text-sm font-medium text-gray-700">Gramer</span>
                      <ArrowRight size={14} className="text-gray-600" />
                    </button>
                    <button
                      onClick={() => onPageChange('dictionary')}
                      className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left"
                    >
                      <span className="text-sm font-medium text-gray-700">Sözlük</span>
                      <ArrowRight size={14} className="text-gray-600" />
                    </button>
                    <button
                      onClick={() => onPageChange('oxford')}
                      className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left"
                    >
                      <span className="text-sm font-medium text-gray-700">Oxford Liste</span>
                      <ArrowRight size={14} className="text-gray-600" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}