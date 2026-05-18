import { notFound } from "next/navigation";
import { ScenarioList } from "@/components/ScenarioList";
import { SuiteHeader } from "@/components/SuiteHeader";
import { SuiteSubnav } from "@/components/SuiteSubnav";
import { getRuns, getSuite } from "@/lib/data";

export function generateStaticParams() {
  return getRuns().suites.map((s) => ({ id: s.id }));
}

export default function SuiteFeaturesPage({
  params,
}: {
  params: { id: string };
}) {
  const suite = getSuite(params.id);
  if (!suite) notFound();

  return (
    <div className="space-y-6">
      <SuiteHeader suite={suite} />
      <SuiteSubnav suiteId={suite.id} />
      <div>
        <h2 className="text-xl font-semibold text-white">
          Features &amp; Scenarios
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Per-scenario breakdown with failure messages, screenshots and Behave
          tags.
        </p>
      </div>
      <ScenarioList features={suite.features} />
    </div>
  );
}
