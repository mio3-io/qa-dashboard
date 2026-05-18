"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  MinusCircle,
  Clock,
  ChevronDown,
  Camera,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDuration, classForStatus, assetPath } from "@/lib/data";
import type { Feature, Scenario, Step } from "@/lib/types";

interface ScenarioListProps {
  features: Feature[];
}

export function ScenarioList({ features }: ScenarioListProps) {
  return (
    <div className="space-y-4">
      {features.map((f) => (
        <div key={f.slug} className="rounded-2xl glass overflow-hidden">
          <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
            <h3 className="font-semibold text-white">{f.name}</h3>
            <div className="flex items-center gap-2 text-xs">
              <span className="chip chip-passed">{f.passed} passed</span>
              {f.failed > 0 && <span className="chip chip-failed">{f.failed} failed</span>}
              {f.skipped > 0 && <span className="chip chip-skipped">{f.skipped} skipped</span>}
            </div>
          </div>
          <ul className="divide-y divide-white/5">
            {f.scenarios.map((s, idx) => (
              <ScenarioRow key={`${f.slug}-${idx}`} scenario={s} index={idx} />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function ScenarioRow({
  scenario: s,
  index,
}: {
  scenario: Scenario;
  index: number;
}) {
  // Failed scenarios default expanded; others collapsed.
  const [open, setOpen] = useState(s.status === "failed");
  const hasSteps = Array.isArray(s.steps) && s.steps.length > 0;

  return (
    <motion.li
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.02, 0.4) }}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "w-full px-5 py-3 grid grid-cols-[auto_1fr_auto_auto] items-center gap-4 text-left transition-colors",
          "hover:bg-white/[0.02]",
        )}
      >
        <StatusIcon status={s.status} />
        <div className="min-w-0">
          <div className="text-sm text-slate-100 truncate">{s.name}</div>
          {s.tags.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-1">
              {s.tags.slice(0, 6).map((t) => (
                <span key={t} className={cn("chip", classForStatus(s.status))}>
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs text-slate-400 font-mono">
          <Clock className="h-3 w-3" />
          {formatDuration(s.duration)}
        </span>
        {hasSteps ? (
          <ChevronDown
            className={cn(
              "h-4 w-4 text-slate-500 transition-transform",
              open && "rotate-180",
            )}
          />
        ) : (
          <span className="w-4" />
        )}
      </button>

      <AnimatePresence initial={false}>
        {open && hasSteps && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-4">
              <StepsList steps={s.steps} />
              {s.failureMessage && (
                <pre className="mt-3 max-h-48 overflow-auto whitespace-pre-wrap rounded-md bg-black/40 p-3 text-[0.72rem] text-rose-200 font-mono border border-rose-500/20">
                  {s.failureMessage}
                </pre>
              )}
              {s.screenshot && (
                <a
                  href={assetPath(`/data/${s.screenshot}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs text-brand-cyan hover:underline"
                >
                  <Camera className="h-3.5 w-3.5" />
                  View failure screenshot →
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
}

function StepsList({ steps }: { steps: Step[] }) {
  return (
    <ol className="space-y-1.5 border-l-2 border-white/5 pl-4 mt-2">
      {steps.map((step, i) => (
        <li
          key={i}
          className="grid grid-cols-[auto_1fr_auto] items-center gap-3 py-1"
        >
          <StatusDot status={step.status} />
          <div className="text-[0.85rem] leading-snug">
            <span className="font-mono text-slate-500 mr-2">
              {step.keyword}
            </span>
            <span
              className={cn(
                step.status === "failed" ? "text-rose-200"
                  : step.status === "skipped" ? "text-slate-500"
                  : "text-slate-200",
              )}
            >
              {step.text}
            </span>
            {step.screenshot && (
              <a
                href={assetPath(`/data/${step.screenshot}`)}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 inline-flex items-center gap-1 text-[0.7rem] text-brand-cyan hover:underline"
              >
                <Camera className="h-3 w-3" />
                screenshot
              </a>
            )}
          </div>
          <span className="font-mono text-[0.7rem] text-slate-500 tabular-nums">
            {formatDuration(step.duration)}
          </span>
        </li>
      ))}
    </ol>
  );
}

function StatusIcon({ status }: { status: string }) {
  if (status === "passed")
    return <CheckCircle2 className="h-4 w-4 text-brand-emerald" />;
  if (status === "failed")
    return <XCircle className="h-4 w-4 text-brand-rose" />;
  return <MinusCircle className="h-4 w-4 text-slate-500" />;
}

function StatusDot({ status }: { status: string }) {
  const cls =
    status === "passed"
      ? "bg-brand-emerald"
      : status === "failed"
        ? "bg-brand-rose"
        : "bg-slate-500";
  return (
    <span
      className={cn(
        "h-2 w-2 rounded-full shrink-0",
        cls,
        status === "failed" && "animate-pulse",
      )}
    />
  );
}
