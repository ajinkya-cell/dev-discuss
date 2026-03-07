"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ProblemCard } from "@/components/ProblemCard";
import { Search, Loader2, Tag } from "lucide-react";

function SearchResults() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";

  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function doSearch() {
      if (!q.trim()) {
        setResults([]);
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const res = await fetch(`/api/search/problems?q=${encodeURIComponent(q)}`);
        if (res.ok) {
          const data = await res.json();
          const rawResults = data || [];

          // Fetch author names
          const authorIds = [...new Set(rawResults.map((p: any) => p.author_id).filter(Boolean))] as string[];
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

          const enriched = rawResults.map((p: any) => ({
            ...p,
            authorName: authorMap[p.author_id] || "Community"
          }));

          setResults(enriched);
        }
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setIsLoading(false);
      }
    }
    doSearch();
  }, [q]);

  // Check if a tag matches the query
  const isTagMatch = (tags: string[]) => {
    if (!tags || !q) return false;
    return tags.some(tag => tag.toLowerCase().includes(q.toLowerCase()));
  };

  return (
    <div className="max-w-4xl mx-auto w-full">
      <div className="mb-8 pb-4 border-b border-white/5">
        <h1 className="text-3xl font-bold tracking-tight mb-2 text-foreground flex items-center gap-3">
          <Search className="w-8 h-8 text-primary" />
          Search Results
        </h1>
        {q && (
          <p className="text-muted">
            Showing results for &quot;<span className="text-foreground font-medium">{q}</span>&quot;
            {!isLoading && <span className="ml-2 text-sm text-muted/60">({results.length} found)</span>}
          </p>
        )}
      </div>

      <div className="space-y-4 min-h-[300px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
            <p className="animate-pulse font-mono text-sm">Searching problems, tags, descriptions...</p>
          </div>
        ) : results.length > 0 ? (
          results.map((problem: any) => (
            <div key={problem.id}>
              {/* Show matched tag indicator */}
              {isTagMatch(problem.tags) && (
                <div className="flex items-center gap-1.5 mb-1.5 ml-1 text-xs text-primary/60">
                  <Tag className="w-3 h-3" />
                  <span className="font-mono">matched by tag</span>
                </div>
              )}
              <ProblemCard 
                problem={{
                  id: problem.id,
                  title: problem.title,
                  tags: problem.tags || [],
                  author: problem.authorName || "Community",
                  createdAt: problem.created_at 
                    ? new Date(problem.created_at).toLocaleDateString() 
                    : ""
                }} 
              />
            </div>
          ))
        ) : (
          <div className="text-center py-20 text-muted border border-white/5 rounded-xl bg-white/[0.02]">
            <Search className="w-10 h-10 mx-auto mb-4 text-muted/30" />
            <p className="font-medium mb-2">{q ? `No results found for "${q}".` : "Enter a search term to find problems."}</p>
            <p className="text-sm text-muted/50 font-mono">Try searching by title, description, or tag name.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center py-40 max-w-4xl mx-auto w-full text-muted">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
        <p className="animate-pulse">Loading...</p>
      </div>
    }>
      <SearchResults />
    </Suspense>
  );
}
