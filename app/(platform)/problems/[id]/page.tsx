"use client";

import { useEffect, useState } from "react";
import { TagBadge } from "@/components/TagBadge";
import { VoteButtons } from "@/components/VoteButtons";
import { SolutionCard } from "@/components/SolutionCard";
import { MessageSquare, Clock, Edit, Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import Link from "next/link";

// Helper: fetch user name by ID, with caching
const authorCache: Record<string, string> = {};
async function fetchAuthorName(authorId: string): Promise<string> {
  if (authorCache[authorId]) return authorCache[authorId];
  try {
    const res = await fetch(`/api/users/${authorId}/profile`);
    if (res.ok) {
      const data = await res.json();
      const name = data.user?.name || data.name || "Anonymous";
      authorCache[authorId] = name;
      return name;
    }
  } catch {}
  return "Anonymous";
}

export default function ProblemPage() {
  const params = useParams();
  const id = params.id as string;
  
  const [problem, setProblem] = useState<any>(null);
  const [solutions, setSolutions] = useState<any[]>([]);
  const [authorName, setAuthorName] = useState("...");
  const [isLoading, setIsLoading] = useState(true);


  // Solution state
  const [solutionContent, setSolutionContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Resolve solution authors
  async function enrichSolutions(rawSolutions: any[]) {
    const enriched = await Promise.all(
      rawSolutions.map(async (sol: any) => {
        const name = sol.authorId ? await fetchAuthorName(sol.authorId) : "Anonymous";
        return { ...sol, authorName: name };
      })
    );
    return enriched;
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const [probRes, solRes] = await Promise.all([
          fetch(`/api/problems/${id}`),
          fetch(`/api/problems/${id}/solutions`)
        ]);
        
        if (probRes.ok) {
          const probData = await probRes.json();
          setProblem(probData);
          setEditTitle(probData.title || "");
          setEditDescription(probData.description || "");

          // Fetch problem author name
          if (probData.authorId) {
            const name = await fetchAuthorName(probData.authorId);
            setAuthorName(name);
          }
        }
        if (solRes.ok) {
          const solData = await solRes.json();
          const enriched = await enrichSolutions(solData || []);
          setSolutions(enriched);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    
    if (id) {
      fetchData();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 max-w-4xl mx-auto w-full text-muted">
        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
        <p className="animate-pulse">Loading discussion...</p>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="max-w-4xl mx-auto w-full py-20 text-center">
        <h1 className="text-2xl font-bold text-foreground">Problem Not Found</h1>
        <p className="text-muted mt-2">The question you are looking for might have been removed.</p>
      </div>
    );
  }

  const handlePostSolution = async () => {
    if (!solutionContent.trim()) return;
    setSubmitError("");
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/problems/${id}/solutions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: solutionContent })
      });
      if (res.ok) {
        setSolutionContent("");
        // Re-fetch solutions
        const solRes = await fetch(`/api/problems/${id}/solutions`);
        if (solRes.ok) {
          const solData = await solRes.json();
          const enriched = await enrichSolutions(solData || []);
          setSolutions(enriched);
        }
      } else {
        const errData = await res.json();
        setSubmitError(errData.error || "Failed to post solution. Are you logged in?");
      }
    } catch (e) {
      console.error(e);
      setSubmitError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveProblem = async () => {
    if (!editTitle.trim() || !editDescription.trim()) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/problems/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editTitle, description: editDescription })
      });
      if (res.ok) {
        const updated = await res.json();
        setProblem({ ...problem, ...updated });
        setIsEditing(false);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full">
      <div className="flex gap-6 mb-12">
        <div className="hidden sm:block pt-2">
          <VoteButtons targetType="problem" targetId={id} direction="col" />
        </div>
        
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full text-2xl md:text-3xl font-bold bg-transparent border-b border-white/20 focus:border-primary focus:outline-none mb-4 pb-2"
            />
          ) : (
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-4 leading-snug">
              {problem.title}
            </h1>
          )}
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted mb-6 pb-6 border-b border-white/5">
            <Link 
              href={`/users/${problem.authorId}`}
              className="flex items-center gap-1.5 text-foreground bg-white/5 py-1 px-2.5 rounded-md border border-white/10 hover:border-primary/50 group transition-colors"
            >
              <span className="w-4 h-4 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-[10px] group-hover:bg-primary/30 transition-colors">
                {authorName.charAt(0).toUpperCase()}
              </span>
              <span className="group-hover:text-primary transition-colors">{authorName}</span>
            </Link>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {new Date(problem.createdAt || Date.now()).toLocaleDateString()}</span>
            <button
               onClick={() => setIsEditing(!isEditing)}
               className="flex items-center gap-1.5 ml-auto cursor-pointer hover:text-foreground transition-colors"
            >
              <Edit className="w-4 h-4" /> {isEditing ? "Cancel" : "Edit"}
            </button>
            {isEditing && (
              <button
                onClick={handleSaveProblem}
                disabled={isSaving}
                className="flex items-center gap-1.5 cursor-pointer text-primary hover:text-primary/80 transition-colors"
               >
                 {isSaving ? "Saving..." : "Save"}
              </button>
            )}
          </div>
          
          <div className="prose prose-invert max-w-none mb-8 prose-p:leading-relaxed prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10">
            {isEditing ? (
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={8}
                className="w-full bg-black/40 border border-white/10 rounded-lg p-4 focus:outline-none focus:border-primary/50 text-foreground font-mono text-sm mb-4"
              />
            ) : (
              (problem.description || "").split('\n\n').map((p: string, i: number) => (
                <p key={i}>{p}</p>
              ))
            )}
          </div>
          
          <div className="flex flex-wrap gap-2 mb-8">
            {(problem.tags || []).map((tag: string) => <TagBadge key={tag} tag={tag} />)}
          </div>
          
          <div className="sm:hidden flex items-center gap-2 mb-8 pb-8 border-b border-white/5">
             <span className="text-muted mr-2">Votes:</span>
             <VoteButtons targetType="problem" targetId={id} direction="row" />
          </div>
        </div>
      </div>

      <div className="mb-12">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-secondary" />
            {solutions.length} Solutions
          </h2>
        </div>
        
        <div className="space-y-6">
          {solutions.length > 0 ? solutions.map((solution: any) => (
            <SolutionCard 
               key={solution.id} 
               solution={{
                 id: solution.id,
                 content: solution.content || "",
                 author: solution.authorName || "Anonymous",
                 isAccepted: false,
                 createdAt: new Date(solution.createdAt || Date.now()).toLocaleDateString()
               }} 
            />
          )) : (
            <div className="text-muted border border-white/5 p-8 rounded-xl text-center bg-white/[0.02]">
              No solutions yet. Be the first to answer!
            </div>
          )}
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-12">
        <h3 className="text-lg font-bold mb-4">Your Answer</h3>

        {submitError && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg font-medium">
            {submitError}
          </div>
        )}

        <textarea 
          value={solutionContent}
          onChange={(e) => setSolutionContent(e.target.value)}
          rows={6} 
          className="w-full bg-black/50 border border-white/10 rounded-lg p-4 text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all mb-4 placeholder:text-muted/50 font-mono text-sm"
          placeholder="Write a clear, helpful solution (min 20 characters)..."
        />
        <div className="flex justify-end pt-2 border-t border-white/5">
          <button 
             onClick={handlePostSolution}
             disabled={isSubmitting || solutionContent.trim().length < 20}
             className="px-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {isSubmitting ? "Posting..." : "Post Solution"}
          </button>
        </div>
      </div>
    </div>
  );
}
