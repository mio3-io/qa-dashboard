"use client";

import { motion } from "framer-motion";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import {
  CheckCircle2,
  XCircle,
  MinusCircle,
  Clock,
  GitCommit,
  GitBranch,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDuration, formatPct } from "@/lib/data";
import type { HistoryEntry } from "@/lib/types";

interface RunsListProps {
  history: HistoryEntry[];
}

export function RunsList({ history }: RunsListProps) {
  const reversed = [...history].reverse(); // newest first

  return (
    <div className="rounded-2xl glass overflow-hidden">
      <div className="hidden md:grid grid-cols-[1.2fr_1fr_0.6fr_0.6fr_1.3fr_0.7fr] gap-4 px-5 py-3 text-[0.7rem] uppercase tracking-[0.16em] text-slate-500 border-b border-white/5">
        <span>When</span>
        <span>Aggregate</span>
        <span>Pass rate</span>
        <span>Duration</span>
        <span>Suites</span>
        <span className="text-right">Status</span>
      </div>
      <ul className="divide-y divide-white/5">
        {reversed.map((run, i) => (
          <RunRow key={run.timestamp + i} run={run} index={i} />
        ))}
      </ul>
    </div>
  );
}

function RunRow({ run, index }: { run: HistoryEntry; index: number }) {
  let when = "—";
  let absolute = "";
  try {
    const d = parseISO(run.timestamp);
    when = formatDistanceToNow(d, { addSuffix: true });
    absolute = format(d, "MMM d yyyy · HH:mm");
  } catch {}

  const a = run.aggregate;
  const status: "ok" | "warn" | "danger" =
    a.failed > 0 ? "danger" : a.skipped > 0 ? "warn" : "ok";
  const statusDot = {
    ok: "bg-brand-emerald",
    warn: "bg-brand-amber",
    danger: "bg-brand-rose",
  }[status];
  const statusLabel = {
    ok: "Passed",
    warn: "Skipped",
    danger: "Failed",
  }[status];

  return (
    <motion.li
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.02, 0.4) }}
      className="grid md:grid-cols-[1.2fr_1fr_0.6fr_0.6fr_1.3fr_0.7fr] gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors items-center"
    >
      <div className="flex items-center gap-3 min-w-0">
        <span className={cn("h-2 w-2 rounded-full shrink-0", statusDot)} />
        <div className="min-w-0">
          <div className="text-sm text-slate-100 truncate">{absolute}</div>
          <div className="text-[0.7rem] text-slate-500">{when}</div>
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs">
        <Stat icon={CheckCircle2} color="text-brand-emerald" value={a.passed} />
        <Stat icon={XCircle} color="text-brand-rose" value={a.failed} />
        <Stat icon={MinusCircle} color="text-slate-400" value={a.skipped} />
      </div>

      <div className="font-mono text-sm text-white tabular-nums">
        {formatPct(a.passRate)}
      </div>

      <div className="font-mono text-xs text-slate-300 inline-flex items-center gap-1">
        <Clock className="h-3 w-3 text-slate-500" />
        {formatDuration(a.duration)}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {run.suites.map((s) => {
          const sStatus =
            s.summary.failed > 0
              ? "chip-failed"
              : s.summary.skipped > 0
                ? "chip-skipped"
                : "chip-passed";
          return (
            <span
              key={s.id}
              className={cn("chip", sStatus)}
              title={`${s.summary.passed}/${s.summary.total} passed`}
            >
              {s.name.replace(/.* · /, "")}
              <span className="opacity-70 font-mono">
                {Math.round(s.summary.passRate * 100)}%
              </span>
            </span>
          );
        })}
        {run.suites[0]?.commit && (
          <span className="chip font-mono">
            <GitCommit className="h-3 w-3" />
            {run.suites[0].commit}
          </span>
        )}
      </div>

      <div className="text-right">
        <span
          className={cn(
            "chip",
            status === "ok" ? "chip-passed" : status === "warn" ? "chip-skipped" : "chip-failed",
          )}
        >
          {statusLabel}
        </span>
      </div>
    </motion.li>
  );
}

function Stat({
  icon: Icon,
  color,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  value: number;
}) {
  return (
    <span className="inline-flex items-center gap-1 text-slate-300">
      <Icon className={cn("h-3.5 w-3.5", color)} />
      <span className="font-mono tabular-nums">{value}</span>
    </span>
  );
}
