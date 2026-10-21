import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";
import PhrasesPage from "@/components/dashboard/PhrasesPage";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function PhrasesRoute() {
  const { isAdmin, ready } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (ready && !isAdmin) {
      router.replace("/dashboard");
    }
  }, [ready, isAdmin]);

  if (!ready || !isAdmin) return null;

  return (
    <DashboardLayout activePage="phrases">
      {() => <PhrasesPage />}
    </DashboardLayout>
  );
}
