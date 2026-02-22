
import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardHero from "@/components/dashboard/DashboardHero";

export default function DashboardHomePage() {
  return (
    <DashboardLayout activePage="home">
      {(user) => <DashboardHero user={user} />}
    </DashboardLayout>
  );
}