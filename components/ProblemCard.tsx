import Link from "next/link";
import { TagBadge } from "./TagBadge";

interface Problem {
  id: string | number;
  title: string;
  tags: string[];
  author: string;
  authorId?: string;
  createdAt: string;
}

export function ProblemCard({ problem }: { problem: Problem }) {
  return (
    <div className="group bg-white/[0.02] border border-white/5 rounded-xl p-5 hover:bg-white/[0.04] hover:border-white/10 transition-all">
      <Link 
        href={`/problems/${problem.id}`}
        className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors focus:outline-none focus:underline leading-snug"
      >
        {problem.title}
      </Link>
      
      <div className="flex flex-wrap gap-2 mt-3">
        {problem.tags.map(tag => <TagBadge key={tag} tag={tag} />)}
      </div>
      
      <div className="flex items-center gap-4 mt-4 text-xs text-muted">
        {problem.authorId ? (
          <Link href={`/users/${problem.authorId}`} className="flex items-center gap-1 hover:text-primary transition-colors group/author cursor-pointer">
            <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-[10px] text-primary font-bold group-hover/author:bg-primary/30 transition-colors">
              {problem.author.charAt(0).toUpperCase()}
            </span>
            <span className="ml-1 text-foreground/80 group-hover/author:text-foreground">{problem.author}</span>
          </Link>
        ) : (
          <span className="flex items-center gap-1">
            <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-[10px] text-primary font-bold">
              {problem.author.charAt(0).toUpperCase()}
            </span>
            <span className="ml-1 text-foreground/80">{problem.author}</span>
          </span>
        )}
        <span>{"•"}</span>
        <span>{problem.createdAt}</span>
      </div>
    </div>
  );
}
