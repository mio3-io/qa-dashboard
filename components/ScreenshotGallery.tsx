"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Camera } from "lucide-react";
import { assetPath } from "@/lib/data";
import type { ScreenshotEntry } from "@/lib/types";

export function ScreenshotGallery({ shots }: { shots: ScreenshotEntry[] }) {
  const [active, setActive] = useState<ScreenshotEntry | null>(null);

  if (shots.length === 0) {
    return (
      <div className="rounded-2xl glass p-10 text-center">
        <Camera className="mx-auto h-10 w-10 text-slate-500" />
        <h3 className="mt-4 text-lg font-semibold text-white">All clear</h3>
        <p className="mt-1 text-sm text-slate-400">
          No failure screenshots in the latest run. Nothing to investigate.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4 [column-fill:_balance]">
        {shots.map((s, i) => (
          <motion.button
            key={s.path}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.04 }}
            onClick={() => setActive(s)}
            className="group mb-4 block w-full overflow-hidden rounded-xl glass glass-hover text-left"
          >
            <div className="relative">
              <img
                src={assetPath(`/data/${s.path}`)}
                alt={s.scenario}
                className="w-full transition-transform duration-500 group-hover:scale-[1.02]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/95 via-ink-950/20 to-transparent opacity-90" />
              <div className="absolute inset-x-0 bottom-0 p-3">
                <span className="chip chip-failed">{s.feature}</span>
                <div className="mt-1.5 text-xs text-slate-100 line-clamp-2">
                  {s.scenario}
                </div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/80 backdrop-blur-md p-4"
            onClick={() => setActive(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative max-h-[90vh] max-w-5xl overflow-hidden rounded-2xl glass"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActive(null)}
                className="absolute right-3 top-3 z-10 rounded-full bg-ink-900/70 p-2 text-slate-200 hover:bg-ink-700 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
              <img
                src={assetPath(`/data/${active.path}`)}
                alt={active.scenario}
                className="max-h-[80vh] w-auto"
              />
              <div className="p-4 border-t border-white/5">
                <div className="text-xs text-slate-400">{active.feature}</div>
                <div className="mt-1 text-sm text-white">{active.scenario}</div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {active.tags.map((t) => (
                    <span key={t} className="chip">{t}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
