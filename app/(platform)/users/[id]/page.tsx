"use client";

import { useEffect, useState } from "react";
import { ProblemCard } from "@/components/ProblemCard";
import { SolutionCard } from "@/components/SolutionCard";
import { CalendarDays, Code2, MessageSquare, Loader2 } from "lucide-react";
import { useParams } from "next/navigation";

export default function UserProfilePage() {
  const params = useParams();
  const id = params.id as string;

  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [problems, setProblems] = useState<any[]>([]);
  const [solutions, setSolutions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [profRes, probRes, solRes] = await Promise.all([
           fetch(`/api/users/${id}/profile`),
           fetch(`/api/users/${id}/problems`),
           fetch(`/api/users/${id}/solutions`)
        ]);

        if (profRes.ok) {
          const profData = await profRes.json();
          // API returns { user: {...}, stats: {...} }
          setProfile(profData.user || profData);
          setStats(profData.stats || null);
          setIsFollowing(profData.isFollowing || false);
          setIsOwnProfile(profData.isOwnProfile || false);
        }
        if (probRes.ok) {
           const probData = await probRes.json();
           setProblems(probData.data ? probData.data : probData);
        }
        if (solRes.ok) setSolutions(await solRes.json());

      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    if (id) fetchData();
  }, [id]);

  const handleFollowToggle = async () => {
    try {
      const res = await fetch(`/api/users/${id}/follow`, { method: "POST" });
      if (res.ok) {
        setIsFollowing(!isFollowing);
        if (stats) {
          setStats((prev: any) => ({
             ...prev,
             followers: prev.followers + (isFollowing ? -1 : 1)
          }));
        }
      }
    } catch (error) {
       console.error("Failed to toggle follow status", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 max-w-4xl mx-auto w-full text-muted">
        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
        <p className="animate-pulse">Loading developer profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto w-full py-20 text-center">
        <h1 className="text-2xl font-bold text-foreground">User Not Found</h1>
        <p className="text-muted mt-2">This developer doesn&apos;t seem to exist.</p>
      </div>
    );
  }

  const name = profile.name || "Anonymous";
  const reputation = (stats?.problems || 0) * 5 + (stats?.solutions || 0) * 10 + (stats?.followers || 0) * 2;

  return (
    <div className="max-w-4xl mx-auto w-full">
      <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-8 mb-8 relative overflow-hidden">
        {/* Glow behind profile */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="w-32 h-32 rounded-full border-4 border-white/10 bg-black/50 overflow-hidden flex items-center justify-center text-4xl font-bold text-primary shadow-[0_0_30px_rgba(167,139,250,0.2)] shrink-0">
            {name.charAt(0).toUpperCase()}
          </div>
          
          <div className="flex-1 flex flex-col justify-center min-h-[128px] text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-4">
              <div className="space-y-3">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">{name}</h1>
                
                <div className="flex flex-col gap-2 text-sm text-muted">
                  {profile.createdAt && (
                    <span className="flex items-center justify-center md:justify-start gap-2">
                      <CalendarDays className="w-4 h-4" /> Joined {new Date(profile.createdAt).toLocaleDateString()}
                    </span>
                  )}
                  {stats && (
                    <div className="flex items-center justify-center md:justify-start gap-4">
                      <span><strong className="text-foreground">{stats.followers || 0}</strong> followers</span>
                      <span><strong className="text-foreground">{stats.following || 0}</strong> following</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col items-center gap-4 shrink-0">
                {!isOwnProfile && (
                  <button
                    onClick={handleFollowToggle}
                    className={`px-8 py-2.5 rounded-full font-medium transition-all w-full sm:w-auto ${
                      isFollowing 
                        ? 'bg-white/10 text-foreground hover:bg-white/20 border border-white/20' 
                        : 'bg-primary text-white hover:bg-primary/90 shadow-[0_0_15px_rgba(167,139,250,0.3)]'
                    }`}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="hidden md:flex flex-col items-center justify-center p-6 bg-white/5 border border-white/10 rounded-2xl min-w-[140px]">
             <span className="text-3xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-br from-primary to-highlight">
              {reputation}
            </span>
            <span className="text-xs uppercase tracking-widest text-muted mt-2 font-semibold">Reputation</span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2 text-foreground mb-6">
            <Code2 className="w-5 h-5 text-primary" /> Questions ({problems.length || 0})
          </h2>
          <div className="space-y-4">
            {problems.length > 0 ? problems.map((prob) => (
              <ProblemCard key={prob.id} problem={{
                id: prob.id,
                title: prob.title,
                tags: prob.tags || [],
                author: name,
                createdAt: new Date(prob.createdAt || Date.now()).toLocaleDateString()
              }} />
            )) : (
              <div className="p-6 border border-white/5 bg-white/[0.02] rounded-xl text-center text-muted">
                No problems asked yet.
              </div>
            )}
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2 text-foreground mb-6">
            <MessageSquare className="w-5 h-5 text-secondary" /> Solutions ({solutions.length || 0})
          </h2>
          <div className="space-y-4">
            {solutions.length > 0 ? solutions.map((sol) => (
              <SolutionCard key={sol.id} solution={{
                 id: sol.id,
                 content: sol.content || sol.description || "",
                 author: name,
                 isAccepted: false,
                 createdAt: new Date(sol.createdAt || Date.now()).toLocaleDateString()
              }} />
            )) : (
              <div className="p-6 border border-white/5 bg-white/[0.02] rounded-xl text-center text-muted">
                No solutions provided yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
