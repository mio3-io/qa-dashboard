"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

type Tone = "violet" | "emerald" | "rose" | "amber" | "cyan";

const toneStyles: Record<Tone, { ring: string; bar: string; text: string; glow: string }> = {
  violet: {
    ring: "from-brand-violet to-brand-fuchsia",
    bar: "from-brand-violet to-brand-fuchsia",
    text: "text-brand-violet",
    glow: "shadow-[0_20px_60px_-20px_rgba(139,92,246,0.5)]",
  },
  emerald: {
    ring: "from-brand-emerald to-brand-lime",
    bar: "from-brand-emerald to-brand-lime",
    text: "text-brand-emerald",
    glow: "shadow-[0_20px_60px_-20px_rgba(52,211,153,0.5)]",
  },
  rose: {
    ring: "from-brand-rose to-brand-fuchsia",
    bar: "from-brand-rose to-brand-fuchsia",
    text: "text-brand-rose",
    glow: "shadow-[0_20px_60px_-20px_rgba(251,113,133,0.5)]",
  },
  amber: {
    ring: "from-brand-amber to-brand-rose",
    bar: "from-brand-amber to-brand-rose",
    text: "text-brand-amber",
    glow: "shadow-[0_20px_60px_-20px_rgba(251,191,36,0.5)]",
  },
  cyan: {
    ring: "from-brand-cyan to-brand-sky",
    bar: "from-brand-cyan to-brand-sky",
    text: "text-brand-cyan",
    glow: "shadow-[0_20px_60px_-20px_rgba(34,211,238,0.5)]",
  },
};

interface KpiCardProps {
  label: string;
  value: string;
  hint?: string;
  icon?: LucideIcon;
  tone?: Tone;
  progress?: number; // 0-1
  index?: number;
}

export function KpiCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "violet",
  progress,
  index = 0,
}: KpiCardProps) {
  const s = toneStyles[tone];
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
      className={cn(
        "group relative overflow-hidden rounded-2xl glass glass-hover transition-all",
        s.glow,
      )}
    >
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r opacity-80",
          s.bar,
        )}
      />
      <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br opacity-10 blur-2xl group-hover:opacity-25 transition-opacity"
           style={{ backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }}
      />
      <div className="relative p-5">
        <div className="flex items-start justify-between">
          <div className="text-[0.65rem] uppercase tracking-[0.18em] text-slate-400">
            {label}
          </div>
          {Icon && (
            <div
              className={cn(
                "rounded-lg p-1.5 bg-white/[0.04] border border-white/5",
                s.text,
              )}
            >
              <Icon className="h-4 w-4" />
            </div>
          )}
        </div>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="font-mono text-3xl font-semibold text-white tabular-nums">
            {value}
          </span>
          {hint && (
            <span className="text-xs text-slate-400">{hint}</span>
          )}
        </div>

        {typeof progress === "number" && (
          <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.04]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }}
              transition={{ duration: 0.9, delay: 0.2 + index * 0.08, ease: "easeOut" }}
              className={cn("h-full rounded-full bg-gradient-to-r", s.bar)}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}
