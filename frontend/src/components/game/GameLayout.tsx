import HomeHeader from "@/components/home/header";
import Footer from "@/components/Footer";

interface GameLayoutProps {
  children: React.ReactNode;
}

export default function GameLayout({ children }: GameLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors duration-300">
      <HomeHeader />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
