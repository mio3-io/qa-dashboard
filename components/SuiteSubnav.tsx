"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Layers, Camera } from "lucide-react";
import { cn } from "@/lib/utils";

export function SuiteSubnav({ suiteId }: { suiteId: string }) {
  const pathname = usePathname() ?? "";
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const items = [
    { label: "Overview", href: `/suites/${suiteId}`, icon: Activity },
    { label: "Features", href: `/suites/${suiteId}/features`, icon: Layers },
    { label: "Screenshots", href: `/suites/${suiteId}/screenshots`, icon: Camera },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      {items.map(({ label, href, icon: Icon }) => {
        const active =
          pathname === href || pathname === `${href}/` || pathname === `${href}/index.html`;
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs transition-all",
              active
                ? "bg-white/[0.08] text-white shadow-ring border border-white/10"
                : "border border-white/[0.06] text-slate-300 hover:bg-white/[0.04]",
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </Link>
        );
      })}
      <a
        href={`${base}/allure/${suiteId}/`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3.5 py-1.5 text-xs text-slate-200 hover:border-brand-violet/50 hover:bg-white/[0.04] transition-colors"
      >
        Allure ↗
      </a>
    </div>
  );
}
