"use client";

import { LogOut, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });
      if (res.ok) {
        router.push("/login"); // or "/" depending on where we want to redirect
        router.refresh(); // to ensure server components update
      }
    } catch (error) {
      console.error("Failed to logout", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      title="Logout"
      className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-muted hover:text-red-400 hover:bg-white/20 hover:border-red-400/30 transition-all overflow-hidden disabled:opacity-50"
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <LogOut className="w-4 h-4" />
      )}
    </button>
  );
}
