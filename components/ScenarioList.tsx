"use client";

import { motion } from "framer-motion";
import { CheckCircle2, XCircle, MinusCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDuration, classForStatus, assetPath } from "@/lib/data";
import type { Feature } from "@/lib/types";

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
              <motion.li
                key={`${f.slug}-${idx}`}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.02 }}
                className="px-5 py-3 grid grid-cols-[auto_1fr_auto] items-center gap-4"
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
                  {s.failureMessage && (
                    <pre className="mt-2 max-h-32 overflow-auto whitespace-pre-wrap rounded-md bg-black/30 p-2 text-[0.7rem] text-rose-200 font-mono border border-rose-500/20">
                      {s.failureMessage}
                    </pre>
                  )}
                  {s.screenshot && (
                    <a
                      href={assetPath(`/data/${s.screenshot}`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block text-[0.7rem] text-brand-cyan hover:underline"
                    >
                      View failure screenshot →
                    </a>
                  )}
                </div>
                <div className="inline-flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                  <Clock className="h-3 w-3" />
                  {formatDuration(s.duration)}
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function StatusIcon({ status }: { status: string }) {
  if (status === "passed")
    return <CheckCircle2 className="h-4 w-4 text-brand-emerald" />;
  if (status === "failed")
    return <XCircle className="h-4 w-4 text-brand-rose" />;
  return <MinusCircle className="h-4 w-4 text-slate-500" />;
}
