"use client";

import { useEffect, useState } from "react";
import { ProblemCard } from "@/components/ProblemCard";
import { Flame, Loader2 } from "lucide-react";

export default function TrendingPage() {
  const [problems, setProblems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTrending() {
      try {
        const res = await fetch("/api/problems/trending");
        if (res.ok) {
          const data = await res.json();
          setProblems(data || []);
        }
      } catch (error) {
        console.error("Failed to fetch trending problems");
      } finally {
        setIsLoading(false);
      }
    }
    fetchTrending();
  }, []);

  return (
    <div className="max-w-4xl mx-auto w-full">
      <div className="mb-8 pb-4 border-b border-white/5 flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shadow-[0_0_15px_rgba(167,139,250,0.2)]">
          <Flame className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Trending Problems</h1>
          <p className="text-muted">Most debated and voted questions right now.</p>
        </div>
      </div>

      <div className="space-y-4 min-h-[400px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
            <p className="animate-pulse">Loading trending discussion...</p>
          </div>
        ) : problems.length > 0 ? (
          problems.map((problem: any) => (
             <ProblemCard 
              key={problem.id} 
              problem={{
                id: problem.id,
                title: problem.title,
                tags: problem.tags || [],
                author: "Community",
                createdAt: new Date(problem.created_at || Date.now()).toLocaleDateString()
              }} 
            />
          ))
        ) : (
          <div className="text-center py-20 text-muted border border-white/5 rounded-xl bg-white/[0.02]">
            No trending problems found at the moment.
          </div>
        )}
      </div>
    </div>
  );
}
