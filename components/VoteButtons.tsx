"use client";

import { ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface VoteButtonsProps {
  targetType: "problem" | "solution";
  targetId: string | number;
  direction?: "row" | "col";
}

export function VoteButtons({ targetType, targetId, direction = "col" }: VoteButtonsProps) {
  const [votes, setVotes] = useState(0);
  const [hasVoted, setHasVoted] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Fetch actual vote count + hasVoted from DB on mount
  useEffect(() => {
    async function fetchVotes() {
      try {
        const endpoint = targetType === "problem"
          ? `/api/problems/${targetId}/vote`
          : `/api/solutions/${targetId}/vote`;

        const res = await fetch(endpoint);
        if (res.ok) {
          const data = await res.json();
          setVotes(data.votes || 0);
          setHasVoted(data.hasVoted || false);
        }
      } catch (e) {
        console.error("Failed to fetch votes:", e);
      } finally {
        setIsLoaded(true);
      }
    }
    fetchVotes();
  }, [targetType, targetId]);

  const handleVote = async () => {
    if (isVoting) return;
    setIsVoting(true);
    try {
      const endpoint = targetType === "problem"
        ? `/api/problems/${targetId}/vote`
        : `/api/solutions/${targetId}/vote`;

      const res = await fetch(endpoint, { method: "POST" });

      if (res.ok) {
        const data = await res.json();
        // Use the exact count from the API response
        setVotes(data.votes ?? votes);
        setHasVoted(data.hasVoted ?? !hasVoted);
      } else if (res.status === 401) {
        alert("Please log in to vote.");
      }
    } catch (e) {
      console.error("Vote failed:", e);
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div className={cn("flex items-center gap-1.5", direction === "col" ? "flex-col" : "flex-row")}>
      <button 
        onClick={handleVote}
        disabled={isVoting || !isLoaded}
        className={cn(
          "p-2 rounded-lg transition-all active:scale-90",
          (isVoting || !isLoaded) && "opacity-50 cursor-wait",
          hasVoted 
            ? "text-primary bg-primary/15 shadow-[0_0_10px_rgba(167,139,250,0.2)]" 
            : "text-muted hover:text-foreground hover:bg-white/10"
        )}
        title={hasVoted ? "Remove vote" : "Upvote"}
      >
        <ChevronUp className="w-5 h-5" />
      </button>
      
      <span className={cn(
        "font-mono text-sm font-bold tabular-nums min-w-[1.5rem] text-center",
        hasVoted ? "text-primary" : "text-foreground"
      )}>
        {isLoaded ? votes : "·"}
      </span>
    </div>
  );
}
