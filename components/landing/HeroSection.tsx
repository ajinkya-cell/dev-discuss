"use client";

import { motion } from "framer-motion";
import { Code, Database, Terminal, Zap, Cpu, Braces, ArrowDown } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const floatingIcons = [
    { Icon: Code, top: "15%", left: "8%", delay: 0, color: "#a78bfa", size: 52 },
    { Icon: Database, top: "65%", left: "6%", delay: 0.3, color: "#7c3aed", size: 44 },
    { Icon: Terminal, top: "20%", left: "85%", delay: 0.5, color: "#34d399", size: 48 },
    { Icon: Zap, top: "72%", left: "82%", delay: 0.7, color: "#fbbf24", size: 42 },
    { Icon: Cpu, top: "40%", left: "92%", delay: 0.9, color: "#f472b6", size: 38 },
    { Icon: Braces, top: "82%", left: "25%", delay: 1.1, color: "#38bdf8", size: 46 },
  ];

  return (
    <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden w-full">
      {/* Ambient glow layers */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full bg-primary/[0.04] blur-[150px] pointer-events-none" />
      <div className="absolute top-[30%] left-[25%] w-[500px] h-[500px] rounded-full bg-secondary/[0.08] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[20%] w-[400px] h-[400px] rounded-full bg-[#34d399]/[0.05] blur-[100px] pointer-events-none" />

      {/* Grid background */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(rgba(167,139,250,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(167,139,250,0.3) 1px, transparent 1px)`,
        backgroundSize: "80px 80px",
      }} />

      {/* Floating coloured icons */}
      {mounted && floatingIcons.map((item, idx) => {
        const xOffset = (mousePosition.x - (typeof window !== "undefined" ? window.innerWidth / 2 : 0)) * 0.04 * (idx % 2 === 0 ? 1 : -1);
        const yOffset = (mousePosition.y - (typeof window !== "undefined" ? window.innerHeight / 2 : 0)) * 0.04 * (idx % 2 === 0 ? 1 : -1);

        return (
          <motion.div
            key={idx}
            className="absolute pointer-events-none"
            style={{ top: item.top, left: item.left, color: item.color }}
            animate={{
              y: [0, -20, 0],
              x: xOffset,
              rotate: [0, 8, -8, 0],
            }}
            transition={{
              y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: item.delay },
              x: { type: "spring", bounce: 0, duration: 2 },
            }}
          >
            <item.Icon size={item.size} className="opacity-25 drop-shadow-lg" />
          </motion.div>
        );
      })}

      {/* Rising particles */}
      {mounted && Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-[2px] h-[2px] rounded-full pointer-events-none"
          style={{
            top: `${60 + Math.random() * 40}%`,
            left: `${Math.random() * 100}%`,
            backgroundColor: ["#a78bfa", "#7c3aed", "#34d399", "#fbbf24", "#f472b6", "#38bdf8"][i % 6],
          }}
          animate={{
            y: [0, -200],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: 4 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 6,
            ease: "linear",
          }}
        />
      ))}

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-5xl px-6 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 mb-8 px-5 py-2 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-primary text-sm font-mono tracking-wider">DevDiscuss v1.0</span>
          </motion.div>

          {/* Heading — Instrument Sans italic */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-8 tracking-tight leading-[0.95]" style={{ fontFamily: "var(--font-instrument)" }}>
            <span className="text-foreground">Where developers</span>
            <br />
            <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-primary via-highlight to-[#34d399]">
              ask better
            </span>
            <br />
            <span className="text-foreground">questions.</span>
          </h1>

          {/* Subtitle — mono font */}
          <p className="text-lg md:text-xl text-muted mb-12 max-w-2xl mx-auto font-mono leading-relaxed">
            An elegant platform to learn, solve, and connect
            <br className="hidden sm:block" />
            with developers <span className="text-primary">globally</span>.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/problems"
              className="group relative px-10 py-4 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold text-base transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(167,139,250,0.3)] hover:shadow-[0_0_60px_rgba(167,139,250,0.5)] overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Explore Problems
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="transition-transform group-hover:translate-x-1">
                  <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-secondary to-primary opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            
            <Link
              href="/ask"
              className="group px-10 py-4 rounded-xl bg-white/[0.03] border border-white/10 text-foreground font-semibold text-base backdrop-blur-md transition-all hover:bg-white/[0.08] hover:border-white/20 hover:scale-105 active:scale-95"
            >
              <span className="flex items-center gap-2">
                Ask a Question
                <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs">?</span>
              </span>
            </Link>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="flex items-center gap-8 mt-16 font-mono text-sm text-muted/60"
          >
            <span>we can make it simpler</span>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted/40"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="text-xs font-mono tracking-widest uppercase">Scroll</span>
        <ArrowDown className="w-4 h-4" />
      </motion.div>
    </section>
  );
}
