"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import SettingsPage from "@/components/dashboard/SettingsPage";
import SeoHead from "@/components/SeoHead";

export default function DashboardAyarlarPage() {
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