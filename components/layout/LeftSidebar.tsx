"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, TrendingUp, Hash, PlusCircle, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LeftSidebar() {
  const pathname = usePathname();

  const navLinks = [
    { name: "Explore", href: "/problems", icon: LayoutDashboard },
    { name: "Trending", href: "/trending", icon: TrendingUp },
    { name: "Tags", href: "/tags", icon: Hash },
    { name: "Users", href: "/users", icon: Users },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 h-[calc(100vh-4rem)] sticky top-16 border-r border-white/5 bg-background/50 backdrop-blur-xl p-6">
      <Link href="/" className="mb-8 font-bold text-xl text-foreground flex items-center gap-2">
        <span className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center text-primary">
          <Hash className="w-5 h-5" />
        </span>
        DevDiscuss
      </Link>

      <nav className="flex flex-col space-y-2 mb-8">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all group",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted hover:bg-white/5 hover:text-foreground"
              )}
            >
              <link.icon className={cn("w-5 h-5 transition-colors", isActive ? "text-primary" : "text-muted group-hover:text-foreground")} />
              {link.name}
            </Link>
          );
        })}
      </nav>

      <Link
        href="/ask"
        className="flex items-center justify-center gap-2 mt-auto bg-primary text-white py-3 px-4 rounded-xl font-medium shadow-[0_0_15px_rgba(167,139,250,0.2)] hover:shadow-[0_0_20px_rgba(167,139,250,0.4)] hover:bg-primary/90 transition-all active:scale-95"
      >
        <PlusCircle className="w-5 h-5" />
        Ask Question
      </Link>
    </aside>
  );
}
