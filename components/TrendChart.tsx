"use client";

import { AreaChart, Card, Title } from "@tremor/react";
import { motion } from "framer-motion";
import type { HistoryEntry } from "@/lib/types";
import { format, parseISO } from "date-fns";

interface TrendChartProps {
  history: HistoryEntry[];
  title?: string;
}

export function TrendChart({ history, title }: TrendChartProps) {
  const data = history.map((entry) => ({
    date: format(parseISO(entry.timestamp), "MMM d HH:mm"),
    Passed: entry.aggregate.passed,
    Failed: entry.aggregate.failed,
    Skipped: entry.aggregate.skipped,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
    >
      <Card className="!bg-ink-900/60 !border-white/5 overflow-hidden">
        <div className="flex items-center justify-between">
          <div>
            <Title className="!text-white">
              {title ?? `Trend across last ${history.length} aggregated runs`}
            </Title>
            <p className="text-xs text-slate-400 mt-1">
              Passed · Failed · Skipped over time (all suites combined)
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <Legend color="bg-brand-emerald" label="Passed" />
            <Legend color="bg-brand-rose" label="Failed" />
            <Legend color="bg-slate-500" label="Skipped" />
          </div>
        </div>

        <AreaChart
          className="mt-6 h-72"
          data={data}
          index="date"
          categories={["Passed", "Failed", "Skipped"]}
          colors={["emerald", "rose", "slate"]}
          showLegend={false}
          showGridLines={false}
          showAnimation
          curveType="monotone"
          yAxisWidth={36}
          valueFormatter={(v) => `${v}`}
        />
      </Card>
    </motion.div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`h-2 w-2 rounded-full ${color}`} />
      {label}
    </span>
  );
}
