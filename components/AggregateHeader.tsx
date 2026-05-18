"use client";

import { motion } from "framer-motion";
import { Clock, Layers } from "lucide-react";
import { formatDistanceToNow, parseISO } from "date-fns";
import type { AggregateRun } from "@/lib/types";

export function AggregateHeader({ runs }: { runs: AggregateRun }) {
  let when = "—";
  try {
    when = formatDistanceToNow(parseISO(runs.generatedAt), { addSuffix: true });
  } catch {}

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative overflow-hidden rounded-3xl glass p-6 sm:p-9"
    >
      <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-gradient-to-br from-brand-fuchsia via-brand-violet to-brand-cyan opacity-25 blur-3xl" />
      <div className="absolute -bottom-32 -left-32 h-72 w-72 rounded-full bg-gradient-to-br from-brand-cyan via-brand-sky to-brand-violet opacity-15 blur-3xl" />
      <div className="absolute -top-16 left-1/2 h-48 w-[60%] -translate-x-1/2 rounded-full bg-gradient-to-r from-brand-lime via-brand-emerald to-brand-cyan opacity-10 blur-3xl" />

      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-emerald opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-emerald" />
            </span>
            Multi-Suite Pulse
          </div>
          <h1 className="mt-3 text-3xl sm:text-5xl font-semibold tracking-tight leading-tight">
            <span className="gradient-text">Every test.</span>
            <br className="hidden sm:block" />
            <span className="text-white"> One source of truth.</span>
          </h1>
          <p className="mt-3 max-w-xl text-sm text-slate-400">
            Aggregated quality signal across {runs.suites.length} test suite
            {runs.suites.length === 1 ? "" : "s"} — Mobile, API, and anything
            wired into <code className="font-mono text-slate-300">sources.yml</code>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
          <Pill icon={Clock}>{when}</Pill>
          <Pill icon={Layers}>
            {runs.suites.length} suite{runs.suites.length === 1 ? "" : "s"}
          </Pill>
        </div>
      </div>
    </motion.div>
  );
}

function Pill({
  icon: Icon,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">
      <Icon className="h-3.5 w-3.5 text-slate-400" />
      {children}
    </span>
  );
}
