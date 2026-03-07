import Link from "next/link";
import { Hash, Github, Twitter, Mail, GithubIcon, LucideGithub } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/[0.04] bg-[#08080c]">
      {/* Top section */}
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-12">
        <div className="grid md:grid-cols-4 gap-12 md:gap-8">
          
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                <Hash className="w-4 h-4 text-primary" />
              </div>
              <span className="font-bold text-lg tracking-tight text-foreground">DevDiscuss</span>
            </div>
            <p className="text-sm text-muted/60 leading-relaxed font-mono">
              Where developers ask better questions and build better solutions.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-xs font-mono tracking-[0.2em] uppercase text-muted/40 mb-5">Platform</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/problems" className="text-sm text-muted hover:text-foreground transition-colors font-mono">
                  Explore
                </Link>
              </li>
              <li>
                <Link href="/trending" className="text-sm text-muted hover:text-foreground transition-colors font-mono">
                  Trending
                </Link>
              </li>
              <li>
                <Link href="/tags" className="text-sm text-muted hover:text-foreground transition-colors font-mono">
                  Tags
                </Link>
              </li>
              <li>
                <Link href="/ask" className="text-sm text-muted hover:text-foreground transition-colors font-mono">
                  Ask Question
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-xs font-mono tracking-[0.2em] uppercase text-muted/40 mb-5">Resources</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-sm text-muted hover:text-foreground transition-colors font-mono">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted hover:text-foreground transition-colors font-mono">
                  API Reference
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted hover:text-foreground transition-colors font-mono">
                  Contributing
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted hover:text-foreground transition-colors font-mono">
                  Changelog
                </a>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-xs font-mono tracking-[0.2em] uppercase text-muted/40 mb-5">Connect</h4>
            <div className="flex items-center gap-3 mb-6">
              <a href="#" className="w-9 h-9 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-muted hover:text-foreground hover:bg-white/[0.06] hover:border-white/10 transition-all">
                <LucideGithub className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-muted hover:text-foreground hover:bg-white/[0.06] hover:border-white/10 transition-all">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-muted hover:text-foreground hover:bg-white/[0.06] hover:border-white/10 transition-all">
                <Mail className="w-4 h-4" />
              </a>
            </div>
            <p className="text-xs text-muted/40 font-mono leading-relaxed">
              Built with Next.js, Drizzle, and PostgreSQL.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/[0.04]">
        <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted/30 font-mono">
            &copy; {new Date().getFullYear()} DevDiscuss. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs text-muted/30 hover:text-muted/60 font-mono transition-colors">Privacy</a>
            <a href="#" className="text-xs text-muted/30 hover:text-muted/60 font-mono transition-colors">Terms</a>
            <a href="#" className="text-xs text-muted/30 hover:text-muted/60 font-mono transition-colors">License</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
