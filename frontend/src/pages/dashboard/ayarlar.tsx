"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import SettingsPage from "@/components/dashboard/SettingsPage";

export default function DashboardAyarlarPage() {
  return (
    <DashboardLayout activePage="settings">
      {(user) => <SettingsPage user={user} />}
    </DashboardLayout>
  );
}