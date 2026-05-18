import {
  CheckCircle2,
  XCircle,
  MinusCircle,
  Activity,
  Timer,
} from "lucide-react";
import { KpiCard } from "@/components/KpiCard";
import { TrendChart } from "@/components/TrendChart";
import { AggregateHeader } from "@/components/AggregateHeader";
import { SuiteCard } from "@/components/SuiteCard";
import { getRuns, getHistory, formatDuration, formatPct } from "@/lib/data";

export default function HomePage() {
  const runs = getRuns();
  const history = getHistory();
  const a = runs.aggregate;

  return (
    <div className="space-y-10">
      <AggregateHeader runs={runs} />

      <section className="grid gap-4 grid-cols-2 lg:grid-cols-5">
        <KpiCard
          label="Aggregate Pass Rate"
          value={formatPct(a.passRate)}
          hint={`${a.passed}/${a.total}`}
          icon={<Activity className="h-4 w-4" />}
          tone="violet"
          progress={a.passRate}
          index={0}
        />
        <KpiCard
          label="Passed"
          value={`${a.passed}`}
          hint={a.total > 0 ? formatPct(a.passed / a.total) : "—"}
          icon={<CheckCircle2 className="h-4 w-4" />}
          tone="emerald"
          progress={a.total > 0 ? a.passed / a.total : 0}
          index={1}
        />
        <KpiCard
          label="Failed"
          value={`${a.failed}`}
          hint={a.total > 0 ? formatPct(a.failed / a.total) : "—"}
          icon={<XCircle className="h-4 w-4" />}
          tone="rose"
          progress={a.total > 0 ? a.failed / a.total : 0}
          index={2}
        />
        <KpiCard
          label="Skipped"
          value={`${a.skipped}`}
          hint={a.total > 0 ? formatPct(a.skipped / a.total) : "—"}
          icon={<MinusCircle className="h-4 w-4" />}
          tone="amber"
          progress={a.total > 0 ? a.skipped / a.total : 0}
          index={3}
        />
        <KpiCard
          label="Total Duration"
          value={formatDuration(a.duration)}
          hint="all suites"
          icon={<Timer className="h-4 w-4" />}
          tone="cyan"
          index={4}
        />
      </section>

      <section>
        <TrendChart history={history} />
      </section>

      <section>
        <div className="flex items-end justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-white">Suites</h2>
            <p className="text-sm text-slate-400">
              Click any suite for the full breakdown
            </p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {runs.suites.map((s, i) => (
            <SuiteCard key={s.id} suite={s} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
