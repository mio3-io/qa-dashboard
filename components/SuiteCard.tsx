"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MiniDonut } from "@/components/MiniDonut";
import { ArrowUpRight, GitBranch, GitCommit, Clock, ExternalLink } from "lucide-react";
import { formatDistanceToNow, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { formatDuration, formatPct } from "@/lib/data";
import type { Suite } from "@/lib/types";

interface SuiteCardProps {
  suite: Suite;
  index: number;
}

const ringByColor: Record<string, string> = {
  violet: "from-brand-violet to-brand-fuchsia",
  cyan: "from-brand-cyan to-brand-sky",
  emerald: "from-brand-emerald to-brand-lime",
  rose: "from-brand-rose to-brand-fuchsia",
  amber: "from-brand-amber to-brand-rose",
  sky: "from-brand-sky to-brand-cyan",
};

export function SuiteCard({ suite, index }: SuiteCardProps) {
  const s = suite.summary;
  const status: "ok" | "warn" | "danger" =
    s.failed > 0 ? "danger" : s.skipped > 0 ? "warn" : "ok";

  const accent = status === "ok"
    ? ringByColor.emerald
    : status === "warn"
      ? ringByColor.amber
      : ringByColor.rose;

  let when = "—";
  try {
    when = formatDistanceToNow(parseISO(suite.timestamp), { addSuffix: true });
  } catch {}

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.05 * index, ease: "easeOut" }}
      className="group relative overflow-hidden rounded-2xl glass glass-hover transition-all"
    >
      <div className={cn("absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r opacity-80", accent)} />
      <Link href={`/suites/${suite.id}`} className="block p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-white truncate">
                {suite.name}
              </h3>
              <span
                className={cn(
                  "inline-block h-2 w-2 rounded-full",
                  status === "ok" ? "bg-brand-emerald" : status === "warn" ? "bg-brand-amber" : "bg-brand-rose",
                )}
              />
            </div>
            <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3 w-3" /> {when}
              </span>
              {suite.branch && (
                <span className="inline-flex items-center gap-1">
                  <GitBranch className="h-3 w-3" /> {suite.branch}
                </span>
              )}
              {suite.commitShort && (
                <span className="inline-flex items-center gap-1 font-mono">
                  <GitCommit className="h-3 w-3" /> {suite.commitShort}
                </span>
              )}
            </div>
          </div>
          <ArrowUpRight className="h-4 w-4 text-slate-500 group-hover:text-white transition-colors" />
        </div>

        <div className="mt-5 grid grid-cols-[auto_1fr] items-center gap-5">
          <MiniDonut
            passed={s.passed}
            failed={s.failed}
            skipped={s.skipped}
            label={formatPct(s.passRate)}
            size={112}
            thickness={14}
          />

          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
            <KV label="Total" value={s.total} />
            <KV label="Duration" value={formatDuration(s.duration)} mono />
            <KV label="Passed" value={s.passed} color="text-brand-emerald" />
            <KV label="Failed" value={s.failed} color="text-brand-rose" />
            <KV label="Skipped" value={s.skipped} color="text-slate-400" />
            <KV label="Features" value={suite.features.length} />
          </div>
        </div>

        {suite.runUrl && (
          <div className="mt-5 pt-4 border-t border-white/5 text-xs">
            <span className="inline-flex items-center gap-1 text-brand-cyan hover:underline">
              View on GitHub <ExternalLink className="h-3 w-3" />
            </span>
          </div>
        )}
      </Link>
    </motion.div>
  );
}

function KV({
  label,
  value,
  color = "text-slate-100",
  mono,
}: {
  label: string;
  value: React.ReactNode;
  color?: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-400">{label}</span>
      <span className={cn(color, mono && "font-mono")}>{value}</span>
    </div>
  );
}
