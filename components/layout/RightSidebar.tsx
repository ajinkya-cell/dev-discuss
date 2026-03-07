"use client";

import Link from "next/link";
import { Flame, Hash, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function RightSidebar() {
  const [trendingProblems, setTrendingProblems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTrending() {
      try {
        const res = await fetch("/api/problems/trending");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setTrendingProblems(data.slice(0, 3));
          }
        }
      } catch (error) {
        console.error("Failed to fetch trending problems", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchTrending();
  }, []);

  const popularTags = ["react", "next.js", "typescript", "drizzle", "tailwindcss"];

  return (
    <aside className="hidden lg:flex flex-col w-72 h-[calc(100vh-4rem)] sticky top-16 border-l border-white/5 bg-background/50 backdrop-blur-xl p-6">
      <div className="mb-8">
        <h3 className="text-foreground font-semibold flex items-center gap-2 mb-4">
          <Flame className="w-4 h-4 text-primary" />
          Trending Now
        </h3>
        {isLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="w-5 h-5 animate-spin text-muted" />
          </div>
        ) : trendingProblems.length > 0 ? (
          <ul className="space-y-4">
            {trendingProblems.map((p) => (
              <li key={p.id}>
                <Link 
                  href={`/problems/${p.id}`}
                  className="text-sm text-muted hover:text-primary transition-colors line-clamp-2 leading-relaxed"
                >
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted">No trending problems.</p>
        )}
      </div>

      <div>
        <h3 className="text-foreground font-semibold flex items-center gap-2 mb-4">
          <Hash className="w-4 h-4 text-secondary" />
          Popular Tags
        </h3>
        <div className="flex flex-wrap gap-2">
          {popularTags.map((tag) => (
            <Link 
              key={tag} 
              href={`/tags/${tag}`}
              className="px-2.5 py-1 text-xs rounded-md bg-white/5 border border-white/10 text-muted hover:text-highlight hover:border-highlight/30 hover:bg-highlight/10 transition-colors"
            >
              #{tag}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
