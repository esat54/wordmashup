import type { GetServerSideProps } from "next";

import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";
import GrammarDetailPage from "@/components/dashboard/Grammars/GrammarDetailPage";

interface GlobalGrammarDetailRouteProps {
  grammarId: string;
}

export default function GlobalGramerSlugPage({ grammarId }: GlobalGrammarDetailRouteProps) {
  return (
    <DashboardLayout activePage="grammar">
      {() => <GrammarDetailPage grammarId={grammarId} />}
    </DashboardLayout>
  );
}

export const getServerSideProps: GetServerSideProps<GlobalGrammarDetailRouteProps> = async (
  context,
) => {
  const slugParam = context.params?.slug;
  const slug = Array.isArray(slugParam) ? slugParam[0] : slugParam;

  if (!slug) {
    return { notFound: true };
  }

  const parts = slug.split("-");
  const grammarId = parts[parts.length - 1] || "";

  if (!grammarId) {
    return { notFound: true };
  }

  return {
    props: {
      grammarId,
    },
  };
};