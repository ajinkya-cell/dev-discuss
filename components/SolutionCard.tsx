"use client";

import { CheckCircle, Trash2 } from "lucide-react";
import { VoteButtons } from "./VoteButtons";

interface Solution {
  id: string | number;
  content: string;
  author: string;
  isAccepted: boolean;
  createdAt: string;
}

interface SolutionCardProps {
  solution: Solution;
  showDelete?: boolean;
  onDelete?: () => void;
}

export function SolutionCard({ solution, showDelete, onDelete }: SolutionCardProps) {
  return (
    <div className={`p-6 rounded-xl border relative overflow-hidden transition-all ${solution.isAccepted ? 'bg-secondary/5 border-secondary/20' : 'bg-white/[0.02] border-white/5 hover:border-white/10'}`}>
      {solution.isAccepted && (
        <div className="absolute top-0 right-0 p-2 text-secondary">
          <CheckCircle className="w-5 h-5 opacity-80" />
        </div>
      )}
      
      <div className="flex gap-6 relative z-10">
        <div className="hidden sm:block">
          <VoteButtons targetType="solution" targetId={solution.id} direction="col" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-4 text-sm">
            <div className="w-6 h-6 rounded bg-primary/20 text-primary flex items-center justify-center font-bold text-xs uppercase shadow-[0_0_10px_rgba(167,139,250,0.2)]">
              {solution.author.charAt(0)}
            </div>
            <span className="font-medium text-foreground">{solution.author}</span>
            <span className="text-muted text-xs bg-white/5 py-0.5 px-2 rounded-full border border-white/10 ">{solution.createdAt}</span>
            {solution.isAccepted && (
              <span className="text-[10px] text-secondary bg-secondary/10 px-2 py-0.5 rounded uppercase font-bold tracking-widest border border-secondary/20">
                Accepted Answer
              </span>
            )}
            {showDelete && onDelete && (
              <button
                onClick={onDelete}
                className="ml-auto flex items-center gap-1.5 text-red-400 hover:text-red-300 transition-colors cursor-pointer text-xs font-medium"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            )}
          </div>
          
          <div className="prose prose-invert prose-p:leading-relaxed prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10 prose-code:text-primary max-w-none">
            {solution.content}
          </div>
          
          <div className="sm:hidden mt-4 pt-4 border-t border-white/5 flex items-center gap-2 text-sm">
            <span className="text-muted mr-2">Votes:</span>
            <VoteButtons targetType="solution" targetId={solution.id} direction="row" />
          </div>
        </div>
      </div>
    </div>
  );
}
