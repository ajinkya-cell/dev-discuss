import { ReactNode } from "react";
import Link from "next/link";
import { Code2 } from "lucide-react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/30 items-center justify-center relative overflow-hidden">
      {/* Background decor */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px] pointer-events-none" />
      
      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 font-bold text-xl text-foreground hover:text-primary transition-colors z-20">
        <Code2 className="w-6 h-6 text-primary" />
        DevDiscuss
      </Link>
      
      <div className="relative z-10 w-full max-w-md px-6">
        {children}
      </div>
    </div>
  );
}
