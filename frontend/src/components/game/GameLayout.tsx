import GameHeader from "@/components/game/GameHeader";
import Footer from "@/components/Footer";

interface GameLayoutProps {
  children: React.ReactNode;
}

export default function GameLayout({ children }: GameLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors duration-300">
      <GameHeader />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
