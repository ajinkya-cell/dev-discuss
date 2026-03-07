"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, Loader2, Trophy } from "lucide-react";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("/api/users");
        if (res.ok) {
          const data = await res.json();
          setUsers(data);
        }
      } catch (error) {
        console.error("Failed to fetch users");
      } finally {
        setIsLoading(false);
      }
    }
    fetchUsers();
  }, []);

  return (
    <div className="max-w-4xl mx-auto w-full">
      <div className="mb-8 pb-4 border-b border-white/5">
        <h1 className="text-3xl font-bold tracking-tight mb-2 text-foreground flex items-center gap-3">
          <Users className="w-8 h-8 text-primary" />
          Top Developers
        </h1>
        <p className="text-muted">Discover and connect with top developers based on their reputation.</p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted">
          <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
          <p className="animate-pulse">Loading developers...</p>
        </div>
      ) : users.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {users.slice(0, 5).map((user, index) => (
            <Link 
              key={user.id} 
              href={`/users/${user.id}`}
              className="flex items-center gap-4 p-5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-primary/50 hover:bg-white/[0.04] transition-all group"
            >
              <div className="w-12 h-12 rounded-full border border-white/10 bg-black/50 overflow-hidden flex items-center justify-center text-xl font-bold text-primary shadow-sm shrink-0 relative">
                {(user.name || "A").charAt(0).toUpperCase()}
                {index === 0 && (
                  <div className="absolute -top-1 -right-1 text-yellow-400">
                     <Trophy className="w-4 h-4" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors flex items-center gap-2">
                  {user.name || "Anonymous"}
                </h3>
                <p className="text-xs text-muted truncate">
                  @{user.email ? user.email.split("@")[0] : `user_${user.id}`}
                </p>
              </div>
              <div className="flex flex-col items-end justify-center shrink-0 ml-2">
                 <span className="text-lg font-mono font-bold text-transparent bg-clip-text bg-gradient-to-br from-primary to-highlight leading-none">
                  {user.reputation || 0}
                 </span>
                 <span className="text-[10px] uppercase tracking-widest text-muted mt-1 font-semibold">Rep</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-muted border border-white/5 rounded-xl bg-white/[0.02]">
          No developers found yet.
        </div>
      )}
    </div>
  );
}
