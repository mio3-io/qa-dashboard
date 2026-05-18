import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { getSuites } from "@/lib/data";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "QA Pulse · Multi-suite Dashboard",
  description:
    "Aggregated quality signal across every mio3-io test suite — Mobile, API, and beyond. Powered by GitHub Actions.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const suites = getSuites().map((s) => ({ id: s.id, name: s.name }));

  return (
    <html lang="en" className={`${inter.variable} ${mono.variable} dark`}>
      <body className="min-h-screen antialiased">
        <div className="relative z-10">
          <Nav suites={suites} />
          <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {children}
          </main>
          <footer className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 text-xs text-slate-500">
            <div className="border-t border-white/5 pt-6 flex items-center justify-between">
              <span>
                QA Pulse · Built with Next.js, Tremor & GitHub Actions
              </span>
              <span className="font-mono">{new Date().getFullYear()}</span>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
