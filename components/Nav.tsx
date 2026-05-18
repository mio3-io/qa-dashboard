"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, LayoutGrid, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Suite } from "@/lib/types";

interface NavProps {
  suites: { id: string; name: string }[];
}

export function Nav({ suites }: NavProps) {
  const pathname = usePathname() ?? "/";
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";

  const activeSuite = pathname.startsWith("/suites/")
    ? pathname.split("/")[2]
    : null;

  return (
    <header className="sticky top-0 z-20 border-b border-white/5 bg-ink-950/60 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-3 group">
            <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-violet via-brand-fuchsia to-brand-cyan shadow-glow">
              <span className="absolute inset-0 rounded-xl opacity-50 blur-md bg-gradient-to-br from-brand-violet to-brand-cyan" />
              <LayoutGrid className="relative h-4 w-4 text-white" />
            </span>
            <div className="leading-tight">
              <div className="text-sm font-semibold text-white">QA Pulse</div>
              <div className="text-[0.65rem] uppercase tracking-[0.18em] text-slate-400">
                Multi-suite Dashboard
              </div>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <NavLink href="/" active={pathname === "/" && !activeSuite}>
              <Activity className="h-4 w-4" />
              Overview
            </NavLink>
            {suites.map((s) => (
              <NavLink
                key={s.id}
                href={`/suites/${s.id}`}
                active={activeSuite === s.id}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-br from-brand-violet to-brand-cyan" />
                {s.name}
              </NavLink>
            ))}
            <a
              href={`${base}/allure/`}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 hover:border-brand-violet/50 hover:bg-white/[0.04] transition-all"
            >
              Allure
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-all",
        active
          ? "bg-white/[0.06] text-white shadow-ring"
          : "text-slate-400 hover:text-slate-100 hover:bg-white/[0.03]",
      )}
    >
      {children}
    </Link>
  );
}
