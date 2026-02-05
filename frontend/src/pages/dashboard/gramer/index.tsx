"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import GrammarPage from "@/components/dashboard/Grammars/GrammarPage";

export default function DashboardGramerPage() {
  return (
    <DashboardLayout activePage="grammar">
      {() => <GrammarPage />}
    </DashboardLayout>
  );
}