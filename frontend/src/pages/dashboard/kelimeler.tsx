"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import WordsPage from "@/components/dashboard/Words/WordsPage";

export default function DashboardKelimelerPage() {
  return (
    <DashboardLayout activePage="words">
      {() => <WordsPage />}
    </DashboardLayout>
  );
}