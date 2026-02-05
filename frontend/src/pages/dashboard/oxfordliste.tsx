"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import OxfordListPage from "@/components/dashboard/OxfordListPage";

export default function DashboardOxfordListePage() {
  return (
    <DashboardLayout activePage="oxford">
      {() => <OxfordListPage />}
    </DashboardLayout>
  );
}