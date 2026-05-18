"use client";

import { motion } from "framer-motion";
import {
  GitCommit,
  GitBranch,
  Clock,
  ExternalLink,
  ArrowLeft,
  Github,
} from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow, parseISO } from "date-fns";
import type { Suite } from "@/lib/types";

export function SuiteHeader({ suite }: { suite: Suite }) {
  let when = "—";
  try {
    when = formatDistanceToNow(parseISO(suite.timestamp), { addSuffix: true });
  } catch {}

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative overflow-hidden rounded-3xl glass p-6 sm:p-8"
    >
      <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-gradient-to-br from-brand-fuchsia via-brand-violet to-brand-cyan opacity-20 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-gradient-to-br from-brand-cyan via-brand-sky to-brand-violet opacity-10 blur-3xl" />

      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.2em] text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-3 w-3" /> All suites
          </Link>
          <h1 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight">
            <span className="gradient-text">{suite.name.split("·")[0].trim()}</span>
            {suite.name.includes("·") && (
              <span className="text-white"> · {suite.name.split("·")[1].trim()}</span>
            )}
          </h1>
          <p className="mt-2 text-sm text-slate-400 max-w-xl">
            Latest run from <span className="font-mono text-slate-300">{suite.repo}</span>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
          <Pill icon={Clock}>{when}</Pill>
          {suite.branch && <Pill icon={GitBranch}>{suite.branch}</Pill>}
          {suite.commitShort && <Pill icon={GitCommit} mono>{suite.commitShort}</Pill>}
          {suite.repo && (
            <a
              href={`https://github.com/${suite.repo}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 hover:border-brand-violet/60 hover:bg-white/[0.06] transition-colors"
            >
              <Github className="h-3.5 w-3.5 text-slate-400" />
              repo
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
          {suite.runUrl && (
            <a
              href={suite.runUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 hover:border-brand-violet/60 hover:bg-white/[0.06] transition-colors"
            >
              run
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function Pill({
  icon: Icon,
  children,
  mono,
}: {
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 ${
        mono ? "font-mono" : ""
      }`}
    >
      <Icon className="h-3.5 w-3.5 text-slate-400" />
      {children}
    </span>
  );
}
