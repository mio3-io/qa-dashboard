"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import {
  CheckCircle2,
  XCircle,
  MinusCircle,
  Clock,
  GitCommit,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDuration, formatPct } from "@/lib/data";
import type { HistoryEntry, HistoryFeature } from "@/lib/types";

interface RunsListProps {
  history: HistoryEntry[];
}

export function RunsList({ history }: RunsListProps) {
  const reversed = [...history].reverse(); // newest first

  return (
    <div className="rounded-2xl glass overflow-hidden">
      <div className="hidden md:grid grid-cols-[1.1fr_1fr_0.6fr_0.6fr_1.4fr_0.7fr_auto] gap-4 px-5 py-3 text-[0.7rem] uppercase tracking-[0.16em] text-slate-500 border-b border-white/5">
        <span>When</span>
        <span>Aggregate</span>
        <span>Pass rate</span>
        <span>Duration</span>
        <span>Suites</span>
        <span className="text-right">Status</span>
        <span className="w-4" />
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
  const a = run.aggregate;
  const status: "ok" | "warn" | "danger" =
    a.failed > 0 ? "danger" : a.skipped > 0 ? "warn" : "ok";

  // Failed runs default expanded; older healthy runs collapsed.
  const [open, setOpen] = useState(status === "danger" && index < 3);

  let when = "—";
  let absolute = "";
  try {
    const d = parseISO(run.timestamp);
    when = formatDistanceToNow(d, { addSuffix: true });
    absolute = format(d, "MMM d yyyy · HH:mm");
  } catch {}

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
  const statusChip = {
    ok: "chip-passed",
    warn: "chip-skipped",
    danger: "chip-failed",
  }[status];

  const hasFeatures = run.suites.some(
    (s) => Array.isArray(s.features) && s.features.length > 0,
  );

  return (
    <motion.li
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.02, 0.4) }}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full grid md:grid-cols-[1.1fr_1fr_0.6fr_0.6fr_1.4fr_0.7fr_auto] gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors items-center text-left"
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
            const sChip =
              s.summary.failed > 0
                ? "chip-failed"
                : s.summary.skipped > 0
                  ? "chip-skipped"
                  : "chip-passed";
            return (
              <span
                key={s.id}
                className={cn("chip", sChip)}
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
          <span className={cn("chip", statusChip)}>{statusLabel}</span>
        </div>

        <ChevronDown
          className={cn(
            "h-4 w-4 text-slate-500 transition-transform shrink-0",
            open && "rotate-180",
            !hasFeatures && "opacity-30",
          )}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && hasFeatures && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-1 grid gap-4 md:grid-cols-2">
              {run.suites.map((s) => (
                <SuiteFeatures
                  key={s.id}
                  suiteName={s.name}
                  commit={s.commit}
                  features={s.features ?? []}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
}

function SuiteFeatures({
  suiteName,
  commit,
  features,
}: {
  suiteName: string;
  commit: string;
  features: HistoryFeature[];
}) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-white">{suiteName}</h4>
        {commit && (
          <span className="chip font-mono">
            <GitCommit className="h-3 w-3" />
            {commit}
          </span>
        )}
      </div>

      {features.length === 0 ? (
        <div className="text-xs text-slate-500">No feature breakdown for this run.</div>
      ) : (
        <ul className="space-y-1.5">
          {features.map((f, i) => (
            <li
              key={i}
              className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-3 text-xs"
            >
              <StatusDot status={f.status} />
              <span className="text-slate-200 truncate">{f.name}</span>
              <span className="font-mono text-slate-400 tabular-nums">
                <span className="text-brand-emerald">{f.passed}</span>
                <span className="text-slate-600">/</span>
                <span>{f.tests}</span>
              </span>
              <span className="font-mono text-[0.7rem] text-slate-500 tabular-nums">
                {formatDuration(f.duration)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
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

function StatusDot({ status }: { status: string }) {
  const cls =
    status === "passed"
      ? "bg-brand-emerald"
      : status === "failed"
        ? "bg-brand-rose"
        : "bg-slate-500";
  return <span className={cn("h-2 w-2 rounded-full shrink-0", cls)} />;
}
