"use client";

import { useEffect, useState, use } from "react";
import { ProblemCard } from "@/components/ProblemCard";
import { Hash, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = use(params);
  const decodedTag = decodeURIComponent(tag);
  
  const [problems, setProblems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProblems() {
      try {
        const res = await fetch(`/api/problems/by-tag?tag=${encodeURIComponent(decodedTag)}`);
        if (res.ok) {
          const data = await res.json();
          const rawProblems = data || [];

          // Fetch author names for each unique authorId
          const authorIds = [...new Set(rawProblems.map((p: any) => p.author_id).filter(Boolean))] as string[];
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
            authorName: authorMap[p.author_id] || "Anonymous"
          }));

          setProblems(enriched);
        }
      } catch (error) {
        console.error("Failed to fetch problems");
      } finally {
        setIsLoading(false);
      }
    }
    fetchProblems();
  }, [decodedTag]);

  return (
    <div className="max-w-4xl mx-auto w-full">
      <div className="mb-8 pb-4 border-b border-white/5">
        <Link href="/tags" className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to all tags
        </Link>
        <h1 className="text-3xl font-bold tracking-tight mb-2 text-foreground flex items-center gap-3">
          <Hash className="w-8 h-8 text-primary" />
          {decodedTag}
        </h1>
        <p className="text-muted">Questions tagged with {decodedTag}.</p>
      </div>

      <div className="space-y-4 min-h-[400px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
            <p className="animate-pulse">Loading problems...</p>
          </div>
        ) : problems.length > 0 ? (
          problems.map((problem: any) => (
            <ProblemCard 
              key={problem.id} 
              problem={{
                id: problem.id,
                title: problem.title,
                tags: problem.tags || [],
                author: problem.authorName || "Anonymous",
                authorId: problem.author_id,
                createdAt: new Date(problem.created_at || Date.now()).toLocaleDateString()
              }} 
            />
          ))
        ) : (
          <div className="text-center py-20 text-muted border border-white/5 rounded-xl bg-white/[0.02]">
            No problems found with this tag. Be the first to ask!
          </div>
        )}
      </div>
    </div>
  );
}
