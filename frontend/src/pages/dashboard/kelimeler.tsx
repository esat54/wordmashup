
import DashboardLayout from "@/components/layout/DashboardLayout";
import WordsPage from "@/components/dashboard/Words/WordsPage";
import SeoHead from "@/components/SeoHead";

export default function DashboardKelimelerPage() {
  return (
    <>
      <SeoHead
        title="Kelimelerim"
        description="Kişisel kelime listenizi yönetin ve öğrenmeye devam edin."
        noindex={true}
      />
      <DashboardLayout activePage="words">
        {() => <WordsPage />}
      </DashboardLayout>
    </>
  );
}