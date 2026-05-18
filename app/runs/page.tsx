import { RunsList } from "@/components/RunsList";
import { TrendChart } from "@/components/TrendChart";
import { getHistory, formatDuration, formatPct } from "@/lib/data";

export default function RunsPage() {
  const history = getHistory();

  return (
    <div className="space-y-8">
      <div>
        <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
          History
        </div>
        <h1 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight">
          <span className="gradient-text">All runs</span>
          <span className="text-white">, newest first</span>
        </h1>
        <p className="mt-2 text-sm text-slate-400 max-w-2xl">
          Every aggregated run captured by the dashboard since it was first
          deployed. Trend chart below, full table at the bottom.
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-3">
        <Stat
          label="Total runs captured"
          value={`${history.length}`}
          hint="all suites"
        />
        <Stat
          label="Avg pass rate"
          value={formatPct(
            history.length
              ? history.reduce((acc, h) => acc + h.aggregate.passRate, 0) /
                  history.length
              : 0,
          )}
          hint="across history"
        />
        <Stat
          label="Total runtime"
          value={formatDuration(
            history.reduce((acc, h) => acc + h.aggregate.duration, 0),
          )}
          hint="sum of all runs"
        />
      </section>

      <section>
        <TrendChart
          history={history}
          title={`Trend across ${history.length} runs`}
        />
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-3">
          Execution history
        </h2>
        <RunsList history={history} />
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl glass p-5">
      <div className="text-[0.65rem] uppercase tracking-[0.18em] text-slate-400">
        {label}
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="font-mono text-2xl font-semibold text-white tabular-nums">
          {value}
        </span>
        {hint && <span className="text-xs text-slate-400">{hint}</span>}
      </div>
    </div>
  );
}
