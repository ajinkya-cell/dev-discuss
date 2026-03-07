import LeftSidebar from "@/components/layout/LeftSidebar";
import RightSidebar from "@/components/layout/RightSidebar";
import Navbar from "@/components/layout/Navbar";

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/30">
      <Navbar />
      <div className="flex flex-1 max-w-[1400px] w-full mx-auto">
        <LeftSidebar />
        <main className="flex-1 w-full min-w-0 p-4 md:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
        <RightSidebar />
      </div>
    </div>
  );
}
