"use client";

import { motion } from "framer-motion";
import { HelpCircle, CheckCircle, TrendingUp, ChevronUp, Users, Lightbulb } from "lucide-react";

export default function FeatureCards() {
  const features = [
    {
      step: "01",
      title: "Ask",
      description: "Post programming problems with tags and rich descriptions. Get noticed by the right developers.",
      icon: <HelpCircle className="w-7 h-7" />,
      iconColor: "text-[#a78bfa]",
      glowColor: "bg-[#a78bfa]/20",
      borderColor: "border-[#a78bfa]/20",
    },
    {
      step: "02",
      title: "Solve",
      description: "Developers share solutions and insights. Upvote the best answers to surface quality content.",
      icon: <CheckCircle className="w-7 h-7" />,
      iconColor: "text-[#34d399]",
      glowColor: "bg-[#34d399]/20",
      borderColor: "border-[#34d399]/20",
    },
    {
      step: "03",
      title: "Learn",
      description: "Discover trending problems, follow experts, and continuously improve your technical skills.",
      icon: <TrendingUp className="w-7 h-7" />,
      iconColor: "text-[#fbbf24]",
      glowColor: "bg-[#fbbf24]/20",
      borderColor: "border-[#fbbf24]/20",
    },
  ];

  const stats = [
    { icon: <ChevronUp className="w-5 h-5 text-primary" />, label: "Community Upvotes", value: "Real-time" },
    { icon: <Users className="w-5 h-5 text-[#34d399]" />, label: "Developer Profiles", value: "Follow & Connect" },
    { icon: <Lightbulb className="w-5 h-5 text-[#fbbf24]" />, label: "Trending Topics", value: "Discover Daily" },
  ];

  return (
    <section className="py-32 px-4 w-full relative">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="max-w-6xl mx-auto">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="inline-block mb-4 text-xs font-mono tracking-[0.3em] uppercase text-primary/60 border border-primary/10 px-4 py-1.5 rounded-full bg-primary/[0.03]">
            How it works
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-5 text-foreground" style={{ fontFamily: "var(--font-instrument)" }}>
            Simple. Powerful. <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#34d399]">Elegant.</span>
          </h2>
          <p className="text-muted text-lg max-w-xl mx-auto font-mono">
            A streamlined workflow to empower learning and build better software.
          </p>
        </motion.div>

        {/* Feature cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-24">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              whileHover={{ y: -8 }}
              className={`relative bg-white/[0.02] border ${feature.borderColor} rounded-2xl p-8 backdrop-blur-sm overflow-hidden group hover:bg-white/[0.05] transition-all duration-300`}
            >
              {/* Corner glow */}
              <div className={`absolute -top-10 -right-10 w-32 h-32 ${feature.glowColor} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

              <div className="relative z-10">
                {/* Step number */}
                <span className="text-xs font-mono tracking-widest text-muted/40 mb-4 block">{feature.step}</span>
                
                {/* Icon */}
                <div className={`mb-6 p-3.5 inline-flex rounded-xl border border-white/5 bg-white/[0.03] ${feature.iconColor}`}>
                  {feature.icon}
                </div>
                
                <h3 className="text-2xl font-bold mb-3 text-foreground tracking-tight">{feature.title}</h3>
                <p className="text-muted leading-relaxed text-sm">
                  {feature.description}
                </p>
              </div>

              {/* Bottom line accent */}
              <div className={`absolute bottom-0 left-0 right-0 h-[2px] ${feature.glowColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            </motion.div>
          ))}
        </div>

        {/* Bottom stats/features row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-3 gap-4"
        >
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="flex items-center gap-4 p-5 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-colors"
            >
              <div className="p-2.5 rounded-lg bg-white/[0.04] border border-white/5">
                {stat.icon}
              </div>
              <div>
                <p className="font-mono text-xs text-muted/50 uppercase tracking-wider">{stat.label}</p>
                <p className="text-sm font-semibold text-foreground">{stat.value}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
