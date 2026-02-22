
import DashboardLayout from "@/components/layout/DashboardLayout";
import GrammarPage from "@/components/dashboard/Grammars/GrammarPage";
import SeoHead from "@/components/SeoHead";

export default function DashboardGramerPage() {
  return (
    <>
      <SeoHead
        title="Gramer Değerlendirmesi"
        description="Kişiselleştirilmiş gramer notlarını inceleyin ve gramer bilginizi geliştirin."
        noindex={true}
      />
      <DashboardLayout activePage="grammar">
        {() => <GrammarPage />}
      </DashboardLayout>
    </>
  );
}