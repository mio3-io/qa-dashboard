"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MiniDonutProps {
  passed: number;
  failed: number;
  skipped: number;
  label?: string;
  size?: number;
  thickness?: number;
  className?: string;
}

/**
 * Custom SVG donut with three arcs (passed / failed / skipped) and a
 * centered label. Exists because Tremor's DonutChart was overflowing
 * its parent container in the small (~100px) sizes we use in cards.
 */
export function MiniDonut({
  passed,
  failed,
  skipped,
  label,
  size = 96,
  thickness = 12,
  className,
}: MiniDonutProps) {
  const total = Math.max(1, passed + failed + skipped);
  const r = (size - thickness) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;

  // Order: passed → failed → skipped (sweeps clockwise from 12 o'clock)
  const pPass = passed / total;
  const pFail = failed / total;
  const pSkip = skipped / total;

  const segments: { color: string; len: number; offset: number }[] = [];
  let consumed = 0;
  if (pPass > 0) {
    segments.push({
      color: "rgb(52 211 153)", // brand-emerald
      len: pPass * circumference,
      offset: consumed * circumference,
    });
    consumed += pPass;
  }
  if (pFail > 0) {
    segments.push({
      color: "rgb(251 113 133)", // brand-rose
      len: pFail * circumference,
      offset: consumed * circumference,
    });
    consumed += pFail;
  }
  if (pSkip > 0) {
    segments.push({
      color: "rgb(148 163 184)", // slate-400
      len: pSkip * circumference,
      offset: consumed * circumference,
    });
  }

  return (
    <div
      className={cn(
        "relative shrink-0 inline-flex items-center justify-center",
        className,
      )}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
        aria-hidden
      >
        {/* Track */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={thickness}
        />
        {segments.map((s, i) => (
          <motion.circle
            key={i}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={s.color}
            strokeWidth={thickness}
            strokeLinecap="butt"
            strokeDasharray={`${s.len} ${circumference}`}
            strokeDashoffset={-s.offset}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.05 * i, ease: "easeOut" }}
          />
        ))}
      </svg>
      {label && (
        <span
          className="absolute inset-0 flex items-center justify-center font-mono font-semibold text-white tabular-nums pointer-events-none"
          style={{ fontSize: size * 0.18 }}
        >
          {label}
        </span>
      )}
    </div>
  );
}
