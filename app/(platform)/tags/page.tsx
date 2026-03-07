"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Hash, Loader2 } from "lucide-react";

export default function TagsPage() {
  const [tags, setTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTags() {
      try {
        const res = await fetch("/api/tags");
        if (res.ok) {
          const data = await res.json();
          setTags(data || []);
        }
      } catch (error) {
        console.error("Failed to fetch tags");
      } finally {
        setIsLoading(false);
      }
    }
    fetchTags();
  }, []);

  return (
    <div className="max-w-4xl mx-auto w-full">
      <div className="mb-8 pb-4 border-b border-white/5">
        <h1 className="text-3xl font-bold tracking-tight mb-2 text-foreground flex items-center gap-3">
          <Hash className="w-8 h-8 text-primary" />
          Tags
        </h1>
        <p className="text-muted">A tag is a keyword or label that categorizes your question with other, similar questions.</p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted">
          <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
          <p className="animate-pulse">Loading tags...</p>
        </div>
      ) : tags.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {tags.map((tag) => (
            <Link 
              key={tag} 
              href={`/tags/${encodeURIComponent(tag)}`}
              className="flex items-center gap-2 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-primary/50 hover:bg-white/[0.04] transition-all group"
            >
              <span className="inline-flex items-center w-fit px-2.5 py-1 text-xs rounded-md bg-white/5 text-muted group-hover:text-primary transition-colors">
                #{tag}
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-muted border border-white/5 rounded-xl bg-white/[0.02]">
          No tags found yet. Ask a question with tags to get started!
        </div>
      )}
    </div>
  );
}
