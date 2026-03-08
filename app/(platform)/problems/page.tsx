"use client";

import { useEffect, useState } from "react";
import { ProblemCard } from "@/components/ProblemCard";
import { Filter, ArrowDownUp, Loader2 } from "lucide-react";

export default function ProblemsPage() {
  const [problems, setProblems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [showFilter, setShowFilter] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    async function fetchProblems() {
      try {
        if (page === 1) setIsLoading(true);
        else setIsLoadingMore(true);

        const res = await fetch(`/api/problems?page=${page}&limit=5`);
        if (res.ok) {
          const data = await res.json();
          const rawProblems = data.data || [];
          
          if (rawProblems.length < 5) {
            setHasMore(false);
          } else {
            setHasMore(true);
          }

          // Fetch author names for each unique authorId
          const authorIds = [...new Set(rawProblems.map((p: any) => p.authorId).filter(Boolean))] as string[];
          const authorMap: Record<string, string> = {};
          
          await Promise.all(
            authorIds.map(async (authorId) => {
              try {
                const userRes = await fetch(`/api/users/${authorId}/profile`);
                if (userRes.ok) {
                  const userData = await userRes.json();
                  authorMap[authorId] = userData.user?.name || userData.name || "Anonymous";
                }
              } catch {
                authorMap[authorId] = "Anonymous";
              }
            })
          );

          const enriched = rawProblems.map((p: any) => ({
            ...p,
            authorName: authorMap[p.authorId] || "Anonymous"
          }));

          if (page === 1) {
            setProblems(enriched);
          } else {
            setProblems(prev => {
              // Avoid duplicates if effect runs twice in strict mode
              const existingIds = prev.map((p: any) => p.id);
              const newEnriched = enriched.filter((p: any) => !existingIds.includes(p.id));
              return [...prev, ...newEnriched];
            });
          }
        }
      } catch (error) {
        console.error("Failed to fetch problems");
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    }
    fetchProblems();
  }, [page]);

  return (
    <div className="max-w-4xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-4 border-b border-white/5">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 text-foreground">Explore Problems</h1>
          <p className="text-muted">Discover questions from the developer community.</p>
        </div>
        
        <div className="flex items-center gap-3 relative">
          <button 
             onClick={() => setShowFilter(!showFilter)}
             className={`flex items-center gap-2 px-4 py-2 ${showFilter ? 'bg-primary/20 border-primary/50 text-primary' : 'bg-white/5 border-white/10 text-foreground'} border rounded-lg text-sm hover:bg-white/10 transition-colors`}
          >
            <Filter className="w-4 h-4" />
            Filter
          </button>
          
          <button 
             onClick={() => setSortOrder(sortOrder === "newest" ? "oldest" : "newest")}
             className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-foreground hover:bg-white/10 transition-colors"
          >
            <ArrowDownUp className="w-4 h-4" />
            Sort: {sortOrder === "newest" ? "Newest" : "Oldest"}
          </button>
          
          {showFilter && (
            <div className="absolute top-12 left-0 w-64 bg-background border border-white/10 rounded-xl p-4 shadow-2xl z-20">
              <h3 className="text-sm font-semibold mb-2">Filter by Tags</h3>
              <p className="text-xs text-muted mb-4">Coming soon based on your tag preferences.</p>
              <button onClick={() => setShowFilter(false)} className="w-full bg-white/5 hover:bg-white/10 py-1.5 rounded-lg text-xs transition-colors">Close</button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4 min-h-[400px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
            <p className="animate-pulse">Loading problems...</p>
          </div>
        ) : problems.length > 0 ? (
          [...problems].sort((a, b) => {
             const timeA = new Date(a.createdAt || 0).getTime();
             const timeB = new Date(b.createdAt || 0).getTime();
             return sortOrder === "newest" ? timeB - timeA : timeA - timeB;
          }).map((problem: any) => (
            <ProblemCard 
              key={problem.id} 
              problem={{
                id: problem.id,
                title: problem.title,
                tags: problem.tags || [],
                author: problem.authorName || "Anonymous",
                authorId: problem.authorId,
                createdAt: new Date(problem.createdAt || Date.now()).toLocaleDateString()
              }} 
            />
          ))
        ) : (
          <div className="text-center py-20 text-muted border border-white/5 rounded-xl bg-white/[0.02]">
            No problems found. Be the first to ask!
          </div>
        )}
      </div>
      
      {!isLoading && problems.length > 0 && hasMore && (
        <div className="mt-8 flex justify-center">
          <button 
             onClick={() => setPage(p => p + 1)}
             disabled={isLoadingMore}
             className={`px-6 py-2 rounded-full border border-white/10 bg-white/5 text-sm text-foreground hover:bg-white/10 transition-colors ${isLoadingMore ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoadingMore ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
}
