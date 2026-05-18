"use client";

import { motion } from "framer-motion";
import { BarList } from "@tremor/react";
import type { TagBucket } from "@/lib/types";

interface TagBreakdownProps {
  tags: TagBucket[];
}

export function TagBreakdown({ tags }: TagBreakdownProps) {
  const passed = tags
    .map((t) => ({ name: t.tag, value: t.passed }))
    .filter((d) => d.value > 0)
    .sort((a, b) => b.value - a.value);
  const failed = tags
    .map((t) => ({ name: t.tag, value: t.failed }))
    .filter((d) => d.value > 0)
    .sort((a, b) => b.value - a.value);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Panel title="Top tags by passed scenarios" data={passed} color="emerald" delay={0} />
      <Panel title="Top tags by failed scenarios" data={failed} color="rose" delay={0.1} />
    </div>
  );
}

function Panel({
  title,
  data,
  color,
  delay,
}: {
  title: string;
  data: { name: string; value: number }[];
  color: "emerald" | "rose";
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className="rounded-2xl glass p-5"
    >
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      <p className="text-xs text-slate-400 mt-1">
        Aggregated across all features in the latest run
      </p>
      {data.length === 0 ? (
        <div className="mt-6 text-xs text-slate-500">No data.</div>
      ) : (
        <BarList
          data={data}
          color={color}
          className="mt-4"
          valueFormatter={(v: number) => `${v}`}
        />
      )}
    </motion.div>
  );
}
