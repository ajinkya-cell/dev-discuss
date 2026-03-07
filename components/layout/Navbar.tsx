import Link from "next/link";
import { User } from "lucide-react";
import { cookies } from "next/headers";
import SearchBar from "./SearchBar";
import { LogoutButton } from "../LogoutButton";

export default async function Navbar() {
  const cookieStore = await cookies();
  const isSignedIn = !!cookieStore.get("token");

  return (
    <header className="sticky top-0 z-50 w-full h-16 border-b border-white/5 bg-background/80 backdrop-blur-xl flex items-center justify-between px-4 md:px-6">
      <div className="flex md:hidden items-center gap-2">
        <Link href="/" className="font-bold text-lg text-foreground">
          DevDiscuss
        </Link>
      </div>
      
      <div className="hidden md:flex flex-1" />

      {/* Global Search */}
      <div className="flex-1 max-w-xl mx-4">
        <SearchBar />
      </div>

      <div className="flex items-center gap-4 flex-1 justify-end">
        {!isSignedIn && (
          <>
            <Link 
              href="/login" 
              className="hidden md:flex items-center gap-2 text-sm text-muted hover:text-foreground font-medium transition-colors"
            >
              Sign In
            </Link>
            <Link 
              href="/register" 
              className="hidden md:flex items-center gap-2 text-sm bg-primary/10 text-primary hover:bg-primary/20 px-4 py-1.5 rounded-full font-medium transition-colors border border-primary/20"
            >
              Sign Up
            </Link>
            
            <div className="h-6 w-px bg-white/10 hidden md:block mx-1" />
          </>
        )}

        {isSignedIn && (
          <div className="flex items-center gap-2">
            <Link 
              href="/users/me"
              title="Profile"
              className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-muted hover:text-foreground hover:bg-white/20 transition-all overflow-hidden"
            >
              <User className="w-4 h-4" />
            </Link>
            <LogoutButton />
          </div>
        )}
      </div>
    </header>
  );
}
