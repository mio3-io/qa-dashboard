import type { AggregateRun, HistoryEntry, Suite } from "./types";
import runsJson from "@/public/data/runs.json";
import historyJson from "@/public/data/history.json";

export function getRuns(): AggregateRun {
  return runsJson as unknown as AggregateRun;
}

export function getHistory(): HistoryEntry[] {
  return historyJson as unknown as HistoryEntry[];
}

export function getSuites(): Suite[] {
  return getRuns().suites;
}

export function getSuite(id: string): Suite | undefined {
  return getRuns().suites.find((s) => s.id === id);
}

export function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return "0s";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) return `${secs.toFixed(1)}s`;
  return `${mins}m ${secs.toFixed(0)}s`;
}

export function formatPct(rate: number): string {
  return `${(rate * 100).toFixed(1)}%`;
}

export function classForStatus(status: string): string {
  switch (status) {
    case "passed":
      return "chip-passed";
    case "failed":
      return "chip-failed";
    default:
      return "chip-skipped";
  }
}

export function assetPath(p: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  if (!p) return base;
  if (p.startsWith("http")) return p;
  return `${base}${p.startsWith("/") ? p : `/${p}`}`;
}
