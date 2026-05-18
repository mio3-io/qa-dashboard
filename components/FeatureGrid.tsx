"use client";

import { motion } from "framer-motion";
import { MiniDonut } from "@/components/MiniDonut";
import { cn } from "@/lib/utils";
import { formatDuration, formatPct } from "@/lib/data";
import type { Feature } from "@/lib/types";
import { ArrowUpRight, CheckCircle2, XCircle, MinusCircle, Clock } from "lucide-react";

interface FeatureGridProps {
  features: Feature[];
}

export function FeatureGrid({ features }: FeatureGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {features.map((f, i) => (
        <FeatureCard key={f.slug} feature={f} index={i} />
      ))}
    </div>
  );
}

function FeatureCard({ feature, index }: { feature: Feature; index: number }) {
  const total = feature.tests || 1;
  const passRate = feature.passed / total;
  const status: "ok" | "warn" | "danger" =
    feature.failed > 0 ? "danger" : feature.skipped > 0 ? "warn" : "ok";

  const tone = {
    ok: { ring: "from-brand-emerald to-brand-lime", icon: "text-brand-emerald" },
    warn: { ring: "from-brand-amber to-brand-rose", icon: "text-brand-amber" },
    danger: { ring: "from-brand-rose to-brand-fuchsia", icon: "text-brand-rose" },
  }[status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.05 * index, ease: "easeOut" }}
      className="group relative overflow-hidden rounded-2xl glass glass-hover transition-all"
    >
      <div className={cn("absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r opacity-80", tone.ring)} />
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-semibold text-white truncate">
              {feature.name}
            </h3>
            <div className="mt-1 flex items-center gap-3 text-xs text-slate-400">
              <span className="font-mono">{feature.tests} tests</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatDuration(feature.duration)}
              </span>
            </div>
          </div>
          <ArrowUpRight className="h-4 w-4 text-slate-500 group-hover:text-white transition-colors" />
        </div>

        <div className="mt-4 grid grid-cols-[auto_1fr] items-center gap-4">
          <MiniDonut
            passed={feature.passed}
            failed={feature.failed}
            skipped={feature.skipped}
            label={formatPct(passRate)}
            size={88}
            thickness={11}
          />

          <div className="space-y-1.5 text-xs">
            <Row icon={CheckCircle2} color="text-brand-emerald" label="Passed" value={feature.passed} />
            <Row icon={XCircle} color="text-brand-rose" label="Failed" value={feature.failed} />
            <Row icon={MinusCircle} color="text-slate-400" label="Skipped" value={feature.skipped} />
          </div>
        </div>

        {feature.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {feature.tags.slice(0, 6).map((t) => (
              <span key={t} className="chip">{t}</span>
            ))}
            {feature.tags.length > 6 && (
              <span className="chip">+{feature.tags.length - 6}</span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function Row({
  icon: Icon,
  color,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="inline-flex items-center gap-1.5 text-slate-300">
        <Icon className={`h-3.5 w-3.5 ${color}`} />
        {label}
      </span>
      <span className="font-mono text-slate-100 tabular-nums">{value}</span>
    </div>
  );
}
