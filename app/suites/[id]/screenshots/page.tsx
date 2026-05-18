import { notFound } from "next/navigation";
import { ScreenshotGallery } from "@/components/ScreenshotGallery";
import { SuiteHeader } from "@/components/SuiteHeader";
import { SuiteSubnav } from "@/components/SuiteSubnav";
import { getRuns, getSuite } from "@/lib/data";

export function generateStaticParams() {
  return getRuns().suites.map((s) => ({ id: s.id }));
}

export default function SuiteScreenshotsPage({
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
        <h2 className="text-xl font-semibold text-white">Failure Screenshots</h2>
        <p className="mt-1 text-sm text-slate-400">
          Captured automatically when a scenario fails. Click any tile to expand.
        </p>
      </div>
      <ScreenshotGallery shots={suite.screenshots} />
    </div>
  );
}
