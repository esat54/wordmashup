
import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";
import DictionaryPage from "@/components/dashboard/DictionaryPage";
import SeoHead from "@/components/SeoHead";

export default function DashboardSozlukPage() {
  return (
    <>
      <SeoHead
        title="AI Sözlük"
        description="AI destekli akıllı sözlük ile kelimeleri bağlam içinde öğrenin."
        noindex={true}
      />
      <DashboardLayout activePage="dictionary">
        {() => <DictionaryPage />}
      </DashboardLayout>
    </>
  );
}