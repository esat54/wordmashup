import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";
import SettingsPage from "@/components/dashboard/SettingsPage";
import SeoHead from "@/components/SeoHead";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function DashboardAyarlarPage() {
  const { isTester, ready } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (ready && isTester) {
      router.push("/dashboard");
    }
  }, [ready, isTester, router]);

  if (!ready || isTester) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center flex-col">
        <div className="text-gray-600 dark:text-gray-400 animate-pulse">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <>
      <SeoHead
        title="Ayarlar"
        description="Profil ve hesap ayarlarınızı yönetin."
        noindex={true}
      />
      <DashboardLayout activePage="settings">
        {(user) => <SettingsPage user={user} />}
      </DashboardLayout>
    </>
  );
}