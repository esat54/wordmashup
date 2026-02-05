"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import DictionaryPage from "@/components/dashboard/DictionaryPage";

export default function DashboardSozlukPage() {
  return (
    <DashboardLayout activePage="dictionary">
      {() => <DictionaryPage />}
    </DashboardLayout>
  );
}