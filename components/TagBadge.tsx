import Link from "next/link";

interface TagBadgeProps {
  tag: string;
}

export function TagBadge({ tag }: TagBadgeProps) {
  return (
    <Link
      href={`/tags/${tag}`}
      className="px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider rounded-md bg-secondary/10 text-secondary border border-secondary/20 hover:bg-secondary/20 hover:border-secondary/30 transition-colors"
    >
      {tag}
    </Link>
  );
}
