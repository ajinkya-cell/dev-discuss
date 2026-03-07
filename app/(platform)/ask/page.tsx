"use client";

import { useState } from "react";
import { Send, Tag as TagIcon, Type, AlignLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AskQuestion() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await fetch("/api/problems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          title, 
          description, 
          tags: tags.split(",").map(t => t.trim()).filter(Boolean)
        }),
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/problems/${data.id || ""}`);
      } else {
        // Fallback or dev environment simulation
        setTimeout(() => {
          router.push("/problems");
        }, 1000);
      }
    } catch {
      setTimeout(() => router.push("/problems"), 1000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto w-full pt-4">
      <div className="mb-10 pb-6 border-b border-white/5">
        <h1 className="text-3xl font-bold tracking-tight mb-2 text-foreground">Ask a Question</h1>
        <p className="text-muted">Get help from the developer community by providing clear details.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white/[0.02] p-8 rounded-2xl border border-white/5 shadow-2xl shadow-black/50">
        <div className="space-y-2">
          <label htmlFor="title" className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Type className="w-4 h-4 text-primary" /> Title
          </label>
          <p className="text-xs text-muted/80 mb-2">Be specific and imagine you are asking a question to another person.</p>
          <input
            id="title"
            required
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-medium placeholder:text-white/20"
            placeholder="e.g. How to handle Server Actions in Next.js?"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <AlignLeft className="w-4 h-4 text-secondary" /> Description
          </label>
          <p className="text-xs text-muted/80 mb-2">Include all the information someone would need to answer your question.</p>
          <textarea
            id="description"
            required
            rows={10}
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-mono text-sm placeholder:text-white/20"
            placeholder="Describe your problem in detail..."
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="tags" className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <TagIcon className="w-4 h-4 text-highlight" /> Tags
          </label>
          <p className="text-xs text-muted/80 mb-2">Add up to 5 tags to describe what your question is about. Comma separated.</p>
          <input
            id="tags"
            required
            value={tags}
            onChange={e => setTags(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-white/20"
            placeholder="e.g. react, nextjs, typescript"
          />
        </div>

        <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between">
          <button 
            type="button" 
            onClick={() => router.back()}
            className="px-6 py-2.5 rounded-xl border border-white/10 text-muted font-medium hover:text-foreground hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex items-center gap-2 px-8 py-2.5 rounded-xl font-medium shadow-[0_0_20px_rgba(167,139,250,0.2)] hover:shadow-[0_0_25px_rgba(167,139,250,0.4)] transition-all active:scale-95 text-white ${isSubmitting ? 'bg-primary/50 cursor-not-allowed' : 'bg-primary hover:bg-primary/90'}`}
          >
            {isSubmitting ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <Send className="w-4 h-4" />
            )}
            Post Question
          </button>
        </div>
      </form>
    </div>
  );
}
