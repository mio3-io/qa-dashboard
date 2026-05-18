import { notFound } from "next/navigation";
import {
  CheckCircle2,
  XCircle,
  MinusCircle,
  Activity,
  Timer,
} from "lucide-react";
import { KpiCard } from "@/components/KpiCard";
import { FeatureGrid } from "@/components/FeatureGrid";
import { TagBreakdown } from "@/components/TagBreakdown";
import { SuiteHeader } from "@/components/SuiteHeader";
import { SuiteSubnav } from "@/components/SuiteSubnav";
import { getRuns, getSuite, formatDuration, formatPct } from "@/lib/data";

export function generateStaticParams() {
  return getRuns().suites.map((s) => ({ id: s.id }));
}

export default function SuitePage({ params }: { params: { id: string } }) {
  const suite = getSuite(params.id);
  if (!suite) notFound();
  const s = suite.summary;

  return (
    <div className="space-y-8">
      <SuiteHeader suite={suite} />
      <SuiteSubnav suiteId={suite.id} />

      <section className="grid gap-4 grid-cols-2 lg:grid-cols-5">
        <KpiCard
          label="Pass Rate"
          value={formatPct(s.passRate)}
          hint={`${s.passed}/${s.total}`}
          icon={Activity}
          tone="violet"
          progress={s.passRate}
          index={0}
        />
        <KpiCard
          label="Passed"
          value={`${s.passed}`}
          hint={s.total > 0 ? formatPct(s.passed / s.total) : "—"}
          icon={CheckCircle2}
          tone="emerald"
          progress={s.total > 0 ? s.passed / s.total : 0}
          index={1}
        />
        <KpiCard
          label="Failed"
          value={`${s.failed}`}
          hint={s.total > 0 ? formatPct(s.failed / s.total) : "—"}
          icon={XCircle}
          tone="rose"
          progress={s.total > 0 ? s.failed / s.total : 0}
          index={2}
        />
        <KpiCard
          label="Skipped"
          value={`${s.skipped}`}
          hint={s.total > 0 ? formatPct(s.skipped / s.total) : "—"}
          icon={MinusCircle}
          tone="amber"
          progress={s.total > 0 ? s.skipped / s.total : 0}
          index={3}
        />
        <KpiCard
          label="Duration"
          value={formatDuration(s.duration)}
          hint="latest run"
          icon={Timer}
          tone="cyan"
          index={4}
        />
      </section>

      <section>
        <div className="flex items-end justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-white">Features</h2>
            <p className="text-sm text-slate-400">
              {suite.features.length} feature
              {suite.features.length === 1 ? "" : "s"} in this run
            </p>
          </div>
        </div>
        <FeatureGrid features={suite.features} />
      </section>

      {suite.tags.length > 0 && (
        <section>
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-white">Tags</h2>
            <p className="text-sm text-slate-400">
              Aggregated by Behave tag across this suite
            </p>
          </div>
          <TagBreakdown tags={suite.tags} />
        </section>
      )}
    </div>
  );
}
