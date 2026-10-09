
import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";
import OxfordListPage from "@/components/dashboard/OxfordListPage";
import SeoHead from "@/components/SeoHead";

export default function DashboardOxfordListePage() {
  return (
    <>
      <SeoHead
        title="Oxford Kelime Listesi"
        description="Oxford kelime listesini takip edin ve öğrenim ilerlemenizi görün."
        noindex={true}
      />
      <DashboardLayout activePage="oxford">
        {() => <OxfordListPage />}
      </DashboardLayout>
    </>
  );
}